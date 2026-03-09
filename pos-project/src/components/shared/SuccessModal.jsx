import React, { useEffect } from "react";
import { fmt } from "../../utils/helpers";

function generateReceiptHTML(success) {
  const now = new Date();
  const date = now.toLocaleDateString("en-PK", { weekday:"long", year:"numeric", month:"long", day:"numeric" });
  const time = now.toLocaleTimeString("en-PK", { hour:"2-digit", minute:"2-digit", hour12:true });
  const orderNum = Math.floor(Math.random() * 9000) + 1000;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Receipt #${orderNum}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: 'Courier New', Courier, monospace;
      background: #fff;
      display: flex;
      justify-content: center;
      padding: 20px;
    }
    .receipt {
      width: 300px;
      padding: 24px 20px;
      border: 1px dashed #ccc;
    }
    .receipt-header { text-align: center; margin-bottom: 16px; }
    .receipt-logo { font-size: 22px; font-weight: 900; letter-spacing: 4px; color: #111; }
    .receipt-tagline { font-size: 11px; color: #666; margin-top: 3px; }
    .receipt-divider { border: none; border-top: 1px dashed #aaa; margin: 12px 0; }
    .receipt-meta { font-size: 11px; color: #444; margin-bottom: 2px; }
    .receipt-section-title {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #999;
      text-align: center;
      margin: 10px 0 6px;
    }
    .receipt-row {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      padding: 3px 0;
      color: #333;
    }
    .receipt-row-bold {
      font-weight: 700;
      font-size: 13px;
      color: #111;
    }
    .receipt-total-row {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      font-weight: 900;
      padding: 8px 0 4px;
      border-top: 2px solid #111;
      margin-top: 6px;
      color: #111;
    }
    .receipt-footer { text-align: center; margin-top: 16px; }
    .receipt-footer p { font-size: 11px; color: #666; margin-top: 3px; }
    .receipt-barcode {
      text-align: center;
      font-size: 28px;
      letter-spacing: 3px;
      margin: 12px 0 4px;
      color: #111;
    }
    .receipt-order-num {
      text-align: center;
      font-size: 11px;
      color: #888;
      letter-spacing: 1px;
    }
    .receipt-paid {
      text-align: center;
      margin: 10px 0;
      font-size: 13px;
      font-weight: 700;
      border: 2px solid #111;
      padding: 4px 12px;
      display: inline-block;
      letter-spacing: 3px;
    }
    .receipt-paid-wrap { text-align: center; }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="receipt-header">
      <div class="receipt-logo">⬡ POS</div>
      <div class="receipt-tagline">Order Terminal</div>
    </div>

    <hr class="receipt-divider"/>

    <div class="receipt-meta">Date: ${date}</div>
    <div class="receipt-meta">Time: ${time}</div>
    <div class="receipt-meta">Order #: ${orderNum}</div>

    <hr class="receipt-divider"/>

    <div class="receipt-section-title">— Order Summary —</div>

    <div class="receipt-row">
      <span>Total Items</span>
      <span>${success.items}</span>
    </div>
    <div class="receipt-row">
      <span>Payment Method</span>
      <span>${success.method.toUpperCase()}</span>
    </div>

    <div class="receipt-total-row">
      <span>TOTAL</span>
      <span>${fmt(success.total)}</span>
    </div>

    <hr class="receipt-divider"/>

    <div class="receipt-paid-wrap">
      <span class="receipt-paid">PAID</span>
    </div>

    <div class="receipt-barcode">||| || ||| || |||</div>
    <div class="receipt-order-num">#${orderNum}</div>

    <hr class="receipt-divider"/>

    <div class="receipt-footer">
      <p>Thank you for your order!</p>
      <p>Please visit us again.</p>
      <p style="margin-top:8px; font-size:10px; color:#aaa;">*** Customer Copy ***</p>
    </div>
  </div>
</body>
</html>`;
}

function downloadReceipt(success) {
  const html = generateReceiptHTML(success);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  // Open in new tab and trigger print-to-PDF
  const win = window.open(url, "_blank");
  if (win) {
    win.onload = () => {
      win.print();
      URL.revokeObjectURL(url);
    };
  }
}

export function SuccessModal({ success, onClose }) {
  useEffect(() => {
    if (success) {
      // Auto-trigger receipt download after short delay
      const timer = setTimeout(() => downloadReceipt(success), 600);
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (!success) return null;

  const orderNum = Math.floor(Math.random() * 9000) + 1000;
  const now = new Date();
  const time = now.toLocaleTimeString("en-PK", { hour:"2-digit", minute:"2-digit", hour12:true });
  const date = now.toLocaleDateString("en-PK", { day:"2-digit", month:"short", year:"numeric" });

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth:"340px", padding:"28px 24px" }}>

        {/* Check icon */}
        <div className="modal-check">✓</div>

        {/* Receipt-style content */}
        <div style={{ fontFamily:"'Courier New', monospace", textAlign:"center", marginBottom:"6px" }}>
          <div style={{ fontSize:"18px", fontWeight:900, letterSpacing:"3px", color:"#2C1810" }}>⬡ POS</div>
          <div style={{ fontSize:"10px", color:"#888", letterSpacing:"1px" }}>ORDER TERMINAL</div>
        </div>

        {/* Dashed divider */}
        <div style={{ borderTop:"1px dashed #ccc", margin:"10px 0" }} />

        <div style={{ fontFamily:"'Courier New', monospace", fontSize:"11px", color:"#555", textAlign:"left", marginBottom:"4px" }}>
          <div>Date: {date}</div>
          <div>Time: {time}</div>
          <div>Order #: {orderNum}</div>
        </div>

        <div style={{ borderTop:"1px dashed #ccc", margin:"10px 0" }} />

        {/* Items */}
        <div style={{ fontFamily:"'Courier New', monospace", width:"100%" }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:"11px", color:"#888", marginBottom:"6px", textTransform:"uppercase", letterSpacing:"1px" }}>
            <span>Description</span><span>Amount</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:"12px", color:"#333", padding:"2px 0" }}>
            <span>{success.items} item{success.items !== 1 ? "s" : ""}</span>
            <span>{fmt(success.total)}</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:"12px", color:"#333", padding:"2px 0" }}>
            <span>Payment</span>
            <span>{success.method.toUpperCase()}</span>
          </div>
        </div>

        <div style={{ borderTop:"2px solid #2C1810", margin:"10px 0 6px" }} />

        {/* Total */}
        <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"'Courier New', monospace", fontWeight:900, fontSize:"17px", color:"#2C1810" }}>
          <span>TOTAL</span>
          <span style={{ color:"#B71C1C" }}>{fmt(success.total)}</span>
        </div>

        <div style={{ borderTop:"1px dashed #ccc", margin:"10px 0" }} />

        {/* PAID stamp */}
        <div style={{ textAlign:"center", marginBottom:"8px" }}>
          <span style={{ fontFamily:"'Courier New', monospace", border:"2px solid #16a34a", color:"#16a34a", padding:"3px 16px", fontSize:"13px", fontWeight:700, letterSpacing:"4px" }}>
            PAID
          </span>
        </div>

        <div style={{ borderTop:"1px dashed #ccc", margin:"10px 0" }} />

        <div style={{ fontFamily:"'Courier New', monospace", fontSize:"10px", color:"#aaa", textAlign:"center", marginBottom:"14px" }}>
          <div>Thank you for your order!</div>
          <div>*** Customer Copy ***</div>
        </div>

        {/* Buttons */}
        <div style={{ display:"flex", gap:"8px" }}>
          <button
            style={{ flex:1, padding:"10px", background:"#FFF3E0", border:"2px solid #F4A300", borderRadius:"9px", fontFamily:"Nunito,sans-serif", fontWeight:800, fontSize:"13px", color:"#F4A300", cursor:"pointer" }}
            onClick={() => downloadReceipt(success)}
          >
            🖨 Print
          </button>
          <button className="modal-btn" style={{ flex:2 }} onClick={onClose}>
            New Order →
          </button>
        </div>
      </div>
    </div>
  );
}