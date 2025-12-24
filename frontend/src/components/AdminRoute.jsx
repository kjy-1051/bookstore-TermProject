import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  console.log("ADMIN ROUTE ROLE:", localStorage.getItem("role"));

  const role = localStorage.getItem("role");
  if (role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default AdminRoute;
