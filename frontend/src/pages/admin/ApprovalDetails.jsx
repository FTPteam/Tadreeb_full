import { Navigate, useParams } from "react-router-dom";
import { getRequest } from "./trainingRequestsStore";

// Compatibility route: approvals share the same authoritative request-details UI.
// Never substitute another student's request when the URL contains an unknown ID.
export default function ApprovalDetails() {
  const { id } = useParams();
  const request = getRequest(id);
  if (!request) return <Navigate to="/admin/approvals" replace />;
  return <Navigate to={`/admin/training-requests/${encodeURIComponent(request.id)}`} replace />;
}
