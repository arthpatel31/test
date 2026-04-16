import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import AdminPage from "./AdminPage";
import UserPage from "./UserPage";
import LoginPage from "./LoginPage";
import { ProtectedRoute } from "./ProtectedRoute";
import "./App.css"

function AppContent() {
  const location = useLocation();

  const hideNavbar = location.pathname === "/login";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default AppContent;