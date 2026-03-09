import React, { useState } from "react";
import { fmt } from "../../utils/helpers";

// Manual map: exact product name (as in DB) -> image filename (without extension)
const IMAGE_MAP = {
  "Murgh Chana":   "murghChanay",
  "Andy Chana":    "andaChanay",
  "Murgh Chanay":  "murghChanay",
  "Anda Chanay":   "andaChanay",
  "Garlic Naan":   "GarlicNaan",
  "Kulcha Naan":   "kulchaNaan",
  "Roghni Naan":   "roghniNaan",
  "Mango Lassi":   "mangoLassi",
  "Namkeen Lassi": "namkeenLassi",
  "Salad":         "salad",
  "Water":         "water",
};

// Fallback: "Garlic Naan" -> "garlicNaan"
function toCamel(str) {
  return str.trim().split(/\s+/).map((w, i) =>
    i === 0
      ? w.charAt(0).toLowerCase() + w.slice(1)
      : w.charAt(0).toUpperCase() + w.slice(1)
  ).join("");
}

export function ProductCard({ product, qty, meta, index, onAdd, onDec }) {
  const out = product.stock === 0;
  const low = product.stock > 0 && product.stock <= 5;

  const base = IMAGE_MAP[product.name] || toCamel(product.name);
  const extensions = ["jpg", "webp", "jpeg", "png"];
  const [extIndex, setExtIndex] = useState(0);
  const [imgFailed, setImgFailed] = useState(false);

  const imgSrc = !imgFailed ? `/products/${base}.${extensions[extIndex]}` : null;

  const handleImgError = () => {
    const next = extIndex + 1;
    if (next < extensions.length) {
      setExtIndex(next);
    } else {
      setImgFailed(true);
    }
  };

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

      <div style={{
        width: "100%", height: "100px", borderRadius: "10px",
        overflow: "hidden", position: "relative", background: meta.light,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {!imgFailed && imgSrc ? (
          <img
            key={imgSrc}
            src={imgSrc}
            alt={product.name}
            onError={handleImgError}
            style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
          />
        ) : (
          <span style={{ fontSize:"32px" }}>{meta.emoji}</span>
        )}
        {low && <span className="badge badge-low" style={{ position:"absolute", top:"6px", right:"6px" }}>Low</span>}
        {out && <span className="badge badge-out" style={{ position:"absolute", top:"6px", right:"6px" }}>Out</span>}
      </div>

      <div className="prod-info">
        <span className="prod-name">{product.name}</span>
        <span className="prod-price" style={{ color: meta.color }}>{fmt(product.price)}</span>
        <span className="prod-stock" style={{ color: out ? "#dc2626" : low ? "#ca8a04" : "#aaa" }}>
          {out ? "Out of stock" : low ? `Only ${product.stock} left` : `${product.stock} in stock`}
        </span>
      </div>

      <div className="prod-ctrl">
        {qty === 0 ? (
          <button
            className="btn-add"
            style={{ background: out ? "#e5e7eb" : meta.grad, cursor: out ? "not-allowed" : "pointer" }}
            onClick={() => !out && onAdd(product)}
            disabled={out}
          >
            {out ? "Unavailable" : "+ Add"}
          </button>
        ) : (
          <div className="qty-row">
            <button className="qty-btn" style={{ borderColor: meta.color, color: meta.color }} onClick={() => onDec(product.barcode)}>−</button>
            <span className="qty-num" style={{ color: meta.color }}>{qty}</span>
            <button className="qty-btn" style={{ borderColor: meta.color, color: meta.color }} onClick={() => onAdd(product)}>+</button>
          </div>
        )}
      </div>

      {qty > 0 && (
        <div className="prod-sub" style={{ background: meta.light, color: meta.color }}>
          {fmt(product.price * qty)}
        </div>
      )}
    </div>
  );
}