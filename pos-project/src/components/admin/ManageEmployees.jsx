import React, { useState, useEffect } from "react";
import { api } from "../../api";

const EMPTY_FORM = { name: "", email: "", password: "" };

export function ManageEmployees({ showToast }) {
  const [form, setForm]           = useState(EMPTY_FORM);
  const [loading, setLoading]     = useState(false);
  const [fetching, setFetching]   = useState(true);
  const [employees, setEmployees] = useState([]);
  const [lastAdded, setLastAdded] = useState(null);
  const [view, setView]           = useState("add"); // "add" | "list"

  // Load employees on mount
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setFetching(true);
    try {
      const data = await api.getEmployees();
      const list = Array.isArray(data) ? data : data.users || data.employees || [];
      setEmployees(list.filter((e) => e.role === "employee" || !e.role));
    } catch (e) {
      showToast(e.message || "Failed to load employees", "error");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async () => {
    const { name, email, password } = form;
    if (!name.trim() || !email.trim() || !password.trim()) {
      showToast("All fields are required", "warning");
      return;
    }
    if (password.length < 6) {
      showToast("Password must be at least 6 characters", "warning");
      return;
    }
    setLoading(true);
    try {
      await api.createUser({ name: name.trim(), email: email.trim(), password, role: "employee" });
      setLastAdded({ name: name.trim(), email: email.trim() });
      showToast(`"${name}" added as employee!`, "success");
      setForm(EMPTY_FORM);
      loadEmployees();
    } catch (e) {
      showToast(e.message || "Failed to create employee", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apf-wrap">

      {/* Toggle buttons */}
      <div className="emp-toggle">
        <button
          className={`emp-toggle-btn ${view === "add" ? "emp-toggle-active" : ""}`}
          onClick={() => setView("add")}
        >
          ＋ Add Employee
        </button>
        <button
          className={`emp-toggle-btn ${view === "list" ? "emp-toggle-active" : ""}`}
          onClick={() => { setView("list"); loadEmployees(); }}
        >
          👥 Employee List
          {employees.length > 0 && (
            <span className="emp-count-badge">{employees.length}</span>
          )}
        </button>
      </div>

      {/* ── ADD FORM ── */}
      {view === "add" && (
        <div className="apf-card">
          <div className="apf-head">
            <div className="apf-title">
              <span className="apf-dot" />
              ADD NEW EMPLOYEE
            </div>
            <p className="apf-sub">
              Create login credentials for your POS staff. Only employees added here can sign in to the POS screen.
            </p>
          </div>

          <div className="apf-fields">
            <div className="apf-group">
              <label className="apf-label">Full Name</label>
              <input
                className="apf-input"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Ahmed Khan"
                disabled={loading}
              />
            </div>

            <div className="apf-group">
              <label className="apf-label">Email Address</label>
              <input
                className="apf-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="e.g. ahmed@yourshop.com"
                disabled={loading}
              />
              <span className="apf-hint">This is what they'll use to log in to POS</span>
            </div>

            <div className="apf-group">
              <label className="apf-label">Password</label>
              <input
                className="apf-input"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                disabled={loading}
              />
              <span className="apf-hint">Share this with the staff member privately</span>
            </div>
          </div>

          {/* Live Preview */}
          {(form.name || form.email) && (
            <div className="apf-preview">
              <div className="apf-prev-label">
                <span className="apf-prev-dot" />
                LIVE PREVIEW
              </div>
              <div className="apf-prev-grid">
                {[
                  ["Name",   form.name  || "—"],
                  ["Email",  form.email || "—"],
                  ["Role",   "Employee"],
                  ["Access", "POS Only"],
                ].map(([k, v]) => (
                  <div key={k} className="apf-prev-item">
                    <span className="apf-prev-key">{k}</span>
                    <span className={`apf-prev-val ${k === "Access" ? "emp-green" : ""}`}>
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button className="apf-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? <span className="spinner" /> : "＋ Create Employee Account"}
          </button>
        </div>
      )}

      {/* Success card */}
      {view === "add" && lastAdded && (
        <div className="apf-success">
          <div className="apf-suc-row">
            <span className="apf-suc-icon">✓</span>
            <div>
              <div className="apf-suc-title">Employee Added — {lastAdded.name}</div>
              <div className="apf-suc-sub">{lastAdded.email} can now log in to the POS</div>
            </div>
          </div>
          <button className="apf-dismiss" onClick={() => setLastAdded(null)}>
            Dismiss
          </button>
        </div>
      )}

      {/* ── EMPLOYEE LIST ── */}
      {view === "list" && (
        <div className="apf-card">
          <div className="apf-head">
            <div className="apf-title">
              <span className="apf-dot" />
              EMPLOYEE LIST
            </div>
            <p className="apf-sub">
              All staff members who can log in to the POS screen.
            </p>
          </div>

          {/* Stats row */}
          <div className="emp-stats-row">
            <div className="emp-stat-chip">
              <span className="emp-stat-val">{employees.length}</span>
              <span className="emp-stat-label">Total Employees</span>
            </div>
            <div className="emp-stat-chip">
              <span className="emp-stat-val" style={{ color: "#16a34a" }}>
                {employees.filter(e => e.isActive !== false).length}
              </span>
              <span className="emp-stat-label">Active</span>
            </div>
            <button className="emp-refresh-btn" onClick={loadEmployees} disabled={fetching}>
              {fetching ? <span className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} /> : "↻ Refresh"}
            </button>
          </div>

          {/* List */}
          {fetching ? (
            <div className="emp-loading">
              <div className="dr-spinner" />
              <span>Loading employees…</span>
            </div>
          ) : employees.length === 0 ? (
            <div className="emp-empty">
              <div className="emp-empty-icon">👥</div>
              <p className="emp-empty-msg">No employees yet</p>
              <p className="emp-empty-sub">Add your first employee using the form</p>
              <button className="apf-submit" style={{ marginTop: 16, maxWidth: 220 }} onClick={() => setView("add")}>
                ＋ Add First Employee
              </button>
            </div>
          ) : (
            <div className="emp-list">
              {employees.map((emp, i) => (
                <div key={emp._id || emp.id || i} className="emp-row">
                  <div className="emp-avatar">
                    {(emp.name || "?")[0].toUpperCase()}
                  </div>
                  <div className="emp-info">
                    <div className="emp-name">{emp.name || "—"}</div>
                    <div className="emp-email">{emp.email || "—"}</div>
                  </div>
                  <div className="emp-right">
                    <span className={`emp-status ${emp.isActive === false ? "emp-status-off" : "emp-status-on"}`}>
                      {emp.isActive === false ? "Inactive" : "Active"}
                    </span>
                    <span className="emp-role-badge">POS Only</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}