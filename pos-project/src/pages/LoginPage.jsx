import React, { useState } from "react";

const API_BASE = "http://192.168.18.27:5000/api";

export function LoginPage({ onLoginSuccess }) {
  const [tab, setTab]           = useState("signin"); // "signin" | "register"
  const [form, setForm]         = useState({ name: "", email: "", password: "" });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError("Please fill in all fields"); return; }
    if (tab === "register" && !form.name) { setError("Please enter your name"); return; }
    setLoading(true);
    setError("");
    try {
      const endpoint = tab === "signin" ? "/auth/login" : "/auth/register";
      const body = tab === "signin"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      if (tab === "register") {
        setSuccess("Account created! Please sign in.");
        setTab("signin");
        setForm({ name: "", email: form.email, password: "" });
      } else {
        localStorage.setItem("pos_token", data.token);
        localStorage.setItem("pos_user", JSON.stringify(data.user || { email: form.email }));
        onLoginSuccess(data.token, data.user);
      }
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .login-root {
          min-height: 100vh;
          background: #faf7f2;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .login-root::before {
          content: '';
          position: absolute;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%);
          top: -200px; right: -200px;
          border-radius: 50%;
        }
        .login-root::after {
          content: '';
          position: absolute;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(200,132,26,0.08) 0%, transparent 70%);
          bottom: -100px; left: -100px;
          border-radius: 50%;
        }
        .login-card {
          background: #fff;
          border-radius: 24px;
          padding: 40px 36px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 20px 60px rgba(200,132,26,0.12), 0 4px 16px rgba(0,0,0,0.06);
          position: relative;
          z-index: 1;
          animation: popIn .4s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes popIn {
          from { opacity: 0; transform: translateY(24px) scale(.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .login-logo {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 28px;
        }
        .login-logo-icon {
          width: 44px; height: 44px;
          background: linear-gradient(135deg, #f5a623, #c8841a);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; color: #fff;
          box-shadow: 0 4px 12px rgba(200,132,26,0.35);
        }
        .login-logo-text { font-size: 22px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.5px; }
        .login-logo-sub  { font-size: 12px; color: #999; display: block; font-weight: 500; }
        .login-tabs {
          display: grid; grid-template-columns: 1fr 1fr;
          background: #f5f0e8; border-radius: 12px;
          padding: 4px; margin-bottom: 24px;
        }
        .login-tab {
          padding: 10px; border: none; background: none;
          border-radius: 9px; font-size: 14px; font-weight: 700;
          cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
          color: #999; transition: all .2s;
        }
        .login-tab-active {
          background: #fff !important;
          color: #c8841a !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .login-heading { font-size: 22px; font-weight: 800; color: #1a1a1a; margin-bottom: 4px; }
        .login-sub     { font-size: 13px; color: #999; margin-bottom: 20px; }
        .login-field { margin-bottom: 16px; }
        .login-field-label {
          font-size: 12px; font-weight: 600; color: #666;
          display: block; margin-bottom: 6px;
          text-transform: uppercase; letter-spacing: .5px;
        }
        .login-input-wrap { position: relative; }
        .login-input {
          width: 100%; padding: 12px 16px 12px 42px;
          border: 2px solid #ede8df; border-radius: 12px;
          font-size: 14px; font-weight: 500; color: #1a1a1a;
          background: #faf7f2; font-family: 'Plus Jakarta Sans', sans-serif;
          transition: border-color .2s, box-shadow .2s; outline: none;
        }
        .login-input:focus {
          border-color: #c8841a; background: #fff;
          box-shadow: 0 0 0 3px rgba(200,132,26,0.1);
        }
        .login-input::placeholder { color: #bbb; }
        .login-input-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          font-size: 16px; pointer-events: none;
        }
        .pass-toggle {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          font-size: 16px; color: #bbb; padding: 2px;
        }
        .pass-toggle:hover { color: #c8841a; }
        .login-error {
          background: #fff0f0; border: 1px solid #fecaca;
          border-radius: 10px; padding: 10px 14px;
          font-size: 13px; color: #dc2626; font-weight: 500;
          margin-bottom: 16px;
          display: flex; align-items: center; gap: 8px;
          animation: shake .3s ease;
        }
        .login-success {
          background: #f0fdf4; border: 1px solid #bbf7d0;
          border-radius: 10px; padding: 10px 14px;
          font-size: 13px; color: #16a34a; font-weight: 500;
          margin-bottom: 16px;
          display: flex; align-items: center; gap: 8px;
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25%      { transform: translateX(-6px); }
          75%      { transform: translateX(6px); }
        }
        .login-btn {
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
        .login-btn:hover:not(:disabled) { opacity: .9; transform: translateY(-1px); }
        .login-btn:disabled { opacity: .6; cursor: not-allowed; }
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff; border-radius: 50%;
          animation: spin .6s linear infinite; display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="login-root">
        <div className="login-card">
          <div className="login-logo">
            <div className="login-logo-icon">⬡</div>
            <div>
              <span className="login-logo-text">POS System</span>
              <span className="login-logo-sub">Restaurant Order Terminal</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="login-tabs">
            <button
              className={"login-tab" + (tab === "signin" ? " login-tab-active" : "")}
              onClick={() => { setTab("signin"); setError(""); setSuccess(""); }}
            >Sign In</button>
            <button
              className={"login-tab" + (tab === "register" ? " login-tab-active" : "")}
              onClick={() => { setTab("register"); setError(""); setSuccess(""); }}
            >Register</button>
          </div>

          <h1 className="login-heading">
            {tab === "signin" ? "Welcome back 👋" : "Create account 🎉"}
          </h1>
          <p className="login-sub">
            {tab === "signin"
              ? "Sign in to access the POS terminal"
              : "Register to get started"}
          </p>

          {error   && <div className="login-error"><span>✕</span> {error}</div>}
          {success && <div className="login-success"><span>✓</span> {success}</div>}

          {/* Name field - only for register */}
          {tab === "register" && (
            <div className="login-field">
              <label className="login-field-label">Full Name</label>
              <div className="login-input-wrap">
                <span className="login-input-icon">👤</span>
                <input
                  className="login-input"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
          )}

          <div className="login-field">
            <label className="login-field-label">Email</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">✉️</span>
              <input
                className="login-input"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-field-label">Password</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">🔒</span>
              <input
                className="login-input"
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                style={{ paddingRight: 42 }}
              />
              <button className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button className="login-btn" onClick={handleSubmit} disabled={loading}>
            {loading
              ? <span className="spinner" />
              : tab === "signin" ? "Sign In →" : "Create Account →"
            }
          </button>
        </div>
      </div>
    </>
  );
}