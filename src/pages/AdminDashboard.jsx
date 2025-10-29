import AuditLogManagement from "../components/admin-dashboard/audit/AuditLogManagement";
import UserManagement from "../components/admin-dashboard/users/UserManagement";

const AdminDashboard = ({ currentPage = "users" }) => {
  let page = currentPage;
  if (page !== "users" && page !== "audit") {
    page = "users";
  }

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      {page === "users" && <UserManagement />}
      {page === "audit" && <AuditLogManagement />}
    </div>
  );
};

export default AdminDashboard;
