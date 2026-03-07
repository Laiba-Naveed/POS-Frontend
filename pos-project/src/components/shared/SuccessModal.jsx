import React from "react";
import { fmt } from "../../utils/helpers";

export function SuccessModal({ success, onClose }) {
  if (!success) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-check">✓</div>
        <h2 className="modal-title">Order Complete!</h2>
        <p className="modal-sub">Sale recorded successfully</p>
        <div className="modal-receipt">
          <div className="modal-row">
            <span>Payment</span>
            <span className="modal-val">{success.method.toUpperCase()}</span>
          </div>
          <div className="modal-row">
            <span>Items</span>
            <span className="modal-val">{success.items}</span>
          </div>
          <div className="modal-row">
            <span>TOTAL</span>
            <span className="modal-total">{fmt(success.total)}</span>
          </div>
        </div>
        <button className="modal-btn" onClick={onClose}>
          New Order →
        </button>
      </div>
    </div>
  );
}
