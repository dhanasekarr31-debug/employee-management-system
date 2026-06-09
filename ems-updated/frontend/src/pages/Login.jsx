import React, { useState } from "react";
import { loginUser } from "../api/employeeApi";

// Only these 3 admins can log in via Admin tab — hardcoded
const ADMIN_ACCOUNTS = {
  "magesh":     { password: "1408", name: "Magesh",     role: "admin", department: "Admin", avatar: "MK" },
  "dhanasekar": { password: "1234", name: "Dhanasekar", role: "admin", department: "Admin", avatar: "DK" },
  "subasri":    { password: "1234", name: "Subasri",    role: "admin", department: "Admin", avatar: "SB" },
};

export default function Login({ onLogin }) {
  const [tab, setTab]           = useState("admin");
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage]   = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    // ── Admin tab ─────────────────────────────────────────────────────────
    if (tab === "admin") {
      if (!username.trim() || !password.trim()) {
        setMessage("Please enter username and password.");
        return;
      }
      const key = username.trim().toLowerCase();
      const adminUser = ADMIN_ACCOUNTS[key];
      if (adminUser && adminUser.password === password.trim()) {
        onLogin({ ...adminUser, email: key + "@admin.com" });
      } else {
        setMessage("Invalid username or password.");
      }
      return;
    }

    // ── Employee tab ──────────────────────────────────────────────────────
    if (!email.trim() || !password.trim()) {
      setMessage("Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      const data = await loginUser(email.trim(), password.trim());
      if (data.user.role === "admin") {
        setMessage("This is an admin account. Please use Admin Login.");
      } else {
        onLogin(data.user);
      }
    } catch (err) {
      setMessage(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (t) => {
    setTab(t);
    setMessage("");
    setUsername(""); setEmail(""); setPassword("");
  };

  const tabStyle = (t) => ({
    flex: 1, padding: "10px", border: "none", borderRadius: "8px",
    fontWeight: "700", fontSize: "14px", cursor: "pointer",
    background: tab === t ? "linear-gradient(135deg,#667eea,#764ba2)" : "#f1f5f9",
    color: tab === t ? "#fff" : "#64748b",
    transition: "all 0.2s",
  });

  return (
    <div style={{
      height: "100vh", display: "flex", justifyContent: "center", alignItems: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #6dd5ed 100%)",
    }}>
      <form onSubmit={handleLogin} style={{
        width: "400px", background: "#fff", padding: "40px", borderRadius: "20px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.25)", textAlign: "center",
      }}>
        <div style={{ fontSize: "56px", marginBottom: "8px" }}>🏢</div>
        <h2 style={{ color: "#1e293b", marginBottom: "4px", fontSize: "26px", fontWeight: "700" }}>
          Welcome Back
        </h2>
        <p style={{ color: "#94a3b8", marginBottom: "28px", fontSize: "14px" }}>
          Employee Management System
        </p>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", background: "#f1f5f9", padding: "4px", borderRadius: "10px" }}>
          <button type="button" style={tabStyle("admin")}    onClick={() => switchTab("admin")}>🔑 Admin Login</button>
          <button type="button" style={tabStyle("employee")} onClick={() => switchTab("employee")}>👤 Employee Login</button>
        </div>

        {tab === "admin" ? (
          <>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={inputStyle}
              autoComplete="off"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </>
        ) : (
          <>
            <input
              type="email"
              placeholder="Employee Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </>
        )}

        <button type="submit" disabled={loading} style={{
          width: "100%", padding: "13px", border: "none", borderRadius: "10px",
          background: loading ? "#94a3b8" : "linear-gradient(135deg,#667eea,#764ba2)",
          color: "#fff", fontSize: "15px", fontWeight: "700",
          cursor: loading ? "not-allowed" : "pointer",
        }}>
          {loading ? "Logging in…" : `Login as ${tab === "admin" ? "Admin" : "Employee"}`}
        </button>

        {message && (
          <p style={{ marginTop: "14px", color: "#ef4444", fontWeight: "600", fontSize: "14px" }}>
            ⚠️ {message}
          </p>
        )}
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "12px 14px", marginBottom: "14px",
  border: "2px solid #e2e8f0", borderRadius: "10px", outline: "none",
  boxSizing: "border-box", fontSize: "14px", color: "#1e293b",
};
