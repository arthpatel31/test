import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const login = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/v1/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      alert("Invalid username/password");
      return;
    }

    const tokens = await res.json(); // {access, refresh}
    localStorage.setItem("access", tokens.access);
    localStorage.setItem("refresh", tokens.refresh);

    // get role
    const myRole = await fetch("http://127.0.0.1:8000/api/v1/role/", {
      headers: { Authorization: `Bearer ${tokens.access}` },
    });

    const me = await myRole.json(); // {username, role}
    localStorage.setItem("role", me.role);

    // redirect by role
    nav(me.role === "admin" ? "/admin" : "/user");
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 420 }}>
      <h3 className="mb-3">Login</h3>

      <input
        className="form-control mb-2"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className="form-control mb-3"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn btn-primary w-100" onClick={login}>
        Login
      </button>
    </div>
  );
}