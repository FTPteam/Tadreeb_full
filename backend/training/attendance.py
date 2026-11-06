"""Attendance calculation and alert (FR-21, FR-22, BR-05).

Rules (agreed in BACKEND_PLAN.md):
- Attendance rate = Confirmed days ÷ Working days (Sunday to Thursday) from placement start date until yesterday.
- Working days are Sunday through Thursday (weekday in 6, 0, 1, 2, 3). Friday (4) and Saturday (5) are weekend.
- A working day with no log is counted as absent.
- Excused days / Sick leave (مرض): marked by provider with absence_reason, and completely excluded from calculation.
- Alert: when attendance drops below TADREEB_ATTENDANCE_ALERT (80%), notify student and supervisor.
"""

from datetime import timedelta
from decimal import Decimal

from django.conf import settings
from django.utils import timezone

from notifications.models import Notification, notify

# Sunday (6) through Thursday (3) in Python's weekday() convention:
# Monday=0, Tuesday=1, Wednesday=2, Thursday=3, Friday=4, Saturday=5, Sunday=6
WORKING_WEEKDAYS = {6, 0, 1, 2, 3}

WEEKDAY_NAMES_AR = {
    6: "الأحد",
    0: "الإثنين",
    1: "الثلاثاء",
    2: "الأربعاء",
    3: "الخميس",
    4: "الجمعة",
    5: "السبت",
}


def get_working_days(start_date, end_date):
    """Return all Sunday-Thursday calendar dates between start_date and end_date inclusive."""
    if not start_date or not end_date or start_date > end_date:
        return []
    days = []
    current = start_date
    while current <= end_date:
        if current.weekday() in WORKING_WEEKDAYS:
            days.append(current)
        current += timedelta(days=1)
    return days


def calculate_attendance(application, up_to_date=None):
    """Calculate the attendance rate and statistics for an application.

    Returns a dict with:
    - attendance_rate: float (0.0 to 100.0)
    - confirmed_days: int
    - absent_days: int
    - excused_days: int
    - working_days: int (effective working days denominator)
    - total_calendar_working_days: int (before subtracting excused)
    - alert: bool (rate < TADREEB_ATTENDANCE_ALERT)
    - start_date: date or None
    - end_date: date or None
    - daily_breakdown: list of dicts for each date in range
    """
    threshold = getattr(settings, "TADREEB_ATTENDANCE_ALERT", 80)
    placement = application.active_placement
    if not placement:
        placement = application.placements.order_by("-created_at").first()

    if not placement or not placement.start_date:
        return {
            "attendance_rate": 100.0,
            "confirmed_days": 0,
            "absent_days": 0,
            "excused_days": 0,
            "working_days": 0,
            "total_calendar_working_days": 0,
            "alert": False,
            "start_date": None,
            "end_date": None,
            "daily_breakdown": [],
        }

    start_date = placement.start_date
    yesterday = (up_to_date or timezone.localdate()) - timedelta(days=1)
    calc_end_date = min(yesterday, placement.end_date) if placement.end_date else yesterday

    if calc_end_date < start_date:
        # Training hasn't completed its first full day yet.
        return {
            "attendance_rate": 100.0,
            "confirmed_days": 0,
            "absent_days": 0,
            "excused_days": 0,
            "working_days": 0,
            "total_calendar_working_days": 0,
            "alert": False,
            "start_date": start_date,
            "end_date": placement.end_date,
            "daily_breakdown": [],
        }

    # Fetch all logs in range
    logs_by_date = {
        log.date: log
        for log in application.daily_logs.filter(date__gte=start_date, date__lte=calc_end_date)
    }

    all_dates = []
    curr = start_date
    while curr <= calc_end_date:
        all_dates.append(curr)
        curr += timedelta(days=1)

    confirmed_count = 0
    excused_count = 0
    absent_count = 0
    calendar_working_days = 0
    daily_breakdown = []

    for d in all_dates:
        is_working = d.weekday() in WORKING_WEEKDAYS
        log = logs_by_date.get(d)
        day_name = WEEKDAY_NAMES_AR.get(d.weekday(), "")

        if is_working:
            calendar_working_days += 1

        if log and (log.is_excused or log.absence_reason):
            # Excused day / sick leave: completely excluded from calculation
            status_code = "excused"
            status_label = "مرض" if "مرض" in log.absence_reason else "بعذر"
            notes = log.absence_reason or log.notes
            if is_working:
                excused_count += 1
            hours = float(log.hours)
        elif is_working:
            if log and log.confirmed_at:
                confirmed_count += 1
                status_code = "present"
                status_label = "حاضر"
                notes = log.notes or log.tasks
                hours = float(log.hours)
            else:
                absent_count += 1
                status_code = "absent"
                status_label = "غائب"
                notes = "غياب" if not log else "بانتظار تأكيد الجهة"
                hours = float(log.hours) if log else 0.0
        else:
            status_code = "weekend"
            status_label = "عطلة"
            notes = "عطلة أسبوعية"
            hours = float(log.hours) if log else 0.0

        daily_breakdown.append({
            "date": str(d),
            "day": day_name,
            "status": status_label,
            "status_code": status_code,
            "notes": notes,
            "hours": hours,
            "is_working_day": is_working,
            "confirmed": bool(log and log.confirmed_at),
        })

    effective_working_days = calendar_working_days - excused_count
    if effective_working_days <= 0:
        rate = 100.0
    else:
        rate = round((confirmed_count / effective_working_days) * 100, 1)

    rate = min(rate, 100.0)
    alert = rate < threshold and effective_working_days > 0

    return {
        "attendance_rate": rate,
        "confirmed_days": confirmed_count,
        "absent_days": absent_count,
        "excused_days": excused_count,
        "working_days": effective_working_days,
        "total_calendar_working_days": calendar_working_days,
        "alert": alert,
        "start_date": start_date,
        "end_date": placement.end_date,
        "daily_breakdown": daily_breakdown,
    }


def check_attendance_and_notify(application):
    """FR-22: when attendance drops below TADREEB_ATTENDANCE_ALERT, notify student and supervisor."""
    stats = calculate_attendance(application)
    if not stats["alert"]:
        return False

    rate = stats["attendance_rate"]
    threshold = getattr(settings, "TADREEB_ATTENDANCE_ALERT", 80)
    student = application.student
    student_name = student.get_full_name() or student.username

    # Avoid duplicate notifications if unread alert already exists
    has_student_alert = Notification.objects.filter(
        recipient=student,
        kind=Notification.Kind.TRAINING,
        title="تنبيه انخفاض نسبة الحضور",
        is_read=False,
    ).exists()

    if not has_student_alert:
        notify(
            student,
            Notification.Kind.TRAINING,
            "تنبيه انخفاض نسبة الحضور",
            f"نسبة حضورك بلغت {rate:.1f}%، وهي أقل من الحد المطلوب ({threshold}%).",
        )

    if application.supervisor:
        has_supervisor_alert = Notification.objects.filter(
            recipient=application.supervisor,
            kind=Notification.Kind.TRAINING,
            title=f"تنبيه انخفاض حضور طالب: {student_name}",
            is_read=False,
        ).exists()

        if not has_supervisor_alert:
            notify(
                application.supervisor,
                Notification.Kind.TRAINING,
                f"تنبيه انخفاض حضور طالب: {student_name}",
                f"انخفضت نسبة حضور الطالب {student_name} إلى {rate:.1f}% (أقل من {threshold}%).",
            )

    return True
