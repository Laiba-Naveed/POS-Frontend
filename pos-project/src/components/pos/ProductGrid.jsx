import React from "react";
import { getMeta } from "../../utils/helpers";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ activeCategory, categoryProducts, cart, onAdd, onDec }) {
  const meta = getMeta(activeCategory);

  if (!activeCategory) {
    return (
      <div className="hint-box">
        <span className="hint-icon">👆</span>
        <p>Tap a category above to browse items</p>
      </div>
    );
  }

  return (
    <div className="prod-area">
      <div className="prod-area-header" style={{ borderLeftColor: meta.color }}>
        <span className="pah-emoji">{meta.emoji}</span>
        <div>
          <span className="pah-name" style={{ color: meta.color }}>
            {activeCategory}
          </span>
          <span className="pah-count">{categoryProducts.length} items</span>
        </div>
        {meta.urdu && (
          <span className="pah-urdu" style={{ color: meta.color }}>
            {meta.urdu}
          </span>
        )}
      </div>

      {categoryProducts.length === 0 ? (
        <div className="empty-msg" style={{ marginTop: 24 }}>
          No products in this category yet
        </div>
      ) : (
        <div className="prod-grid">
          {categoryProducts.map((p, i) => (
            <ProductCard
              key={p.barcode}
              product={p}
              qty={cart[p.barcode] || 0}
              meta={meta}
              index={i}
              onAdd={onAdd}
              onDec={onDec}
            />
          ))}
        </div>
      )}
    </div>
  );
}
