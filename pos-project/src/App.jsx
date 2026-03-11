import React, { useState } from "react";
import { POSPage } from "./pages/POSPage";
import { AdminPage } from "./pages/AdminPage";
import { LoginPage } from "./pages/LoginPage";

export default function App() {
  const [page, setPage] = useState(() => {
    return localStorage.getItem("pos_token") ? "pos" : "login";
  });

  const [posToken, setPosToken] = useState(() => localStorage.getItem("pos_token") || null);

  // All logins (employee + admin) → go to POS
  const handlePosLogin = (token, user) => {
    setPosToken(token);
    setPage("pos");
  };

  // Logout from POS → clear everything → back to login
  const handlePosLogout = () => {
    localStorage.removeItem("pos_token");
    localStorage.removeItem("pos_user");
    localStorage.removeItem("pos_admin_token");
    localStorage.removeItem("pos_admin_user");
    setPosToken(null);
    setPage("login");
  };

  // Logout from Admin → back to POS
  const handleAdminLogout = () => {
    setPage("pos");
  };

  // Admin button in POS → go straight to admin portal (already logged in)
  const handleGoAdmin = () => {
    setPage("admin");
  };

  if (page === "login") {
    return <LoginPage onLoginSuccess={handlePosLogin} />;
  }

  if (page === "admin") {
    return (
      <AdminPage
        token={localStorage.getItem("pos_token")}
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