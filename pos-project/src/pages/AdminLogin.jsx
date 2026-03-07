import React, { useState } from "react";

const API_BASE = "https://fortunate-robby-lalallalalaalaallaalla-cfde15bf.koyeb.app/api";

export function AdminLoginPage({ onLoginSuccess, onBack }) {
  const [form, setForm]         = useState({ email: "", password: "" });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError("Please fill in all fields"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      localStorage.setItem("pos_admin_token", data.token);
      localStorage.setItem("pos_admin_user", JSON.stringify(data.user || { email: form.email }));
      onLoginSuccess(data.token, data.user);
    } catch (e) {
      setError(e.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .al-root {
          min-height: 100vh;
          background: #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .al-root::before {
          content: '';
          position: absolute;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(200,132,26,0.15) 0%, transparent 70%);
          top: -150px; right: -150px;
          border-radius: 50%;
        }
        .al-back {
          position: absolute;
          top: 20px; left: 20px;
          display: flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 8px 14px;
          font-size: 13px; font-weight: 600;
          color: #aaa; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all .2s;
          z-index: 10;
        }
        .al-back:hover { background: rgba(255,255,255,0.12); color: #fff; }
        .al-card {
          background: #242424;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 40px 36px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.4);
          position: relative;
          z-index: 1;
          animation: popIn .4s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes popIn {
          from { opacity: 0; transform: translateY(24px) scale(.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .al-logo {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 28px;
        }
        .al-logo-icon {
          width: 44px; height: 44px;
          background: linear-gradient(135deg, #f5a623, #c8841a);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; color: #fff;
          box-shadow: 0 4px 12px rgba(200,132,26,0.35);
        }
        .al-logo-text { font-size: 22px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
        .al-logo-sub  { font-size: 12px; color: #666; display: block; font-weight: 500; }
        .al-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(200,132,26,0.15);
          border: 1px solid rgba(200,132,26,0.3);
          border-radius: 8px;
          padding: 4px 10px;
          font-size: 11px; font-weight: 700;
          color: #f5a623;
          margin-bottom: 16px;
          text-transform: uppercase; letter-spacing: .5px;
        }
        .al-heading { font-size: 26px; font-weight: 800; color: #fff; margin-bottom: 4px; }
        .al-sub     { font-size: 13px; color: #666; margin-bottom: 28px; }
        .al-field { margin-bottom: 16px; }
        .al-field-label {
          font-size: 12px; font-weight: 600; color: #888;
          display: block; margin-bottom: 6px;
          text-transform: uppercase; letter-spacing: .5px;
        }
        .al-input-wrap { position: relative; }
        .al-input {
          width: 100%; padding: 12px 16px 12px 42px;
          border: 2px solid rgba(255,255,255,0.08); border-radius: 12px;
          font-size: 14px; font-weight: 500; color: #fff;
          background: rgba(255,255,255,0.05);
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: border-color .2s, box-shadow .2s; outline: none;
        }
        .al-input:focus {
          border-color: #c8841a;
          box-shadow: 0 0 0 3px rgba(200,132,26,0.15);
        }
        .al-input::placeholder { color: #555; }
        .al-input-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          font-size: 16px; pointer-events: none;
        }
        .al-pass-toggle {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          font-size: 16px; color: #555; padding: 2px;
        }
        .al-pass-toggle:hover { color: #c8841a; }
        .al-error {
          background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.3);
          border-radius: 10px; padding: 10px 14px;
          font-size: 13px; color: #f87171; font-weight: 500;
          margin-bottom: 16px;
          display: flex; align-items: center; gap: 8px;
          animation: shake .3s ease;
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25%      { transform: translateX(-6px); }
          75%      { transform: translateX(6px); }
        }
        .al-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #f5a623, #c8841a);
          color: #fff; border: none; border-radius: 12px;
          font-size: 15px; font-weight: 800; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          box-shadow: 0 4px 16px rgba(200,132,26,0.35);
          transition: opacity .2s, transform .15s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          margin-top: 8px;
        }
        .al-btn:hover:not(:disabled) { opacity: .9; transform: translateY(-1px); }
        .al-btn:disabled { opacity: .6; cursor: not-allowed; }
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff; border-radius: 50%;
          animation: spin .6s linear infinite; display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="al-root">
        <button className="al-back" onClick={onBack}>← Back to POS</button>

        <div className="al-card">
          <div className="al-logo">
            <div className="al-logo-icon">⚙️</div>
            <div>
              <span className="al-logo-text">Admin Panel</span>
              <span className="al-logo-sub">POS Management System</span>
            </div>
          </div>

          <div className="al-badge">⚙️ Admin Access Only</div>
          <h1 className="al-heading">Admin Sign In</h1>
          <p className="al-sub">Enter your admin credentials to continue</p>

          {error && (
            <div className="al-error">
              <span>✕</span> {error}
            </div>
          )}

          <div className="al-field">
            <label className="al-field-label">Email</label>
            <div className="al-input-wrap">
              <span className="al-input-icon">✉️</span>
              <input
                className="al-input"
                type="email"
                name="email"
                placeholder="Enter admin email"
                value={form.email}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          <div className="al-field">
            <label className="al-field-label">Password</label>
            <div className="al-input-wrap">
              <span className="al-input-icon">🔒</span>
              <input
                className="al-input"
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Enter admin password"
                value={form.password}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                style={{ paddingRight: 42 }}
              />
              <button className="al-pass-toggle" onClick={() => setShowPass(!showPass)}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button className="al-btn" onClick={handleLogin} disabled={loading}>
            {loading ? <span className="spinner" /> : "Sign In to Admin →"}
          </button>
        </div>
      </div>
    </>
  );
}