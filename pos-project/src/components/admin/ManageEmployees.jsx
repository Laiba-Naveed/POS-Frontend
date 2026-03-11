import React, { useState, useEffect, useRef } from "react";
import { api } from "../../api";

const API_BASE = "https://fortunate-robby-lalallalalaalaallaalla-cfde15bf.koyeb.app/api";
const EMPTY_FORM = { name: "", email: "", password: "", branchId: "" };

export function ManageEmployees({ showToast }) {
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [loading, setLoading]           = useState(false);
  const [fetching, setFetching]         = useState(true);
  const [employees, setEmployees]       = useState([]);
  const [lastAdded, setLastAdded]       = useState(null);
  const [view, setView]                 = useState("add");
  const [branches, setBranches]         = useState([]);
  const [branchSearch, setBranchSearch] = useState("");
  const [branchOpen, setBranchOpen]     = useState(false);
  const [filterBranch, setFilterBranch] = useState(""); // for list filter
  const [filterOpen, setFilterOpen]     = useState(false);
  const branchRef  = useRef(null);
  const filterRef  = useRef(null);

  useEffect(() => {
    loadEmployees();
    loadBranches();
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (branchRef.current && !branchRef.current.contains(e.target)) setBranchOpen(false);
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const loadBranches = async () => {
    try {
      const res = await fetch(`${API_BASE}/branches`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("pos_admin_token") || localStorage.getItem("pos_token")}`,
        },
      });
      const data = await res.json();
      if (res.ok) setBranches(Array.isArray(data) ? data : []);
    } catch (_) {}
  };

  const loadEmployees = async () => {
    setFetching(true);
    try {
      const data = await api.getEmployees();
      const list = Array.isArray(data) ? data : data.users || data.employees || [];
      setEmployees(list.filter((e) => e.role === "employee" || e.role === "cashier" || !e.role));
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

  const selectedBranch   = branches.find((b) => b._id === form.branchId);
  const selectedFilter   = branches.find((b) => b._id === filterBranch);

  const filteredBranches = branches.filter((b) =>
    b.name.toLowerCase().includes(branchSearch.toLowerCase()) ||
    (b.address && b.address.toLowerCase().includes(branchSearch.toLowerCase()))
  );

  // Filter employees by selected branch
  const filteredEmployees = filterBranch
    ? employees.filter((e) => e.branchId === filterBranch || (e.branchId && e.branchId._id === filterBranch))
    : employees;

  const handleSubmit = async () => {
    const { name, email, password, branchId } = form;
    if (!name.trim() || !email.trim() || !password.trim()) {
      showToast("All fields are required", "warning");
      return;
    }
    if (!branchId) {
      showToast("Please select a branch", "warning");
      return;
    }
    if (password.length < 6) {
      showToast("Password must be at least 6 characters", "warning");
      return;
    }
    setLoading(true);
    try {
      await api.createUser({ name: name.trim(), email: email.trim(), password, role: "employee", branchId });
      setLastAdded({ name: name.trim(), email: email.trim(), branchName: selectedBranch?.name || branchId });
      showToast(`"${name}" added as employee!`, "success");
      setForm(EMPTY_FORM);
      setBranchSearch("");
      loadEmployees();
    } catch (e) {
      showToast(e.message || "Failed to create employee", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apf-wrap">

      {/* Toggle */}
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
            <div className="apf-title"><span className="apf-dot" /> ADD NEW EMPLOYEE</div>
            <p className="apf-sub">
              Create login credentials for your POS staff. Only employees added here can sign in to the POS screen.
            </p>
          </div>

          <div className="apf-fields">
            <div className="apf-group">
              <label className="apf-label">Full Name</label>
              <input className="apf-input" name="name" value={form.name}
                onChange={handleChange} placeholder="e.g. Ahmed Khan" disabled={loading} />
            </div>

            <div className="apf-group">
              <label className="apf-label">Email Address</label>
              <input className="apf-input" type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="e.g. ahmed@yourshop.com" disabled={loading} />
              <span className="apf-hint">This is what they'll use to log in to POS</span>
            </div>

            <div className="apf-group">
              <label className="apf-label">Password</label>
              <input className="apf-input" type="password" name="password" value={form.password}
                onChange={handleChange} placeholder="Min. 6 characters" disabled={loading} />
              <span className="apf-hint">Share this with the staff member privately</span>
            </div>

            {/* Searchable Branch Dropdown */}
            <div className="apf-group">
              <label className="apf-label">Branch</label>
              <div className="apf-dw" ref={branchRef}>
                <div className="apf-ir" style={{ position: "relative" }}>
                  <input
                    className="apf-input"
                    placeholder={selectedBranch ? selectedBranch.name : "Type to search branch..."}
                    value={branchSearch}
                    onChange={(e) => { setBranchSearch(e.target.value); setBranchOpen(true); }}
                    onFocus={() => setBranchOpen(true)}
                    disabled={loading}
                    style={{ paddingRight: 40 }}
                  />
                  <button type="button"
                    onClick={() => {
                      if (form.branchId) { setForm((p) => ({ ...p, branchId: "" })); setBranchSearch(""); }
                      else setBranchOpen(!branchOpen);
                    }}
                    style={{ position: "absolute", right: 0, top: 0, bottom: 0, border: "none", background: "transparent", cursor: "pointer", color: "#F4A300", fontSize: 14, padding: "0 14px" }}
                  >
                    {form.branchId ? "✕" : "▼"}
                  </button>
                </div>

                {selectedBranch && (
                  <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 7, padding: "6px 10px", background: "#FFF3E0", border: "1.5px solid #F4A300", borderRadius: 8 }}>
                    <span>🏪</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#2C1810" }}>{selectedBranch.name}</div>
                      {selectedBranch.address && <div style={{ fontSize: 11, color: "#c8a98a" }}>{selectedBranch.address}</div>}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#16a34a", background: "#F0FDF4", border: "1.5px solid #bbf7d0", borderRadius: 10, padding: "2px 8px" }}>Selected ✓</span>
                  </div>
                )}

                {branchOpen && (
                  <div className="apf-drop" style={{ maxHeight: 200, overflowY: "auto" }}>
                    {filteredBranches.length === 0 ? (
                      <div className="apf-di" style={{ color: "#c8a98a", justifyContent: "center" }}>
                        {branches.length === 0 ? "No branches found" : "No matching branches"}
                      </div>
                    ) : filteredBranches.map((br) => (
                      <div key={br._id}
                        className={`apf-di ${form.branchId === br._id ? "apf-di-active" : ""}`}
                        onClick={() => { setForm((p) => ({ ...p, branchId: br._id })); setBranchSearch(""); setBranchOpen(false); }}
                      >
                        <span>🏪</span>
                        <div>
                          <div style={{ fontWeight: 700 }}>{br.name}</div>
                          {br.address && <div style={{ fontSize: 11, color: "#c8a98a" }}>{br.address}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <span className="apf-hint">Assign this employee to a specific branch</span>
            </div>
          </div>

          {/* Live Preview */}
          {(form.name || form.email) && (
            <div className="apf-preview">
              <div className="apf-prev-label"><span className="apf-prev-dot" /> LIVE PREVIEW</div>
              <div className="apf-prev-grid">
                {[
                  ["Name",   form.name  || "—"],
                  ["Email",  form.email || "—"],
                  ["Role",   "Employee"],
                  ["Branch", selectedBranch?.name || "—"],
                  ["Access", "POS Only"],
                ].map(([k, v]) => (
                  <div key={k} className="apf-prev-item">
                    <span className="apf-prev-key">{k}</span>
                    <span className={`apf-prev-val ${k === "Access" ? "emp-green" : ""}`}>{v}</span>
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
              <div className="apf-suc-sub">{lastAdded.email} assigned to {lastAdded.branchName}</div>
            </div>
          </div>
          <button className="apf-dismiss" onClick={() => setLastAdded(null)}>Dismiss</button>
        </div>
      )}

      {/* ── EMPLOYEE LIST ── */}
      {view === "list" && (
        <div className="apf-card">
          <div className="apf-head">
            <div className="apf-title"><span className="apf-dot" /> EMPLOYEE LIST</div>
            <p className="apf-sub">All staff members who can log in to the POS screen.</p>
          </div>

          {/* Stats row */}
          <div className="emp-stats-row">
            <div className="emp-stat-chip">
              <span className="emp-stat-val">{filteredEmployees.length}</span>
              <span className="emp-stat-label">{filterBranch ? "In Branch" : "Total"}</span>
            </div>
            <div className="emp-stat-chip">
              <span className="emp-stat-val" style={{ color: "#16a34a" }}>
                {filteredEmployees.filter((e) => e.isActive !== false).length}
              </span>
              <span className="emp-stat-label">Active</span>
            </div>
            <button className="emp-refresh-btn" onClick={loadEmployees} disabled={fetching}>
              {fetching ? <span className="spinner" style={{ width: 12, height: 12, borderWidth: 2 }} /> : "↻ Refresh"}
            </button>
          </div>

          {/* Branch Filter */}
          <div style={{ marginBottom: 16 }} ref={filterRef}>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#c8a98a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
              Filter by Branch
            </div>
            <div style={{ position: "relative" }}>
              <button
                type="button"
                className="apf-input"
                style={{ textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", width: "100%" }}
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 7, color: selectedFilter ? "#2C1810" : "#c8a98a" }}>
                  <span>🏪</span>
                  {selectedFilter ? selectedFilter.name : "All Branches"}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {filterBranch && (
                    <span
                      onClick={(e) => { e.stopPropagation(); setFilterBranch(""); }}
                      style={{ fontSize: 12, color: "#B71C1C", fontWeight: 800, cursor: "pointer", background: "#FFF0F0", borderRadius: 6, padding: "1px 7px" }}
                    >
                      ✕ Clear
                    </span>
                  )}
                  <span style={{ fontSize: 11, color: "#c8a98a" }}>{filterOpen ? "▲" : "▼"}</span>
                </span>
              </button>

              {filterOpen && (
                <div className="apf-drop" style={{ maxHeight: 200, overflowY: "auto" }}>
                  {/* All branches option */}
                  <div
                    className={`apf-di ${!filterBranch ? "apf-di-active" : ""}`}
                    onClick={() => { setFilterBranch(""); setFilterOpen(false); }}
                  >
                    <span>🌐</span>
                    <div style={{ fontWeight: 700 }}>All Branches</div>
                  </div>
                  {branches.map((br) => (
                    <div
                      key={br._id}
                      className={`apf-di ${filterBranch === br._id ? "apf-di-active" : ""}`}
                      onClick={() => { setFilterBranch(br._id); setFilterOpen(false); }}
                    >
                      <span>🏪</span>
                      <div>
                        <div style={{ fontWeight: 700 }}>{br.name}</div>
                        {br.address && <div style={{ fontSize: 11, color: "#c8a98a" }}>{br.address}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {filterBranch && selectedFilter && (
              <div style={{ marginTop: 6, fontSize: 12, color: "#F4A300", fontWeight: 700 }}>
                Showing employees for: {selectedFilter.name}
              </div>
            )}
          </div>

          {/* List */}
          {fetching ? (
            <div className="emp-loading">
              <div className="dr-spinner" />
              <span>Loading employees…</span>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="emp-empty">
              <div className="emp-empty-icon">👥</div>
              <p className="emp-empty-msg">{filterBranch ? "No employees in this branch" : "No employees yet"}</p>
              <p className="emp-empty-sub">{filterBranch ? "Try selecting a different branch" : "Add your first employee using the form"}</p>
              {!filterBranch && (
                <button className="apf-submit" style={{ marginTop: 16, maxWidth: 220 }} onClick={() => setView("add")}>
                  ＋ Add First Employee
                </button>
              )}
            </div>
          ) : (
            <div className="emp-list">
              {filteredEmployees.map((emp, i) => (
                <div key={emp._id || emp.id || i} className="emp-row">
                  <div className="emp-avatar">{(emp.name || "?")[0].toUpperCase()}</div>
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