import { api, apiList } from "../../api/client";

export const EVALUATION_STORAGE_KEY = "cis-evaluations-v2";

export const CRITERIA = [
  { key: "technical", label: "المهارات الفنية والتطبيقية" },
  { key: "discipline", label: "الالتزام والانضباط" },
  { key: "teamwork", label: "التواصل والعمل الجماعي" },
  { key: "problemSolving", label: "الابتكار وحل المشكلات" },
];

export const STATUS_CONFIG = {
  completed: {
    label: "مكتمل",
    className: "bg-[#DCFCE7] text-[#15803D]",
  },
  review: {
    label: "قيد المراجعة",
    className: "bg-[#FFF0E4] text-[#B54708]",
  },
  approved: {
    label: "معتمد",
    className: "bg-[#E8EEF9] text-[#09379A]",
  },
  not_started: {
    label: "لم يبدأ",
    className: "bg-[#F1F5F9] text-[#475569]",
  },
};

let cachedEvaluations = [];
let hasFetched = false;
let isFetching = false;

function mapStatus(appStatus, hasField, hasAcademic) {
  if (appStatus === "certified" || appStatus === "approved") return "approved";
  if (appStatus === "completed") return "completed";
  if (hasField || hasAcademic) return "review";
  return "not_started";
}

export async function refreshEvaluations() {
  if (isFetching) return cachedEvaluations;
  isFetching = true;
  try {
    const [apps, evals] = await Promise.all([
      apiList("/applications/").catch(() => []),
      apiList("/evaluations/").catch(() => []),
    ]);

    const evalsByApp = {};
    (evals || []).forEach((e) => {
      const appId = String(e.application);
      if (!evalsByApp[appId]) evalsByApp[appId] = {};
      evalsByApp[appId][e.kind] = e;
    });

    cachedEvaluations = (apps || []).map((app) => {
      const appId = String(app.id);
      const appEvals = evalsByApp[appId] || {};
      const providerEval = appEvals["provider"] || null;
      const supervisorEval = appEvals["supervisor"] || null;

      const fieldScore = providerEval?.total != null
        ? Math.round((Number(providerEval.total) / 20) * 10) / 10
        : null;

      const academicScore = supervisorEval?.total != null
        ? Math.round((Number(supervisorEval.total) / 20) * 10) / 10
        : null;

      const status = mapStatus(app.status, Boolean(providerEval), Boolean(supervisorEval));

      const studentName = app.student_name || `طالب ${app.student}`;
      const universityId = String(app.university_id || app.student || appId);

      const fieldCriteria = providerEval?.scores || {
        technical: 4,
        discipline: 5,
        teamwork: 4,
        problemSolving: 4,
      };

      const supScores = supervisorEval?.scores || {};
      const academicCriteria = {
        technical: supScores.development || supScores.reports || 4,
        discipline: supScores.commitment || 5,
        teamwork: supScores.goals || 4,
        problemSolving: supScores.benefit || 4,
      };

      return {
        id: appId,
        applicationId: app.id,
        backendStatus: app.status,
        student: studentName,
        fullName: studentName,
        studentId: universityId,
        organization: app.placement?.provider_name || app.organization_name || "جهة التدريب",
        fieldSupervisor: app.placement?.provider_name || "م. خالد عودة",
        fieldScore,
        academicSupervisor: app.supervisor_name || "د. سامر يوسف",
        academicScore,
        academicCriteria: supervisorEval ? academicCriteria : {},
        fieldCriteria: providerEval ? fieldCriteria : {},
        fieldNote: providerEval?.notes || "",
        academicNote: supervisorEval?.notes || "",
        attendance: 92,
        status,
        providerEvalId: providerEval?.id || null,
        supervisorEvalId: supervisorEval?.id || null,
      };
    });

    hasFetched = true;
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("evaluations-updated"));
      window.dispatchEvent(new Event("training-monitoring-updated"));
    }
  } catch {
    // Keep cached
  } finally {
    isFetching = false;
  }
  return cachedEvaluations;
}

if (typeof window !== "undefined") {
  refreshEvaluations();
}

export function getEvaluations() {
  if (!hasFetched && !isFetching) {
    refreshEvaluations();
  }
  return cachedEvaluations;
}

export function getEvaluation(id) {
  if (!hasFetched && !isFetching) {
    refreshEvaluations();
  }
  const targetId = String(id ?? "").trim();
  return (
    cachedEvaluations.find(
      (item) =>
        String(item.id) === targetId ||
        String(item.applicationId) === targetId ||
        String(item.studentId) === targetId
    ) || null
  );
}

export function calculateFinalScore(evaluation) {
  const field = Number(evaluation?.fieldScore);
  const academic = Number(evaluation?.academicScore);

  if (
    evaluation?.fieldScore == null ||
    evaluation?.academicScore == null ||
    !Number.isFinite(field) ||
    !Number.isFinite(academic)
  ) {
    return null;
  }

  return Math.round(((field + academic) / 2) * 100) / 100;
}

export function hasCompleteAcademicCriteria(evaluation) {
  const criteria = evaluation?.academicCriteria || {};

  return CRITERIA.every(({ key }) => {
    const value = Number(criteria[key]);
    return (
      criteria[key] != null &&
      Number.isInteger(value) &&
      value >= 1 &&
      value <= 5
    );
  });
}

export function canReviewFinal(evaluation) {
  return (
    evaluation?.status !== "not_started" &&
    evaluation?.fieldScore != null &&
    evaluation?.academicScore != null
  );
}

export async function saveEvaluation(updatedEvaluation) {
  if (!updatedEvaluation?.id) {
    throw new Error("معرّف التقييم غير صالح");
  }

  const appId = updatedEvaluation.applicationId || updatedEvaluation.id;

  // 1. If status is being approved (coordinator approval):
  if (updatedEvaluation.status === "approved") {
    await api(`/applications/${appId}/approve/`, { method: "POST" });
    await refreshEvaluations();
    return;
  }

  // 2. If academic evaluation is being submitted/updated:
  if (updatedEvaluation.academicCriteria && Object.keys(updatedEvaluation.academicCriteria).length > 0) {
    const scores = {
      commitment: Number(updatedEvaluation.academicCriteria.discipline || 5),
      benefit: Number(updatedEvaluation.academicCriteria.problemSolving || 4),
      development: Number(updatedEvaluation.academicCriteria.technical || 4),
      reports: Number(updatedEvaluation.academicCriteria.technical || 4),
      goals: Number(updatedEvaluation.academicCriteria.teamwork || 4),
    };

    const notes = updatedEvaluation.academicNote || "تقييم أكاديمي";
    const existingEvalId = updatedEvaluation.supervisorEvalId;

    if (existingEvalId) {
      await api(`/evaluations/${existingEvalId}/`, {
        method: "PATCH",
        body: { scores, notes },
      });
    } else {
      await api("/evaluations/", {
        method: "POST",
        body: { application: Number(appId), scores, notes },
      });
    }
  }

  await refreshEvaluations();
}

export function formatScore(value, digits = 2) {
  return value == null ? "—" : Number(value).toFixed(digits);
}
