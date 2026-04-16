import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const role = localStorage.getItem("role"); // "admin" | "user"
  const token = localStorage.getItem("access");

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom">
      <div className="container-fluid page-container">
        <Link className="navbar-brand" to="/">
          E-Commerce
        </Link>

        <div className="navbar-nav ms-auto align-items-center">

          {/* ADMIN TAB */}
          {role === "admin" && (
            <Link
              className={`nav-link ${
                location.pathname === "/admin" ? "active" : ""
              }`}
              to="/admin"
            >
              Admin
            </Link>
          )}

          {/* USER TAB */}
          {role === "user" && (
            <Link
              className={`nav-link ${
                location.pathname === "/user" ? "active" : ""
              }`}
              to="/user"
            >
              User
            </Link>
          )}

          {/* LOGOUT BUTTON */}
          {token && (
            <button
              className="btn btn-outline-light btn-sm ms-3"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;