
export const EVALUATION_STORAGE_KEY = "cis-evaluations-v2";

export const CRITERIA = [
  { key: "technical", label: "المهارات الفنية والتطبيقية" },
  { key: "discipline", label: "الالتزام والانضباط" },
  { key: "teamwork", label: "التواصل والعمل الجماعي" },
  { key: "problemSolving", label: "الابتكار وحل المشكلات" },
];

export const INITIAL_EVALUATIONS = [
  {
    id: "1",
    student: "أمل أحمد",
    fullName: "أمل أحمد صيام",
    studentId: "20231234",
    organization: "شركة القدس للاتصالات",
    fieldSupervisor: "م. خالد عودة",
    fieldScore: 4,
    academicSupervisor: "د. سامر يوسف",
    academicScore: 4.5,
    academicCriteria: {
      technical: 4,
      discipline: 5,
      teamwork: 4,
      problemSolving: 5,
    },
    fieldCriteria: {
      technical: 4,
      discipline: 5,
      teamwork: 4,
      problemSolving: 4,
    },
    fieldNote:
      "أظهرت الطالبة مهارات جيدة في بناء الواجهات، والتزمت بساعات التدريب وتعاونت مع الفريق.",
    academicNote: "",
    attendance: 92,
    status: "completed",
  },
  {
    id: "2",
    student: "محمود رضوان",
    fullName: "محمود إبراهيم رضوان",
    studentId: "20231045",
    organization: "شركة المشرق الرقمية",
    fieldSupervisor: "م. أحمد سالم",
    fieldScore: 3.5,
    academicScore: null,
    academicCriteria: {},
    attendance: 90,
    status: "review",
  },
  {
    id: "3",
    student: "أنس البيطار",
    fullName: "أنس كمال البيطار",
    studentId: "20231302",
    organization: "شركة الأمل للأنظمة الصناعية",
    fieldSupervisor: "م. خالد عودة",
    fieldScore: 4.5,
    academicScore: 4.5,
    academicCriteria: {
      technical: 5,
      discipline: 5,
      teamwork: 4,
      problemSolving: 4,
    },
    attendance: 94,
    status: "approved",
  },
  {
    id: "4",
    student: "هدى شهير",
    fullName: "هدى يوسف شهير",
    studentId: "20231450",
    organization: "استوديو بيكسل للتصميم",
    fieldScore: null,
    academicScore: null,
    academicCriteria: {},
    attendance: null,
    status: "not_started",
  },
  {
    id: "5",
    student: "سارة عبد الرحمن",
    fullName: "سارة عبد الرحمن",
    studentId: "20231188",
    organization: "شركة جوال",
    fieldScore: 4.2,
    academicScore: 4.4,
    academicCriteria: {
      technical: 4,
      discipline: 5,
      teamwork: 4,
      problemSolving: 4,
    },
    attendance: 91,
    status: "completed",
  },
  {
    id: "6",
    student: "بلال الشيخ",
    fullName: "بلال مصطفى الشيخ",
    studentId: "20231533",
    organization: "مركز الصيانة الفنية المتقدم",
    fieldScore: 3.8,
    academicScore: null,
    academicCriteria: {},
    attendance: 87,
    status: "review",
  },
  {
    id: "7",
    student: "نور خليل",
    fullName: "نور أحمد خليل",
    studentId: "20231628",
    organization: "شركة المشرق الرقمية",
    fieldScore: 4.8,
    academicScore: 4.6,
    academicCriteria: {
      technical: 5,
      discipline: 5,
      teamwork: 4,
      problemSolving: 4,
    },
    attendance: 97,
    status: "approved",
  },
  {
    id: "8",
    student: "محمد العطار",
    fullName: "محمد خالد العطار",
    studentId: "20231601",
    organization: "شركة القدس للاتصالات",
    fieldScore: null,
    academicScore: null,
    academicCriteria: {},
    attendance: null,
    status: "not_started",
  },
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

function readStoredUpdates() {
  try {
    const value = JSON.parse(
      localStorage.getItem(EVALUATION_STORAGE_KEY) || "{}"
    );

    return value && typeof value === "object" &&
      !Array.isArray(value)
      ? value
      : {};
  } catch {
    return {};
  }
}

export function getEvaluations() {
  const updates = readStoredUpdates();

  return INITIAL_EVALUATIONS.map((item) => ({
    ...item,
    ...(updates[item.id] || {}),
  }));
}

export function getEvaluation(id) {
  return getEvaluations().find(
    (item) => String(item.id) === String(id)
  ) || null;
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

export function saveEvaluation(updatedEvaluation) {
  if (!updatedEvaluation?.id) {
    throw new Error("معرّف التقييم غير صالح");
  }

  const updates = readStoredUpdates();

  localStorage.setItem(
    EVALUATION_STORAGE_KEY,
    JSON.stringify({
      ...updates,
      [updatedEvaluation.id]: {
        ...updatedEvaluation,
      },
    })
  );

  window.dispatchEvent(new Event("evaluations-updated"));
  window.dispatchEvent(new Event("training-monitoring-updated"));
}

export function formatScore(value, digits = 2) {
  return value == null
    ? "—"
    : Number(value).toFixed(digits);
}
