import { Navigate } from "react-router-dom";
import { getStoredToken } from "../services/authService";

const ProtectedRoute = ({ children }) => {
  const stored = getStoredToken();
  if (!stored || !stored.user || !stored.user.role) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
