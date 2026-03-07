import React from "react";
import { fmt } from "../../utils/helpers";

export function ProductCard({ product, qty, meta, index, onAdd, onDec }) {
  const out = product.stock === 0;
  const low = product.stock > 0 && product.stock <= 5;

  return (
    <div
      className={`prod-card ${out ? "prod-card-out" : ""} ${qty > 0 ? "prod-card-sel" : ""}`}
      style={{
        "--cc": meta.color,
        "--cl": meta.light,
        animationDelay: `${index * 40}ms`,
      }}
    >
      {qty > 0 && <div className="prod-ring" style={{ borderColor: meta.color }} />}

      <div className="prod-icon-wrap" style={{ background: meta.light }}>
        <span className="prod-icon">{meta.emoji}</span>
        {low && <span className="badge badge-low">Low</span>}
        {out && <span className="badge badge-out">Out</span>}
      </div>

      <div className="prod-info">
        <span className="prod-name">{product.name}</span>
        <span className="prod-price" style={{ color: meta.color }}>
          {fmt(product.price)}
        </span>
        <span
          className="prod-stock"
          style={{
            color: out ? "#dc2626" : low ? "#ca8a04" : "#aaa",
          }}
        >
          {out ? "Out of stock" : low ? `Only ${product.stock} left` : `${product.stock} in stock`}
        </span>
      </div>

      <div className="prod-ctrl">
        {qty === 0 ? (
          <button
            className="btn-add"
            style={{
              background: out ? "#e5e7eb" : meta.grad,
              cursor: out ? "not-allowed" : "pointer",
            }}
            onClick={() => !out && onAdd(product)}
            disabled={out}
          >
            {out ? "Unavailable" : "+ Add"}
          </button>
        ) : (
          <div className="qty-row">
            <button
              className="qty-btn"
              style={{ borderColor: meta.color, color: meta.color }}
              onClick={() => onDec(product.barcode)}
            >
              −
            </button>
            <span className="qty-num" style={{ color: meta.color }}>
              {qty}
            </span>
            <button
              className="qty-btn"
              style={{ borderColor: meta.color, color: meta.color }}
              onClick={() => onAdd(product)}
            >
              +
            </button>
          </div>
        )}
      </div>

      {qty > 0 && (
        <div
          className="prod-sub"
          style={{ background: meta.light, color: meta.color }}
        >
          {fmt(product.price * qty)}
        </div>
      )}
    </div>
  );
}
