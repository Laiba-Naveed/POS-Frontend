import React, { useState } from "react";
import { POSPage } from "./pages/POSPage";
import { AdminPage } from "./pages/AdminPage";
import { LoginPage } from "./pages/LoginPage";
import { AdminLoginPage } from "./pages/AdminLogin";

export default function App() {
  const [page, setPage] = useState(() => {
    return localStorage.getItem("pos_token") ? "pos" : "login";
  });

  const [posToken, setPosToken]     = useState(() => localStorage.getItem("pos_token") || null);
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem("pos_admin_token") || null);

  // General login → check role, go to POS
  const handlePosLogin = (token, user) => {
    // If admin logs in from the main login page, send them to admin portal directly
    if (user?.role === "admin") {
      localStorage.setItem("pos_admin_token", token);
      localStorage.setItem("pos_admin_user", JSON.stringify(user));
      setAdminToken(token);
      setPage("admin");
    } else {
      setPosToken(token);
      setPage("pos");
    }
  };

  // Admin login → go to Admin
  const handleAdminLogin = (token, user) => {
    setAdminToken(token);
    setPage("admin");
  };

  // Logout from POS → back to login
  const handlePosLogout = () => {
    localStorage.removeItem("pos_token");
    localStorage.removeItem("pos_user");
    setPosToken(null);
    setPage("login");
  };

  // Logout from Admin → back to POS (if POS token exists) or login
  const handleAdminLogout = () => {
    localStorage.removeItem("pos_admin_token");
    localStorage.removeItem("pos_admin_user");
    setAdminToken(null);
    setPage(posToken ? "pos" : "login");
  };

  // Clicking Admin button in POS → show admin login
  const handleGoAdmin = () => {
    if (adminToken) {
      setPage("admin");
    } else {
      setPage("admin-login");
    }
  };

  if (page === "login") {
    return <LoginPage onLoginSuccess={handlePosLogin} />;
  }

  if (page === "admin-login") {
    return (
      <AdminLoginPage
        onLoginSuccess={handleAdminLogin}
        onBack={() => setPage("pos")}
      />
    );
  }

  if (page === "admin") {
    return (
      <AdminPage
        token={adminToken}
        onLogout={handleAdminLogout}
        onGoBack={() => setPage("pos")}
      />
    );
  }

  return (
    <POSPage
      token={posToken}
      onGoAdmin={handleGoAdmin}
      onLogout={handlePosLogout}
    />
  );
}