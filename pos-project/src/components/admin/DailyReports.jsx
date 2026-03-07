import React, { useState, useEffect } from "react";
import { api } from "../../api";

const fmt = (n) => "Rs " + Number(n).toLocaleString("en-PK");

function getSaleTime(s) {
  const r = s.createdAt || "";
  return r
    ? new Date(r).toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit", hour12: true })
    : "—";
}

export function DailyReports({ showToast }) {
  const [sales, setSales]         = useState([]);
  const [products, setProducts]   = useState([]);
  const [totalRevenue, setRev]    = useState(0);
  const [totalOrders, setOrders]  = useState(0);
  const [loading, setLoading]     = useState(true);
  const [expanded, setExpanded]   = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [salesData, productsData] = await Promise.all([
        api.getAllSales(),
        api.getAllProducts(),
      ]);
      const productsList = Array.isArray(productsData) ? productsData : productsData.products || [];
      setProducts(productsList);
      setRev(salesData.totalRevenue || 0);
      setOrders(salesData.totalOrders || 0);
      setSales(salesData.orders || []);
    } catch (e) {
      showToast("Could not load sales: " + e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const getProductName = (productField) => {
    if (!productField) return "—";
    if (typeof productField === "object" && productField.name) return productField.name;
    const id = typeof productField === "object" ? productField._id : productField;
    const found = products.find((p) => p._id === id || p._id?.toString() === id?.toString());
    return found ? found.name : `ID: ${String(id).slice(-6)}`;
  };

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
          <span style={{ display: "inline-block", animation: loading ? "spin 1s linear infinite" : "none" }}>↻</span>
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
          <div className="dr-card-value" style={{ fontSize: "clamp(18px, 5vw, 34px)", wordBreak: "break-word" }}>
            {fmt(totalRevenue)}
          </div>
          <div className="dr-card-sub">earned today</div>
        </div>
      </div>

      {/* Orders list header */}
      <div className="dr-list-header">
        <span className="dr-list-title">Order Details</span>
        <span className="dr-list-count">{totalOrders} order{totalOrders !== 1 ? "s" : ""}</span>
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
          <div className="dr-empty-sub">Orders will appear here once the first sale is completed</div>
        </div>
      ) : (
        <div className="dr-orders">
          {sales.map((sale, i) => {
            const items  = sale.items || [];
            const isOpen = expanded === i;
            const isCard = (sale.paymentMethod || "").toLowerCase() === "card";

            return (
              <div key={i} className={"dr-order" + (isOpen ? " dr-order-open" : "")}>
                <div className="dr-order-row" onClick={() => setExpanded(isOpen ? null : i)}>
                  <div className="dr-order-index">#{String(i + 1).padStart(2, "0")}</div>

                  {/* Info + method badge together */}
                  <div className="dr-order-info">
                    <div className="dr-order-time">{getSaleTime(sale)}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:"6px", marginTop:"3px", flexWrap:"wrap" }}>
                      <span className={"dr-order-method " + (isCard ? "dr-method-card" : "dr-method-cash")}>
                        {isCard ? "💳 Card" : "💵 Cash"}
                      </span>
                      <span className="dr-order-items">
                        {items.length > 0 ? items.length + " item" + (items.length !== 1 ? "s" : "") : "Order"}
                      </span>
                    </div>
                  </div>

                  <div className="dr-order-total">{fmt(sale.totalAmount || 0)}</div>
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
                          const qty   = it.quantity || 1;
                          const price = it.priceAtPurchase || 0;
                          const name  = getProductName(it.product);
                          return (
                            <div key={j} className="dr-item-row">
                              <span className="dr-item-name">{name}</span>
                              <span className="dr-item-qty">×{qty}</span>
                              <span className="dr-item-price">{fmt(price)}</span>
                              <span className="dr-item-sub">{fmt(price * qty)}</span>
                            </div>
                          );
                        })}
                        <div className="dr-order-footer">
                          <span>Order Total</span>
                          <span className="dr-order-footer-total">{fmt(sale.totalAmount || 0)}</span>
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