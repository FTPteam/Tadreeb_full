"""NFR-05: lockout after 5 failed login attempts for 15 minutes."""

from django.conf import settings
from django.core.cache import cache

from .models import User


def normalize_login_identifier(username):
    """Map either username or email to a single lowercase lookup key."""
    if not username:
        return ""
    cleaned = str(username).strip().lower()
    if "@" in cleaned:
        user = User.objects.filter(email__iexact=cleaned).first()
        if user:
            return user.username.lower()
    return cleaned


def lockout_key(identifier):
    return f"login_lockout:{identifier}"


def failures_key(identifier):
    return f"login_failures:{identifier}"


def is_locked_out(identifier):
    return bool(identifier and cache.get(lockout_key(identifier)))


def record_failed_login(identifier):
    """Increment failure count. If it reaches the limit, activate the 15-minute lockout."""
    if not identifier:
        return False
    key = failures_key(identifier)
    max_failures = getattr(settings, "TADREEB_LOGIN_MAX_FAILURES", 5)
    lockout_seconds = getattr(settings, "TADREEB_LOGIN_LOCKOUT_SECONDS", 15 * 60)

    failures = cache.get(key, 0) + 1
    if failures >= max_failures:
        cache.set(lockout_key(identifier), True, timeout=lockout_seconds)
        cache.delete(key)
        return True
    cache.set(key, failures, timeout=lockout_seconds)
    return False


def clear_login_lockout(identifier):
    if identifier:
        cache.delete(lockout_key(identifier))
        cache.delete(failures_key(identifier))
