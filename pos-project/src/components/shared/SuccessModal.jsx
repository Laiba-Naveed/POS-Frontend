import React from "react";
import { fmt } from "../../utils/helpers";

const TAX_RATE = 0.05;

export function SuccessModal({ success, onClose }) {
  if (!success) return null;

  const now = new Date();
  const time = now.toLocaleTimeString("en-PK", { hour:"2-digit", minute:"2-digit", hour12:true });
  const date = now.toLocaleDateString("en-PK", { day:"2-digit", month:"short", year:"numeric" });
  const orderNum = String(Math.floor(Math.random() * 9000) + 1000);

  const cartItems = success.cartItems || [];
  const subtotal  = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const tax       = Math.round(subtotal * TAX_RATE);
  const grandTotal = subtotal + tax;

  const handlePrint = () => {
    const itemRows = cartItems.map(item => `
      <div class="row">
        <span>${item.name} x${item.qty}</span>
        <span>${fmt(item.price * item.qty)}</span>
      </div>
      <div class="row-sub">${fmt(item.price)} each</div>
    `).join("");

    const html = `
      <!DOCTYPE html><html><head><meta charset="utf-8"/>
      <title>Receipt #${orderNum}</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Courier New',monospace; padding:24px; display:flex; justify-content:center; }
        .receipt { width:280px; }
        .center { text-align:center; }
        .logo { font-size:20px; font-weight:900; letter-spacing:4px; }
        .tagline { font-size:10px; color:#666; margin-top:2px; }
        hr { border:none; border-top:1px dashed #aaa; margin:10px 0; }
        .meta { font-size:11px; color:#444; line-height:1.8; }
        .section { font-size:10px; text-transform:uppercase; letter-spacing:2px; color:#999; text-align:center; margin:8px 0 4px; }
        .col-head { display:flex; justify-content:space-between; font-size:10px; color:#999; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px; }
        .row { display:flex; justify-content:space-between; font-size:12px; color:#222; padding:2px 0; }
        .row-sub { font-size:10px; color:#999; padding-bottom:4px; }
        .sum-row { display:flex; justify-content:space-between; font-size:12px; color:#444; padding:2px 0; }
        .total-row { display:flex; justify-content:space-between; font-size:16px; font-weight:900; border-top:2px solid #111; padding:8px 0 4px; margin-top:4px; }
        .paid-wrap { text-align:center; margin:8px 0; }
        .paid { border:2px solid #16a34a; color:#16a34a; padding:3px 16px; font-size:13px; font-weight:700; letter-spacing:4px; display:inline-block; }
        .barcode { text-align:center; font-size:24px; letter-spacing:3px; margin:8px 0 2px; }
        .order-num { text-align:center; font-size:10px; color:#888; }
        .footer { text-align:center; margin-top:12px; font-size:11px; color:#666; line-height:1.8; }
      </style>
      </head><body><div class="receipt">
        <div class="center">
          <div class="logo">⬡ POS</div>
          <div class="tagline">Order Terminal</div>
        </div>
        <hr/>
        <div class="meta">
          <div>Date: ${date}</div>
          <div>Time: ${time}</div>
          <div>Order #: ${orderNum}</div>
          <div>Payment: ${success.method.toUpperCase()}</div>
        </div>
        <hr/>
        <div class="section">— Items Ordered —</div>
        <div class="col-head"><span>Item</span><span>Amount</span></div>
        ${itemRows}
        <hr/>
        <div class="sum-row"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
        <div class="sum-row"><span>Tax (5%)</span><span>${fmt(tax)}</span></div>
        <div class="total-row"><span>TOTAL</span><span>${fmt(grandTotal)}</span></div>
        <hr/>
        <div class="paid-wrap"><span class="paid">PAID</span></div>
        <div class="barcode">||| || ||| || |||</div>
        <div class="order-num">#${orderNum}</div>
        <hr/>
        <div class="footer">
          <div>Thank you for your order!</div>
          <div>Please visit us again.</div>
          <div style="font-size:10px;color:#aaa;margin-top:4px;">*** Customer Copy ***</div>
        </div>
      </div></body></html>
    `;

    const w = window.open("", "", "width=420,height=700");
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); w.close(); }, 400);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth:"360px", padding:"22px 20px", fontFamily:"'Courier New',monospace", overflowY:"auto", maxHeight:"90vh" }}>

        {/* Green check */}
        <div className="modal-check">✓</div>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:"8px" }}>
          <div style={{ fontSize:"18px", fontWeight:900, letterSpacing:"4px", color:"#2C1810" }}>⬡ POS</div>
          <div style={{ fontSize:"10px", color:"#888", letterSpacing:"2px" }}>ORDER TERMINAL</div>
        </div>

        <hr style={{ border:"none", borderTop:"1px dashed #bbb", margin:"10px 0" }} />

        {/* Meta */}
        <div style={{ fontSize:"11px", color:"#555", lineHeight:"1.8" }}>
          <div>Date: {date}</div>
          <div>Time: {time}</div>
          <div>Order #: {orderNum}</div>
          <div>Payment: {success.method.toUpperCase()}</div>
        </div>

        <hr style={{ border:"none", borderTop:"1px dashed #bbb", margin:"10px 0" }} />

        {/* Items header */}
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:"10px", color:"#999", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"6px" }}>
          <span>Item</span><span>Amount</span>
        </div>

        {/* Item rows */}
        {cartItems.map((item, i) => (
          <div key={i}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:"12px", color:"#222", padding:"2px 0" }}>
              <span>{item.name} ×{item.qty}</span>
              <span>{fmt(item.price * item.qty)}</span>
            </div>
            <div style={{ fontSize:"10px", color:"#aaa", paddingBottom:"3px" }}>
              {fmt(item.price)} each
            </div>
          </div>
        ))}

        <hr style={{ border:"none", borderTop:"1px dashed #bbb", margin:"10px 0" }} />

        {/* Subtotal + Tax */}
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:"12px", color:"#555", padding:"2px 0" }}>
          <span>Subtotal</span><span>{fmt(subtotal)}</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:"12px", color:"#555", padding:"2px 0" }}>
          <span>Tax (5%)</span><span>{fmt(tax)}</span>
        </div>

        {/* Grand Total */}
        <div style={{ borderTop:"2px solid #2C1810", margin:"8px 0 4px" }} />
        <div style={{ display:"flex", justifyContent:"space-between", fontWeight:900, fontSize:"17px", color:"#2C1810" }}>
          <span>TOTAL</span>
          <span style={{ color:"#B71C1C" }}>{fmt(grandTotal)}</span>
        </div>

        <hr style={{ border:"none", borderTop:"1px dashed #bbb", margin:"10px 0" }} />

        {/* PAID stamp */}
        <div style={{ textAlign:"center", margin:"4px 0 8px" }}>
          <span style={{ border:"2px solid #16a34a", color:"#16a34a", padding:"3px 16px", fontSize:"13px", fontWeight:700, letterSpacing:"4px" }}>
            PAID
          </span>
        </div>

        <hr style={{ border:"none", borderTop:"1px dashed #bbb", margin:"10px 0" }} />

        {/* Footer */}
        <div style={{ textAlign:"center", fontSize:"10px", color:"#aaa", lineHeight:"1.8", marginBottom:"14px" }}>
          <div>Thank you for your order!</div>
          <div>*** Customer Copy ***</div>
        </div>

        {/* Buttons */}
        <div style={{ display:"flex", gap:"8px" }}>
          <button
            onClick={handlePrint}
            style={{ flex:1, padding:"11px", background:"#FFF3E0", border:"2px solid #F4A300", borderRadius:"9px", fontFamily:"Nunito,sans-serif", fontWeight:800, fontSize:"13px", color:"#c8711a", cursor:"pointer" }}
          >
            🖨 Print
          </button>
          <button
            onClick={onClose}
            style={{ flex:2, padding:"11px", background:"#16a34a", border:"none", borderRadius:"9px", fontFamily:"Nunito,sans-serif", fontWeight:900, fontSize:"14px", color:"#fff", cursor:"pointer" }}
          >
            New Order →
          </button>
        </div>
      </div>
    </div>
  );
}