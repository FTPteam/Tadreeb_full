
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ========================================
// STUDENT PAGES
// ========================================

import Login from "./pages/student/Login";
import ForgotPassword from "./pages/student/ForgotPassword";
import ResetPassword from "./pages/student/ResetPassword";

import Dashboard from "./pages/student/Dashboard";
import TrainingOpportunities from "./pages/student/TrainingOpportunities";
import TrainingDetails from "./pages/student/TrainingDetails";
import TrainingApplication from "./pages/student/TrainingApplication";
import TrainingDocuments from "./pages/student/TrainingDocuments";
import Applications from "./pages/student/Applications";
import ApplicationStatus from "./pages/student/ApplicationStatus";
import TrainingAccepted from "./pages/student/TrainingAccepted";
import TrainingProfile from "./pages/student/TrainingProfile";
import TrainingPlan from "./pages/student/TrainingPlan";
import DailyTrainingLog from "./pages/student/DailyTrainingLog";
import DailyTrainingLogDetails from "./pages/student/DailyTrainingLogDetails";
import Attendance from "./pages/student/Attendance";
import AbsenceExcuse from "./pages/student/AbsenceExcuse";
import Reports from "./pages/student/Reports";
import Evaluation from "./pages/student/Evaluation";
import FinishTraining from "./pages/student/FinishTraining";
import Certificate from "./pages/student/Certificate";
import Notifications from "./pages/student/Notifications";
import Profile from "./pages/student/Profile";
import StudentSettings from "./pages/student/StudentSettings";


// ========================================
// ADMIN PAGES
// ========================================

import AdminDashboard from "./pages/admin/AdminDashboard";
import RecentActivities from "./pages/admin/RecentActivities";
import TrainingStatistics from "./pages/admin/TrainingStatistics";
import OrganizationStatistics from "./pages/admin/OrganizationStatistics";
import StudentStatistics from "./pages/admin/StudentStatistics";
import PerformanceReports from "./pages/admin/PerformanceReports";

import Students from "./pages/admin/Students";
import StudentDetails from "./pages/admin/StudentDetails";
import AddStudent from "./pages/admin/AddStudent";
import EditStudent from "./pages/admin/EditStudent";
import StudentTrainingHistory from "./pages/admin/StudentTrainingHistory";

import TrainingRequests from "./pages/admin/TrainingRequests";
import TrainingRequestDetails from "./pages/admin/TrainingRequestDetails";

import TrainingOrganizations from "./pages/admin/TrainingOrganizations";
import TrainingOrganizationDetails from "./pages/admin/TrainingOrganizationDetails";
import ApprovalsTrainingProviders from "./pages/admin/ApprovalsTrainingProviders";

import Approvals from "./pages/admin/Approvals";
import ApprovalDetails from "./pages/admin/ApprovalDetails";
import TrainingMonitoring from "./pages/admin/TrainingMonitoring";
import StudentTrainingDetails from "./pages/admin/StudentTrainingDetails";
import AdminDailyTrainingLogs from "./pages/admin/DailyTrainingLogs";
import CompleteTraining from "./pages/admin/CompleteTraining";
import TrainingCertificate from "./pages/admin/TrainingCertificate";
import ReportsAdmin from "./pages/admin/Reports";
import ReportDetails from "./pages/admin/ReportDetails";
import ReviewReport from "./pages/admin/ReviewReport";
import Evaluations from "./pages/admin/Evaluations";
import EvaluationDetails from "./pages/admin/EvaluationDetails";
import AddEvaluation from "./pages/admin/AddEvaluation";
import FinalEvaluationReview from "./pages/admin/FinalEvaluationReview";
import Announcements from "./pages/admin/Announcements";

import AdminProfile from "./pages/admin/Profile";
import AdminSettings from "./pages/admin/Settings";
import AddTrainingOrganization from "./pages/admin/AddTrainingOrganization";
import EditTrainingOrganization from "./pages/admin/EditTrainingOrganization";
import AdminLogin from "./pages/admin/auth/Login";
import AdminForgotPassword from "./pages/admin/auth/ForgotPassword";
import AdminResetPassword from "./pages/admin/auth/ResetPassword";

// ========================================
// STUDENT PAGES
// ========================================

import TrainingProviderLogin from "./pages/training-provider/Login";
import TrainingProviderRegister from "./pages/training-provider/Register";
import TrainingProviderForgotPassword from "./pages/training-provider/ForgotPassword";
import TrainingProviderResetPassword from "./pages/training-provider/ResetPassword";
import TrainingProviderDashboard from "./pages/training-provider/Dashboard";
import TrainingProviderOpportunities from "./pages/training-provider/Opportunities";
import TrainingProviderOpportunityDetails from "./pages/training-provider/OpportunityDetails";
import TrainingProviderOpportunityForm from "./pages/training-provider/OpportunityForm";
import TrainingProviderRequests from "./pages/training-provider/Requests";
import TrainingProviderTrainees from "./pages/training-provider/Trainees";
import TrainingProviderTraineeDetails from "./pages/training-provider/TraineeDetails";
import TrainingProviderSettings from "./pages/training-provider/Settings";
import TrainingProviderNotifications from "./pages/training-provider/Notifications";
import TrainingProviderEvaluations from "./pages/training-provider/Evaluations";
import TrainingProviderStatistics from "./pages/training-provider/Statistics";
import TrainingProviderProfile from "./pages/training-provider/Profile";
import TrainingProviderSupervisors from "./pages/training-provider/Supervisors";
import TrainingProviderAttendance from "./pages/training-provider/Attendance";

// ========================================
// MAIN APP
// ========================================

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =================================
            AUTHENTICATION
        ================================= */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route path="/student/login" element={<Login />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* =================================
            STUDENT ROUTES
        ================================= */}

        <Route
          path="/student/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/student/opportunities"
          element={<TrainingOpportunities />}
        />

        <Route
          path="/student/opportunities/details"
          element={<TrainingDetails />}
        />

        <Route
          path="/student/apply-training"
          element={<TrainingApplication />}
        />

        <Route
          path="/student/apply-training/documents"
          element={<TrainingDocuments />}
        />

        <Route
          path="/student/applications"
          element={<Applications />}
        />

        <Route
          path="/student/applications/:id/status"
          element={<ApplicationStatus />}
        />

        <Route
          path="/student/applications/:id/accepted"
          element={<TrainingAccepted />}
        />

        <Route
          path="/student/training-profile"
          element={<TrainingProfile />}
        />

        <Route
          path="/student/training-plan"
          element={<TrainingPlan />}
        />

        <Route
          path="/student/daily-training-log"
          element={<DailyTrainingLog />}
        />

        <Route
          path="/student/daily-training-log/details"
          element={<DailyTrainingLogDetails />}
        />

        <Route
          path="/student/attendance"
          element={<Attendance />}
        />

        <Route
          path="/student/attendance/absence-excuse"
          element={<AbsenceExcuse />}
        />

        <Route
          path="/student/reports"
          element={<Reports />}
        />

        <Route
          path="/student/evaluation"
          element={<Evaluation />}
        />

        <Route
          path="/student/finish-training"
          element={<FinishTraining />}
        />

        <Route
          path="/student/certificate"
          element={<Certificate />}
        />

        <Route
          path="/student/notifications"
          element={<Notifications />}
        />

        <Route
          path="/student/profile"
          element={<Profile />}
        />
        <Route
          path="/student/settings"
          element={<StudentSettings />}
        />

        {/* =================================
            ADMIN ROUTES
        ================================= */}

        {/* Redirect to Admin Dashboard */}

        <Route
          path="/admin"
          element={
            <Navigate
              to="/admin/dashboard"
              replace
            />
          }
        />

        {/* Admin Dashboard */}

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin/reset-password" element={<AdminResetPassword />} />

        <Route
          path="/admin/dashboard/performance-reports"
          element={<PerformanceReports />}
        />
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/recent-activities"
          element={<RecentActivities />}
        />

        <Route
          path="/admin/training-statistics"
          element={<TrainingStatistics />}
        />

        <Route
          path="/admin/organization-statistics"
          element={<OrganizationStatistics />}
        />

        <Route
          path="/admin/student-statistics"
          element={<StudentStatistics />}
        />

        {/* Students Management */}

        <Route
          path="/admin/students"
          element={<Students />}
        />

        <Route
          path="/admin/students/:id"
          element={<StudentDetails />}
        />

        <Route
          path="/admin/add-student"
          element={<AddStudent />}
        />

        <Route
          path="/admin/edit-student"
          element={<EditStudent />}
        />

        <Route
          path="/admin/students/:id/edit"
          element={<EditStudent />}
        />

        <Route
          path="/admin/student-training-history"
          element={<StudentTrainingHistory />}
        />

        <Route
          path="/admin/students/:id/training-history"
          element={<StudentTrainingHistory />}
        />

        {/* Training Requests */}

        <Route
          path="/admin/training-requests"
          element={<TrainingRequests />}
        />

        <Route
          path="/admin/training-requests/:id"
          element={<TrainingRequestDetails />}
        />

        <Route
          path="/admin/training-request-details"
          element={<TrainingRequestDetails />}
        />

        {/* Training Organizations */}

        <Route
          path="/admin/training-organizations"
          element={<TrainingOrganizations />}
        />

        <Route
          path="/admin/training-organizations/:id"
          element={<TrainingOrganizationDetails />}
        />

        <Route
          path="/admin/approvals/training-providers"
          element={<ApprovalsTrainingProviders />}
        />

        {/* Training Approvals */}

        <Route
          path="/admin/approvals"
          element={<Approvals />}
        />
        <Route
          path="/admin/approvals/:id"
          element={<ApprovalDetails />}
        />

        <Route
          path="/admin/complete-training"
          element={<CompleteTraining />}
        />

        {/* Training Visits */}

        <Route path="/admin/daily-logs" element={<AdminDailyTrainingLogs />} />

        <Route
          path="/admin/training-monitoring"
          element={<TrainingMonitoring />}
        />
        <Route path="/admin/visits" element={<Navigate to="/admin/training-monitoring" replace />} />

        <Route
          path="/admin/training-monitoring/:studentId"
          element={<StudentTrainingDetails />}
        />

        <Route path="/admin/training-monitoring/:studentId/certificate" element={<TrainingCertificate />} />
        <Route
          path="/admin/training-monitoring/:studentId/complete"
          element={<CompleteTraining />}
        />

        {/* Reports */}

        <Route
          path="/admin/reports"
          element={<ReportsAdmin />}
        />
        <Route
          path="/admin/reports/:id"
          element={<ReportDetails />}
        />

        <Route
          path="/admin/reports/:id/review"
          element={<ReviewReport />}
        />

        {/* Evaluations */}

        <Route
          path="/admin/evaluations"
          element={<Evaluations />}
        />

        <Route
          path="/admin/evaluations/:id"
          element={<EvaluationDetails />}
        />

        <Route
          path="/admin/evaluations/:id/add"
          element={<AddEvaluation />}
        />

        <Route
          path="/admin/evaluations/:id/final-review"
          element={<FinalEvaluationReview />}
        />

        {/* Announcements */}

        <Route
          path="/admin/announcements"
          element={<Announcements />}
        />

        {/* Admin Profile */}

        <Route
          path="/admin/profile"
          element={<AdminProfile />}
        />

        {/* Admin Settings */}

        <Route
          path="/admin/settings"
          element={<AdminSettings />}
        />
        <Route
          path="/admin/training-organizations/add"
          element={<AddTrainingOrganization />}
        />
        <Route
          path="/admin/training-organizations/:id/edit"
          element={<EditTrainingOrganization />}
        />


        {/* =================================
            Training Provider ROUTES
        ================================= */}


        {/* Training Provider Authentication */}

        <Route
          path="/training-provider/login"
          element={<TrainingProviderLogin />}
        />

        <Route
          path="/training-provider/register"
          element={<TrainingProviderRegister />}
        />

        <Route
          path="/training-provider/forgot-password"
          element={<TrainingProviderForgotPassword />}
        />

        <Route
          path="/training-provider/reset-password/:token"
          element={<TrainingProviderResetPassword />}
        />

        <Route
          path="/training-provider/dashboard"
          element={<TrainingProviderDashboard />}
        />

        <Route
          path="/training-provider/opportunities"
          element={<TrainingProviderOpportunities />}
        />

        <Route
          path="/training-provider/opportunities/add"
          element={<TrainingProviderOpportunityForm />}
        />

        <Route
          path="/training-provider/opportunities/:id/edit"
          element={<TrainingProviderOpportunityForm />}
        />

        <Route
          path="/training-provider/opportunities/:id"
          element={<TrainingProviderOpportunityDetails />}
        />

        <Route
          path="/training-provider/requests"
          element={<TrainingProviderRequests />}
        />

        <Route
          path="/training-provider/trainees"
          element={<TrainingProviderTrainees />}
        />

        <Route
          path="/training-provider/trainees/:id"
          element={<TrainingProviderTraineeDetails />}
        />

        <Route
          path="/training-provider/settings"
          element={<TrainingProviderSettings />}
        />

        <Route
          path="/training-provider/notifications"
          element={<TrainingProviderNotifications />}
        />

        <Route
          path="/training-provider/evaluations"
          element={<TrainingProviderEvaluations />}
        />

        <Route
          path="/training-provider/statistics"
          element={<TrainingProviderStatistics />}
        />

        <Route
          path="/training-provider/profile"
          element={<TrainingProviderProfile />}
        />

        <Route
          path="/training-provider/supervisors"
          element={<TrainingProviderSupervisors />}
        />

        <Route
          path="/training-provider/attendance"
          element={<TrainingProviderAttendance />}
        />

        {/* =================================
            FALLBACK ROUTES
        ================================= */}

        <Route
          path="/admin/*"
          element={
            <Navigate
              to="/admin/dashboard"
              replace
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
