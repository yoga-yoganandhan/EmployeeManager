import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // remember where the user wanted to go, so login can send them back
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
