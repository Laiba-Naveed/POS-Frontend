import React, { useState } from "react";
import { POSPage } from "./pages/POSPage";
import { AdminPage } from "./pages/AdminPage";
import { LoginPage } from "./pages/LoginPage";
import { AdminLoginPage } from "./pages/AdminLogin";

export default function App() {
  const [page, setPage] = useState(() => {
    // On reload, check if POS token exists
    return localStorage.getItem("pos_token") ? "pos" : "login";
  });

  const [posToken, setPosToken]     = useState(() => localStorage.getItem("pos_token") || null);
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem("pos_admin_token") || null);

  // General login → go to POS
  const handlePosLogin = (token, user) => {
    setPosToken(token);
    setPage("pos");
  };

  // Admin login → go to Admin
  const handleAdminLogin = (token, user) => {
    setAdminToken(token);
    setPage("admin");
  };

  // Logout from POS → back to general login
  const handlePosLogout = () => {
    localStorage.removeItem("pos_token");
    localStorage.removeItem("pos_user");
    setPosToken(null);
    setPage("login");
  };

  // Logout from Admin → back to POS
  const handleAdminLogout = () => {
    localStorage.removeItem("pos_admin_token");
    localStorage.removeItem("pos_admin_user");
    setAdminToken(null);
    setPage("pos");
  };

  // Clicking Admin button in POS → show admin login
  const handleGoAdmin = () => {
    if (adminToken) {
      setPage("admin"); // already logged in as admin
    } else {
      setPage("admin-login"); // need to login first
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

  // Default: POS page
  return (
    <POSPage
      token={posToken}
      onGoAdmin={handleGoAdmin}
      onLogout={handlePosLogout}
    />
  );
}