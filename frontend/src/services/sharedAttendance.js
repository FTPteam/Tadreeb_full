import { getAllTrainees } from '../pages/training-provider/traineesStore';
// Shared browser-only attendance read model.
// Provider attendance is stored on the trainee record and read by student/admin portals.
const TRAINEES_KEY = "cis-provider-trainees-v1";

function readTrainees() { return getAllTrainees(); }

export function getTraineeByStudentId(studentId) {
  const id = String(studentId || "").trim();
  if (!id) return null;
  const matches = readTrainees().filter(item => String(item.studentId || '') === id);
  return matches.find(item => item.status === 'active') || matches.find(item => item.status === 'not_started') || matches[0] || null;
}

export function getSharedAttendance(studentId) {
  const trainee = getTraineeByStudentId(studentId);
  if (!trainee) return { trainee: null, records: [], stats: { present: 0, late: 0, absent: 0, total: 0, hours: 0, rate: 0 } };
  const records = (trainee.attendanceRecords || [])
    .filter((row) => row && row.date && ["present", "late", "absent"].includes(row.status))
    .slice()
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const present = records.filter((row) => row.status === "present").length;
  const late = records.filter((row) => row.status === "late").length;
  const absent = records.filter((row) => row.status === "absent").length;
  const total = records.length;
  const hours = records.reduce((sum, row) => sum + (row.status === "absent" ? 0 : Number(row.hours ?? row.durationHours ?? 0)), 0);
  return { trainee, records, stats: { present, late, absent, total, hours, rate: total ? Math.round(((present + late) / total) * 100) : 0 } };
}

export function subscribeSharedAttendance(callback) {
  if (typeof window === "undefined") return () => {};
  const refresh = (event) => {
    if (!event || event.key === TRAINEES_KEY) callback();
  };
  window.addEventListener("storage", refresh);
  window.addEventListener("cis-provider-trainees-updated", callback);
  return () => {
    window.removeEventListener("storage", refresh);
    window.removeEventListener("cis-provider-trainees-updated", callback);
  };
}
