// Dedicated API service module for Student Management (FR-03, FR-05, FR-06).
import { api, apiList } from "./client";

export async function fetchStudents(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.department) query.set("department", params.department);
  if (params.specialization) query.set("specialization", params.specialization);
  const qStr = query.toString() ? `?${query.toString()}` : "";
  const list = await apiList(`/students/${qStr}`);
  return list.map(normalizeStudent);
}

export async function fetchStudent(idOrUsername) {
  if (!idOrUsername) return null;
  // If it's a numeric profile ID
  if (/^\d+$/.test(idOrUsername) && Number(idOrUsername) < 100000) {
    try {
      const data = await api(`/students/${idOrUsername}/`);
      return normalizeStudent(data);
    } catch {
      // fallback to search by username
    }
  }
  // Otherwise search by username / university_id
  const results = await apiList(`/students/?search=${encodeURIComponent(idOrUsername)}`);
  const found = results.find(
    s => String(s.university_id) === String(idOrUsername) || String(s.user_id) === String(idOrUsername) || String(s.id) === String(idOrUsername)
  );
  return found ? normalizeStudent(found) : null;
}

export function normalizeStudent(s) {
  return {
    id: String(s.university_id || s.id),
    profileId: s.id,
    userId: s.user_id,
    universityId: String(s.university_id || ""),
    name: s.full_name || s.university_id || "—",
    fullName: s.full_name || s.university_id || "—",
    email: s.email || "—",
    phone: s.phone || "—",
    major: s.specialization_name || "—",
    specializationId: s.specialization,
    specializationName: s.specialization_name || "—",
    departmentId: s.department,
    departmentName: s.department_name || "—",
    gpa: s.gpa || "—",
    academicStatus: s.academic_status || "active",
    completedCreditHours: s.completed_credit_hours || 0,
    status: s.training_status || "لم يبدأ",
    backendStatus: s.backend_training_status || null,
    organization: s.organization || "—",
    supervisor: s.supervisor || "—",
    supervisorId: s.supervisor_id || null,
    startDate: s.start_date || "—",
    eligibility: s.eligibility || null,
  };
}

export async function createStudent({
  username,
  firstName,
  lastName,
  email,
  department,
  specialization,
  phone,
  password,
}) {
  // 1. Create the user account via /api/users/
  const user = await api("/users/", {
    method: "POST",
    body: {
      username: String(username).trim(),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      role: "student",
      ...(password ? { password } : {}),
    },
  });

  // 2. Fetch the newly created student profile
  const students = await apiList(`/students/?search=${encodeURIComponent(user.username)}`);
  const profile = students.find(s => s.user_id === user.id || s.university_id === user.username);

  // 3. Update department, specialization, and phone if provided
  if (profile && (department || specialization || phone)) {
    const patchBody = {};
    if (department) patchBody.department = department;
    if (specialization) patchBody.specialization = specialization;
    if (phone) patchBody.phone = phone;
    await api(`/students/${profile.id}/`, {
      method: "PATCH",
      body: patchBody,
    });
  }

  return user;
}

export async function updateStudent(profileId, userId, payload) {
  // 1. Update user fields (first_name, last_name, email) if present
  if (userId && (payload.firstName !== undefined || payload.lastName !== undefined || payload.email !== undefined)) {
    const userPatch = {};
    if (payload.firstName !== undefined) userPatch.first_name = payload.firstName;
    if (payload.lastName !== undefined) userPatch.last_name = payload.lastName;
    if (payload.email !== undefined) userPatch.email = payload.email;
    await api(`/users/${userId}/`, {
      method: "PATCH",
      body: userPatch,
    });
  }

  // 2. Update profile fields (phone, department, specialization, gpa, academic_status)
  if (profileId) {
    const profilePatch = {};
    if (payload.phone !== undefined) profilePatch.phone = payload.phone;
    if (payload.department !== undefined) profilePatch.department = payload.department;
    if (payload.specialization !== undefined) profilePatch.specialization = payload.specialization;
    if (payload.gpa !== undefined) profilePatch.gpa = payload.gpa;
    if (payload.academicStatus !== undefined) profilePatch.academic_status = payload.academicStatus;
    return api(`/students/${profileId}/`, {
      method: "PATCH",
      body: profilePatch,
    });
  }
}

export async function deleteStudent(userId, profileId) {
  if (userId) {
    return api(`/users/${userId}/`, { method: "DELETE" });
  }
  if (profileId) {
    return api(`/students/${profileId}/`, { method: "DELETE" });
  }
  throw new Error("لم يتم تحديد معرّف الطالب للحذف.");
}

export async function fetchDepartments() {
  return api("/departments/");
}

export async function fetchSupervisors() {
  return apiList("/users/?role=supervisor&is_active=true");
}
