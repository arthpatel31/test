import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles: Array<"admin" | "user">;
}) {
  const token = localStorage.getItem("access");
  const role = localStorage.getItem("role") as "admin" | "user" | null;

  if (!token) return <Navigate to="/login" replace />;

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={role === "admin" ? "/admin" : "/user"} replace />;
  }

  return children;
}