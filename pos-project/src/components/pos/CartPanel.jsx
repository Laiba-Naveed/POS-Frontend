import React, { useState } from "react";
import { fmt, getMeta } from "../../utils/helpers";

export function CartPanel({
  cartItems,
  total,
  itemCount,
  payMethod,
  setPayMethod,
  loading,
  onClear,
  onRemoveItem,
  onPay,
  orderNote,
  setOrderNote,
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearClick = () => setShowConfirm(true);
  const handleConfirmClear = () => { setShowConfirm(false); onClear(); };
  const handleCancelClear = () => setShowConfirm(false);

  return (
    <aside className="cart-panel">
      {/* Header */}
      <div className="cp-header">
        <span className="cp-title">
          <span className="cp-dot" />
          Your Order
        </span>
        {cartItems.length > 0 && (
          <button className="cp-clear" onClick={handleClearClick}>
            Clear
          </button>
        )}
      </div>

      {/* Confirm Clear Popup */}
      {showConfirm && (
        <div className="cp-confirm">
          <p className="cp-confirm-msg">Clear all items?</p>
          <div className="cp-confirm-btns">
            <button className="cp-confirm-yes" onClick={handleConfirmClear}>Yes, Clear</button>
            <button className="cp-confirm-no" onClick={handleCancelClear}>Cancel</button>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="cp-items">
        {cartItems.length === 0 ? (
          <div className="cp-empty">
            <div className="cp-empty-icon">🛒</div>
            <p>No items yet</p>
            <p className="cp-empty-hint">Select a category to start ordering</p>
          </div>
        ) : (
          cartItems.map((item) => {
            const m = getMeta(item.category);
            return (
              <div key={item.barcode} className="cp-item">
                <div className="cp-item-left">
                  <span
                    className="cp-item-emoji"
                    style={{ background: m.light }}
                  >
                    {m.emoji}
                  </span>
                  <div>
                    <div className="cp-item-name">{item.name}</div>
                    <div className="cp-item-unit">
                      {fmt(item.price)} × {item.qty}
                    </div>
                  </div>
                </div>
                <div className="cp-item-right">
                  <span className="cp-item-sub">{fmt(item.price * item.qty)}</span>
                  <button
                    className="cp-item-rm"
                    onClick={() => onRemoveItem(item.barcode)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Checkout */}
      {cartItems.length > 0 && (
        <div className="cp-checkout">
          {/* Order Notes */}
          <div className="cp-note-wrap">
            <label className="cp-note-label">📝 Order Notes</label>
            <textarea
              className="cp-note-input"
              placeholder="e.g. extra spicy, no onions..."
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              rows={2}
            />
          </div>

          <div className="cp-summary">
            <div className="cp-sum-row">
              <span>Items</span>
              <span>{itemCount}</span>
            </div>
            <div className="cp-total-row">
              <span>TOTAL</span>
              <span className="cp-total-val">{fmt(total)}</span>
            </div>
          </div>

          <div className="cp-pay-label">Payment Method</div>
          <div className="cp-methods">
            {["cash", "card"].map((m) => (
              <button
                key={m}
                className={`cp-method ${payMethod === m ? "cp-method-active" : ""}`}
                onClick={() => setPayMethod(m)}
              >
                {m === "cash" ? "💵" : "💳"}{" "}
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>

          <button
            className="cp-pay-btn"
            onClick={onPay}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              `Complete · ${fmt(total)}`
            )}
          </button>
        </div>
      )}
    </aside>
  );
}
