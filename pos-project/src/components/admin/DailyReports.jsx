import React, { useState, useEffect } from "react";
import { api } from "../../api";

const fmt = (n) => "Rs " + Number(n).toLocaleString("en-PK");

function getSaleDate(s) {
  const r = s.createdAt || s.date || s.created_at || s.timestamp || s.saleDate || "";
  return r ? new Date(r).toISOString().slice(0, 10) : "";
}

function getSaleTotal(s) {
  return Number(s.totalAmount || s.total || s.amount || s.grandTotal || 0);
}

function getSaleTime(s) {
  const r = s.createdAt || s.date || s.created_at || s.timestamp || s.saleDate || "";
  return r
    ? new Date(r).toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit", hour12: true })
    : "—";
}

export function DailyReports({ showToast }) {
  const [sales, setSales]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState(null);
  const todayStr = new Date().toISOString().slice(0, 10);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api.getAllSales();
      const list = Array.isArray(data) ? data : data.sales || data.data || [];
      setSales(list.filter((s) => getSaleDate(s) === todayStr));
    } catch (e) {
      showToast("Could not load sales: " + e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const totalRevenue = sales.reduce((sum, s) => sum + getSaleTotal(s), 0);
  const totalOrders  = sales.length;

  return (
    <div className="dr-page">
      {/* Header */}
      <div className="dr-header">
        <div>
          <div className="dr-title">Daily Report</div>
          <div className="dr-date">
            {new Date().toLocaleDateString("en-PK", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
            })}
          </div>
        </div>
        <button className="dr-refresh" onClick={load} disabled={loading}>
          <span style={{ display: "inline-block", animation: loading ? "spin 1s linear infinite" : "none" }}>
            ↻
          </span>
          {loading ? " Loading…" : " Refresh"}
        </button>
      </div>

      {/* Summary cards */}
      <div className="dr-cards">
        <div className="dr-card dr-card-orders">
          <div className="dr-card-bg-num">{totalOrders}</div>
          <div className="dr-card-label">Total Orders</div>
          <div className="dr-card-value">{totalOrders}</div>
          <div className="dr-card-sub">orders today</div>
        </div>
        <div className="dr-card dr-card-revenue">
          <div className="dr-card-bg-num">₨</div>
          <div className="dr-card-label">Total Revenue</div>
          <div className="dr-card-value">{fmt(totalRevenue)}</div>
          <div className="dr-card-sub">earned today</div>
        </div>
      </div>

      {/* Orders list header */}
      <div className="dr-list-header">
        <span className="dr-list-title">Order Details</span>
        <span className="dr-list-count">
          {totalOrders} order{totalOrders !== 1 ? "s" : ""}
        </span>
      </div>

      {loading ? (
        <div className="dr-loading-box">
          <div className="dr-spinner" />
          <span>Fetching today's orders…</span>
        </div>
      ) : sales.length === 0 ? (
        <div className="dr-empty-box">
          <div className="dr-empty-icon">🧾</div>
          <div className="dr-empty-msg">No orders recorded today</div>
          <div className="dr-empty-sub">
            Orders will appear here once the first sale is completed
          </div>
        </div>
      ) : (
        <div className="dr-orders">
          {sales.map((sale, i) => {
            const items  = sale.items || sale.products || sale.orderItems || [];
            const isOpen = expanded === i;
            const isCard = (sale.paymentMethod || "").toLowerCase() === "card";

            return (
              <div key={i} className={"dr-order" + (isOpen ? " dr-order-open" : "")}>
                <div
                  className="dr-order-row"
                  onClick={() => setExpanded(isOpen ? null : i)}
                >
                  <div className="dr-order-index">#{String(i + 1).padStart(2, "0")}</div>
                  <div className="dr-order-info">
                    <div className="dr-order-time">{getSaleTime(sale)}</div>
                    <div className="dr-order-items">
                      {items.length > 0
                        ? items.length + " item" + (items.length !== 1 ? "s" : "")
                        : "Order"}
                    </div>
                  </div>
                  <div className={"dr-order-method " + (isCard ? "dr-method-card" : "dr-method-cash")}>
                    {isCard ? "💳 Card" : "💵 Cash"}
                  </div>
                  <div className="dr-order-total">{fmt(getSaleTotal(sale))}</div>
                  <div className="dr-order-chevron">{isOpen ? "▲" : "▼"}</div>
                </div>

                {isOpen && (
                  <div className="dr-order-detail">
                    {items.length === 0 ? (
                      <div className="dr-no-items">No item breakdown available</div>
                    ) : (
                      <>
                        <div className="dr-items-head">
                          <span>Item</span>
                          <span>Qty</span>
                          <span>Price</span>
                          <span>Subtotal</span>
                        </div>
                        {items.map((it, j) => {
                          const qty   = it.quantity || it.qty || 1;
                          const price = it.price || it.unitPrice || 0;
                          return (
                            <div key={j} className="dr-item-row">
                              <span className="dr-item-name">
                                {it.name || it.productName || it.barcode || "—"}
                              </span>
                              <span className="dr-item-qty">×{qty}</span>
                              <span className="dr-item-price">{fmt(price)}</span>
                              <span className="dr-item-sub">{fmt(price * qty)}</span>
                            </div>
                          );
                        })}
                        <div className="dr-order-footer">
                          <span>Order Total</span>
                          <span className="dr-order-footer-total">{fmt(getSaleTotal(sale))}</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
