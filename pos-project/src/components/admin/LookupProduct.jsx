import React, { useState, useRef } from "react";
import { api } from "../../api";
import { fmt } from "../../utils/helpers";

function getStockStatus(product) {
  if (!product) return null;
  if (product.stock === 0)
    return { label: "Out of Stock", color: "#dc2626", bg: "#fff1f2", border: "#fca5a5" };
  if (product.stock <= 5)
    return { label: "Low Stock", color: "#ca8a04", bg: "#fefce8", border: "#fde047" };
  return { label: "In Stock", color: "#16a34a", bg: "#f0fdf4", border: "#86efac" };
}

export function LookupProduct({ showToast }) {
  const [barcode, setBarcode]   = useState("");
  const [product, setProduct]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef(null);

  const handleLookup = async () => {
    const code = barcode.trim();
    if (!code) { showToast("Enter a barcode", "warning"); return; }
    setLoading(true); setProduct(null); setSearched(false);
    try {
      const data = await api.getProduct(code);
      setProduct(data); setSearched(true);
    } catch (e) {
      setSearched(true);
      showToast(e.message || "Not found", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setBarcode(""); setProduct(null); setSearched(false);
    inputRef.current?.focus();
  };

  const stockStatus = getStockStatus(product);

  return (
    <div className="lp-wrap">
      <div className="lp-card">
        <div className="lp-head">
          <div className="lp-title">
            <span className="lp-dot" />LOOKUP PRODUCT
          </div>
          <p className="lp-sub">Enter a barcode to retrieve product details from the database.</p>
        </div>

        <div className="lp-row">
          <input
            ref={inputRef}
            className="lp-input"
            type="text"
            placeholder="Enter barcode…"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLookup()}
            disabled={loading}
          />
          <button
            className="lp-search-btn"
            onClick={handleLookup}
            disabled={loading || !barcode.trim()}
          >
            {loading ? <span className="spinner" /> : "Search"}
          </button>
          {(barcode || searched) && (
            <button className="lp-clear-btn" onClick={handleClear}>✕</button>
          )}
        </div>

        {searched && !product && !loading && (
          <div className="lp-not-found">
            <div className="lp-nf-icon">⊘</div>
            <div className="lp-nf-title">Product Not Found</div>
            <div className="lp-nf-sub">
              No product with barcode <strong>"{barcode}"</strong>
            </div>
          </div>
        )}

        {product && (
          <div className="lp-result">
            <div className="lp-res-head">
              <span className="lp-res-name">{product.name}</span>
              <span
                className="lp-stock-badge"
                style={{
                  color: stockStatus.color,
                  background: stockStatus.bg,
                  border: `1px solid ${stockStatus.border}`,
                }}
              >
                {stockStatus.label}
              </span>
            </div>

            <div className="lp-res-grid">
              {[
                ["Barcode", product.barcode],
                ["Category", product.category],
                ["Price", `PKR ${Number(product.price).toLocaleString()}`],
                ["Stock", `${product.stock} units`],
              ].map(([k, v]) => (
                <div key={k} className="lp-cell">
                  <span className="lp-cell-k">{k}</span>
                  <span
                    className={`lp-cell-v ${k === "Price" ? "lp-cell-red" : ""}`}
                    style={k === "Stock" ? { color: stockStatus.color } : {}}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>

            <div className="lp-bar-wrap">
              <div className="lp-bar-label">
                <span>Stock Level</span>
                <span>{product.stock} / {Math.max(product.stock, 50)}</span>
              </div>
              <div className="lp-bar-track">
                <div
                  className="lp-bar-fill"
                  style={{
                    width: `${Math.min((product.stock / Math.max(product.stock, 50)) * 100, 100)}%`,
                    background: stockStatus.color,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="lp-tips">
        <div className="lp-tips-title">
          <span className="lp-tips-dot" />HOW TO USE
        </div>
        {[
          "Enter the product barcode in the search field",
          "Press Enter or click Search",
          "Green = in stock · Yellow = low · Red = out of stock",
          "Not found? Add it in the Add Product tab",
        ].map((t, i) => (
          <div key={i} className="lp-tip">
            <span className="lp-tip-num">{i + 1}</span>
            <span>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
