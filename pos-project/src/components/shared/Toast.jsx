import React from "react";

export function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`toast toast-${toast.type}`}>
      <span>
        {toast.type === "success" ? "✓" : toast.type === "warning" ? "⚠" : "✕"}
      </span>
      <span>{toast.msg}</span>
    </div>
  );
}
