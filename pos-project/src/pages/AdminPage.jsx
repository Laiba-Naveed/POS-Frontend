import React, { useState } from "react";
import { useToast } from "../hooks/useToast";
import { Toast } from "../components/shared";
import {
  AdminHeader,
  AddProductForm,
  LookupProduct,
  DailyReports,
} from "../components/admin";

const TABS = [
  ["add",     "＋",  "Add Product"],
  ["lookup",  "⌕",  "Lookup Product"],
  ["reports", "📊", "Daily Reports"],
];

export function AdminPage({ onGoBack }) {
  const [tab, setTab] = useState("add");
  const { toast, showToast } = useToast(3000);

  return (
    <div className="adm-root">
      <AdminHeader onGoBack={onGoBack} />

      <div className="adm-tabs">
        {TABS.map(([id, icon, label]) => (
          <button
            key={id}
            className={`adm-tab ${tab === id ? "adm-tab-active" : ""}`}
            onClick={() => setTab(id)}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      <main className="adm-main">
        <div className="adm-container">
          {tab === "add"    && <AddProductForm showToast={showToast} />}
          {tab === "lookup" && <LookupProduct  showToast={showToast} />}
          {tab === "reports"&& <DailyReports   showToast={showToast} />}
        </div>
      </main>

      <Toast toast={toast} />
    </div>
  );
}
