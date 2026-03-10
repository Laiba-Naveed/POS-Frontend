import React, { useState } from "react";

const API_BASE = "https://fortunate-robby-lalallalalaalaallaalla-cfde15bf.koyeb.app/api";

export function LoginPage({ onLoginSuccess }) {
  const [role, setRole]         = useState("employee");
  const [form, setForm]         = useState({ email: "", password: "" });
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [showPass, setShowPass] = useState(false);

  // Admin branch selection
  const [step, setStep]                     = useState("login"); // "login" | "branch"
  const [branches, setBranches]             = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [tempToken, setTempToken]           = useState(null);
  const [tempUser, setTempUser]             = useState(null);
  const [branchOpen, setBranchOpen]         = useState(false);

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

      if (role === "admin") {
        if (data.role !== "admin") throw new Error("This account does not have admin access.");
        // Fetch branches using the token we just got
        const brRes = await fetch(`${API_BASE}/branches`, {
          headers: { "Authorization": `Bearer ${data.token}` },
        });
        const brData = await brRes.json();
        if (!brRes.ok) throw new Error("Could not load branches. Please try again.");
        setBranches(Array.isArray(brData) ? brData : []);
        setTempToken(data.token);
        setTempUser(data);
        setStep("branch");
      } else {
        // Employee — go straight to POS
        localStorage.setItem("pos_token", data.token);
        localStorage.setItem("pos_user", JSON.stringify(data));
        onLoginSuccess(data.token, data);
      }
    } catch (e) {
      setError(e.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBranchConfirm = () => {
    if (!selectedBranch) { setError("Please select a branch to continue."); return; }
    const userWithBranch = { ...tempUser, branchId: selectedBranch._id, branchName: selectedBranch.name };
    // Save as pos_token so POS loads correctly for admin too
    localStorage.setItem("pos_token", tempToken);
    localStorage.setItem("pos_user", JSON.stringify(userWithBranch));
    // Also save as admin token so Admin portal button works
    localStorage.setItem("pos_admin_token", tempToken);
    localStorage.setItem("pos_admin_user", JSON.stringify(userWithBranch));
    onLoginSuccess(tempToken, userWithBranch);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter" && step === "login") handleLogin(); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .login-root {
          min-height: 100vh; background: #faf7f2;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }
        .login-root::before {
          content: ''; position: absolute;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%);
          top: -200px; right: -200px; border-radius: 50%;
        }
        .login-root::after {
          content: ''; position: absolute;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(200,132,26,0.08) 0%, transparent 70%);
          bottom: -100px; left: -100px; border-radius: 50%;
        }
        .login-card {
          background: #fff; border-radius: 24px; padding: 40px 36px;
          width: 100%; max-width: 420px;
          box-shadow: 0 20px 60px rgba(200,132,26,0.12), 0 4px 16px rgba(0,0,0,0.06);
          position: relative; z-index: 1;
          animation: popIn .4s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes popIn {
          from { opacity: 0; transform: translateY(24px) scale(.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .login-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
        .login-logo-icon {
          width: 44px; height: 44px;
          background: linear-gradient(135deg, #f5a623, #c8841a);
          border-radius: 12px; display: flex; align-items: center; justify-content: center;
          font-size: 22px; color: #fff; box-shadow: 0 4px 12px rgba(200,132,26,0.35);
        }
        .login-logo-text { font-size: 22px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.5px; }
        .login-logo-sub  { font-size: 12px; color: #999; display: block; font-weight: 500; }
        .login-heading { font-size: 26px; font-weight: 800; color: #1a1a1a; margin-bottom: 4px; }
        .login-sub     { font-size: 13px; color: #999; margin-bottom: 24px; }

        /* ROLE SELECTOR */
        .role-selector { display: flex; gap: 10px; margin-bottom: 24px; }
        .role-btn {
          flex: 1; padding: 12px; border-radius: 12px;
          border: 2px solid #ede8df; background: #faf7f2;
          font-size: 13px; font-weight: 700; color: #999;
          cursor: pointer; transition: all .2s;
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .role-btn:hover { border-color: #f5a623; color: #c8841a; }
        .role-btn-active {
          border-color: #c8841a; background: #fff8ee;
          color: #c8841a; box-shadow: 0 0 0 3px rgba(200,132,26,0.1);
        }

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

        /* BRANCH DROPDOWN */
        .branch-drop-wrap { position: relative; }
        .branch-drop-btn {
          width: 100%; padding: 12px 16px 12px 42px;
          border: 2px solid #ede8df; border-radius: 12px;
          font-size: 14px; font-weight: 500; color: #1a1a1a;
          background: #faf7f2; font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer; text-align: left;
          display: flex; align-items: center; justify-content: space-between;
          transition: border-color .2s, box-shadow .2s;
        }
        .branch-drop-btn:hover, .branch-drop-btn-open {
          border-color: #c8841a; background: #fff;
          box-shadow: 0 0 0 3px rgba(200,132,26,0.1);
        }
        .branch-drop-placeholder { color: #bbb; }
        .branch-drop-arrow { font-size: 11px; color: #bbb; transition: transform .2s; }
        .branch-drop-arrow-open { transform: rotate(180deg); }
        .branch-drop-list {
          position: absolute; top: calc(100% + 6px); left: 0; right: 0;
          background: #fff; border: 2px solid #f5a623; border-radius: 12px;
          z-index: 100; box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          overflow: hidden; animation: popIn .2s ease;
        }
        .branch-drop-item {
          padding: 12px 16px; font-size: 13px; font-weight: 600; color: #1a1a1a;
          cursor: pointer; border-bottom: 1px solid #faf7f2;
          display: flex; align-items: center; gap: 10px;
          transition: background .15s;
        }
        .branch-drop-item:last-child { border-bottom: none; }
        .branch-drop-item:hover { background: #fff8ee; }
        .branch-drop-item-active { background: #fff8ee; color: #c8841a; font-weight: 800; }
        .branch-dot { width: 8px; height: 8px; border-radius: 50%; background: #16a34a; flex-shrink: 0; }
        .branch-address { font-size: 11px; color: #999; margin-top: 2px; }

        /* BRANCH STEP */
        .branch-step-back {
          background: none; border: none; color: #c8841a; font-size: 13px;
          font-weight: 700; cursor: pointer; padding: 0; margin-bottom: 16px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: flex; align-items: center; gap: 5px;
        }
        .branch-step-back:hover { color: #a06010; }
        .branch-admin-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: #fff8ee; border: 1.5px solid #f5a623; border-radius: 20px;
          padding: 5px 12px; font-size: 12px; font-weight: 700; color: #c8841a;
          margin-bottom: 12px;
        }

        .login-error {
          background: #fff0f0; border: 1px solid #fecaca;
          border-radius: 10px; padding: 10px 14px;
          font-size: 13px; color: #dc2626; font-weight: 500;
          margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
          animation: shake .3s ease;
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

          {/* ── STEP 1: LOGIN ── */}
          {step === "login" && (
            <>
              <h1 className="login-heading">Welcome 👋</h1>
              <p className="login-sub">Sign in to access the POS terminal</p>

              <div className="role-selector">
                <button
                  className={`role-btn ${role === "employee" ? "role-btn-active" : ""}`}
                  onClick={() => { setRole("employee"); setError(""); }}
                >
                  👤 Employee
                </button>
                <button
                  className={`role-btn ${role === "admin" ? "role-btn-active" : ""}`}
                  onClick={() => { setRole("admin"); setError(""); }}
                >
                  🛡️ Admin
                </button>
              </div>

              {error && <div className="login-error"><span>✕</span> {error}</div>}

              <div className="login-field">
                <label className="login-field-label">Email</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon">✉️</span>
                  <input
                    className="login-input" type="email" name="email"
                    placeholder="Enter your email"
                    value={form.email} onChange={handleChange} onKeyDown={handleKeyDown}
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
                    name="password" placeholder="Enter your password"
                    value={form.password} onChange={handleChange} onKeyDown={handleKeyDown}
                    style={{ paddingRight: 42 }}
                  />
                  <button className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button className="login-btn" onClick={handleLogin} disabled={loading}>
                {loading ? <span className="spinner" /> : role === "admin" ? "Continue →" : "Sign In →"}
              </button>
            </>
          )}

          {/* ── STEP 2: BRANCH SELECTION (Admin only) ── */}
          {step === "branch" && (
            <>
              <button className="branch-step-back" onClick={() => { setStep("login"); setError(""); setSelectedBranch(null); }}>
                ← Back
              </button>
              <div className="branch-admin-badge">🛡️ {tempUser?.name || tempUser?.email}</div>
              <h1 className="login-heading">Select Branch</h1>
              <p className="login-sub">Choose which branch POS to open</p>

              {error && <div className="login-error"><span>✕</span> {error}</div>}

              <div className="login-field">
                <label className="login-field-label">Branch</label>
                <div className="branch-drop-wrap">
                  <button
                    className={`branch-drop-btn ${branchOpen ? "branch-drop-btn-open" : ""}`}
                    onClick={() => setBranchOpen(!branchOpen)}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16 }}>🏪</span>
                      {selectedBranch
                        ? <span>{selectedBranch.name}</span>
                        : <span className="branch-drop-placeholder">Select a branch...</span>
                      }
                    </span>
                    <span className={`branch-drop-arrow ${branchOpen ? "branch-drop-arrow-open" : ""}`}>▼</span>
                  </button>

                  {branchOpen && (
                    <div className="branch-drop-list">
                      {branches.length === 0 && (
                        <div className="branch-drop-item" style={{ color: "#999", justifyContent: "center" }}>
                          No branches found
                        </div>
                      )}
                      {branches.map((br) => (
                        <div
                          key={br._id}
                          className={`branch-drop-item ${selectedBranch?._id === br._id ? "branch-drop-item-active" : ""}`}
                          onClick={() => { setSelectedBranch(br); setBranchOpen(false); setError(""); }}
                        >
                          <span className="branch-dot" />
                          <div>
                            <div>{br.name}</div>
                            {br.address && <div className="branch-address">{br.address}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button className="login-btn" onClick={handleBranchConfirm} disabled={!selectedBranch}>
                Open Branch POS →
              </button>
            </>
          )}

        </div>
      </div>
    </>
  );
}