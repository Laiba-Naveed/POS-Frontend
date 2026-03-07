import React from "react";
import { CATEGORY_META } from "../../constants/categories";

export function CategoryBar({ products, cart, activeCategory, onSelect, fetching, catFetching }) {
  return (
    <div className="cat-bar">
      {Object.keys(CATEGORY_META).map((cat) => {
        const m = CATEGORY_META[cat];
        const catQty = products
          .filter((p) => p.category === cat)
          .reduce((s, p) => s + (cart[p.barcode] || 0), 0);
        const isActive = activeCategory === cat;

        // Spinner only on the chip currently being fetched
        const isLoadingThisChip = isActive && catFetching;

        return (
          <button
            key={cat}
            className={`cat-chip ${isActive ? "cat-chip-active" : ""}`}
            style={{ "--cc": m.color, "--cl": m.light, position: "relative" }}
            onClick={() => onSelect(isActive ? null : cat)}
            disabled={isLoadingThisChip}
          >
            <div className="cat-chip-img-wrap">
              <img src={m.image} alt={cat} className="cat-chip-img" />
            </div>

            <div className="cat-chip-info">
              <span className="cat-chip-name">{cat}</span>
              {m.urdu && <span className="cat-chip-urdu">{m.urdu}</span>}
            </div>

            {catQty > 0 && (
              <div className="cat-chip-badge" style={{ background: m.color }}>
                {catQty}
              </div>
            )}

            {isActive && (
              <div className="cat-chip-activebar" style={{ background: m.grad }} />
            )}

            {/* Initial page-load: dim all chips */}
            {fetching && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(255,255,255,0.45)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  color: "#888",
                  borderRadius: "inherit",
                  pointerEvents: "none",
                }}
              >
                …
              </div>
            )}

            {/* Per-category fetch: spinner only on the active chip */}
            {isLoadingThisChip && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(255,255,255,0.65)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "inherit",
                  pointerEvents: "none",
                }}
              >
                <span
                  style={{
                    width: 16,
                    height: 16,
                    border: `2px solid ${m.color}`,
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.6s linear infinite",
                  }}
                />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}