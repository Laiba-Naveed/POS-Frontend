import React from "react";

export function AdminHeader({ onGoBack }) {
  return (
    <header className="adm-header">
      <div className="adm-hdr-left">
        <span className="logo">⬡ POS</span>
        <div className="adm-divider" />
        <div>
          <span className="adm-title">Admin Panel</span>
          <span className="adm-sub">Product Management</span>
        </div>
      </div>
      <button className="adm-back-btn" onClick={onGoBack}>
        ← Back to POS
      </button>
    </header>
  );
}
