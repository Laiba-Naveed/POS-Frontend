import React from "react";
import { fmt } from "../../utils/helpers";

export function POSHeader({ dailyRevenue, dailyOrders, onGoAdmin }) {
  return (
    <header className="pos-header">
      <div className="pos-header-left">
        <span className="logo">⬡ POS</span>
        <div className="hdr-meta">
          <span className="hdr-title">Order Terminal</span>
          <span className="hdr-date">
            {new Date().toLocaleDateString("en-PK", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
      <div className="pos-header-right">
        <div className="stat-chip">
          <span className="sc-label">Revenue</span>
          <span className="sc-val">{fmt(dailyRevenue)}</span>
        </div>
        <div className="stat-chip">
          <span className="sc-label">Orders</span>
          <span className="sc-val">{dailyOrders}</span>
        </div>
        <button className="admin-btn" onClick={onGoAdmin}>
          ⚙ Admin
        </button>
      </div>
    </header>
  );
}
