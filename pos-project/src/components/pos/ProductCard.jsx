import React, { useState } from "react";
import { fmt } from "../../utils/helpers";

export function ProductCard({ product, qty, meta, index, onAdd, onDec }) {
  const out = product.stock === 0;
  const low = product.stock > 0 && product.stock <= 5;
  const [imgError, setImgError] = useState(false);

  // Try /products/{barcode}.jpg — fallback to emoji if missing
  const toCamel = (s) => s.trim().split(/s+/).map((w,i) => i===0 ? w.charAt(0).toLowerCase()+w.slice(1) : w.charAt(0).toUpperCase()+w.slice(1)).join("");
  const imgBase = toCamel(product.name);
  // Try jpg first, webp as fallback handled via onError chain
  const imgSrc = `/products/${imgBase}.jpg`;
  const imgSrcWebp = `/products/${imgBase}.webp`;

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

      {/* Product image or emoji fallback */}
      <div className="prod-icon-wrap" style={{ background: meta.light, width:"100%", height:"100px", borderRadius:"10px", overflow:"hidden", position:"relative" }}>
        {!imgError ? (
          <img
            src={imgSrc}
            alt={product.name}
            onError={(e) => {
              // Try webp before giving up
              if (e.target.src !== window.location.origin + imgSrcWebp) {
                e.target.src = imgSrcWebp;
              } else {
                setImgError(true);
              }
            }}
            style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
          />
        ) : (
          <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span className="prod-icon">{meta.emoji}</span>
          </div>
        )}
        {low && <span className="badge badge-low" style={{ position:"absolute", top:"6px", right:"6px" }}>Low</span>}
        {out && <span className="badge badge-out" style={{ position:"absolute", top:"6px", right:"6px" }}>Out</span>}
      </div>

      <div className="prod-info">
        <span className="prod-name">{product.name}</span>
        <span className="prod-price" style={{ color: meta.color }}>
          {fmt(product.price)}
        </span>
        <span
          className="prod-stock"
          style={{ color: out ? "#dc2626" : low ? "#ca8a04" : "#aaa" }}
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