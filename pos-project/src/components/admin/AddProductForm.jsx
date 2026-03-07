import React, { useState } from "react";
import { api } from "../../api";
import { CATEGORIES_LIST, PRODUCTS_BY_CAT } from "../../constants/categories";

const EMPTY_FORM = { barcode: "", name: "", price: "", stock: "", category: "" };

export function AddProductForm({ showToast }) {
  const [form, setForm]           = useState(EMPTY_FORM);
  const [loading, setLoading]     = useState(false);
  const [lastAdded, setLastAdded] = useState(null);
  const [showCatDrop, setCatDrop] = useState(false);
  const [showNameDrop, setNameDrop] = useState(false);

  const suggested = form.category ? PRODUCTS_BY_CAT[form.category] || [] : [];
  const filtCats  = CATEGORIES_LIST.filter((c) =>
    c.toLowerCase().includes(form.category.toLowerCase())
  );
  const filtNames = suggested.filter((n) =>
    n.toLowerCase().includes(form.name.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: value,
      ...(name === "category" ? { name: "" } : {}),
    }));
  };

  const handleSubmit = async () => {
    const { barcode, name, price, stock, category } = form;
    if (!barcode.trim() || !name.trim() || !category.trim() || price === "" || stock === "") {
      showToast("All fields are required", "warning");
      return;
    }
    setLoading(true);
    try {
      const data = await api.addProduct({
        barcode: barcode.trim(),
        name: name.trim(),
        price: Number(price),
        stock: Number(stock),
        category: category.trim(),
      });
      setLastAdded(data.product || form);
      showToast(`"${name}" added!`, "success");
      setForm(EMPTY_FORM);
    } catch (e) {
      showToast(e.message || "Failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="apf-wrap"
      onClick={() => { setCatDrop(false); setNameDrop(false); }}
    >
      <div className="apf-card" onClick={(e) => e.stopPropagation()}>
        <div className="apf-head">
          <div className="apf-title">
            <span className="apf-dot" />
            ADD NEW PRODUCT
          </div>
          <p className="apf-sub">
            Fill in the details below to add a product to the database.
          </p>
        </div>

        <div className="apf-fields">
          {/* Barcode */}
          <div className="apf-group">
            <label className="apf-label">Barcode</label>
            <input
              className="apf-input"
              name="barcode"
              value={form.barcode}
              onChange={handleChange}
              placeholder="e.g. 12345"
              disabled={loading}
            />
            <span className="apf-hint">Must be unique</span>
          </div>

          {/* Category dropdown */}
          <div className="apf-group">
            <label className="apf-label">Category</label>
            <div className="apf-dw">
              <div className="apf-ir">
                <input
                  className="apf-input"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  onFocus={() => setCatDrop(true)}
                  placeholder="Type or select…"
                  disabled={loading}
                  autoComplete="off"
                />
                <button
                  className="apf-arrow"
                  onClick={() => setCatDrop((v) => !v)}
                  type="button"
                >
                  {showCatDrop ? "▲" : "▼"}
                </button>
              </div>
              {showCatDrop && filtCats.length > 0 && (
                <div className="apf-drop">
                  {filtCats.map((cat) => (
                    <div
                      key={cat}
                      className={`apf-di ${form.category === cat ? "apf-di-active" : ""}`}
                      onClick={() => {
                        setForm((p) => ({ ...p, category: cat, name: "" }));
                        setCatDrop(false);
                      }}
                    >
                      🏷 {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product name dropdown */}
          <div className="apf-group">
            <label className="apf-label">Product Name</label>
            <div className="apf-dw">
              <div className="apf-ir">
                <input
                  className="apf-input"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => setNameDrop(true)}
                  placeholder={
                    form.category
                      ? `Type ${form.category} product…`
                      : "Select category first…"
                  }
                  disabled={loading}
                  autoComplete="off"
                />
                {suggested.length > 0 && (
                  <button
                    className="apf-arrow"
                    onClick={() => setNameDrop((v) => !v)}
                    type="button"
                  >
                    {showNameDrop ? "▲" : "▼"}
                  </button>
                )}
              </div>
              {showNameDrop && filtNames.length > 0 && (
                <div className="apf-drop">
                  {filtNames.map((name) => (
                    <div
                      key={name}
                      className={`apf-di ${form.name === name ? "apf-di-active" : ""}`}
                      onClick={() => {
                        setForm((p) => ({ ...p, name }));
                        setNameDrop(false);
                      }}
                    >
                      🍽 {name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Price & Stock */}
          <div style={{ display: "flex", gap: 14 }}>
            <div className="apf-group" style={{ flex: 1 }}>
              <label className="apf-label">Price (PKR)</label>
              <input
                className="apf-input"
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0"
                disabled={loading}
              />
            </div>
            <div className="apf-group" style={{ flex: 1 }}>
              <label className="apf-label">Stock</label>
              <input
                className="apf-input"
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="0"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Live Preview */}
        {(form.barcode || form.name || form.price || form.stock || form.category) && (
          <div className="apf-preview">
            <div className="apf-prev-label">
              <span className="apf-prev-dot" />
              LIVE PREVIEW
            </div>
            <div className="apf-prev-grid">
              {[
                ["Barcode", form.barcode || "—"],
                ["Name", form.name || "—"],
                ["Price", form.price ? `Rs.${form.price}` : "—"],
                ["Stock", (form.stock || "0") + " units"],
              ].map(([k, v]) => (
                <div key={k} className="apf-prev-item">
                  <span className="apf-prev-key">{k}</span>
                  <span className={`apf-prev-val ${k === "Price" ? "apf-prev-red" : ""}`}>
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="apf-submit" onClick={handleSubmit} disabled={loading}>
          {loading ? <span className="spinner" /> : "＋ Add Product to Database"}
        </button>
      </div>

      {lastAdded && (
        <div className="apf-success">
          <div className="apf-suc-row">
            <span className="apf-suc-icon">✓</span>
            <div>
              <div className="apf-suc-title">Product Added Successfully</div>
              <div className="apf-suc-sub">
                Now visible in POS under {lastAdded.category}
              </div>
            </div>
          </div>
          <button className="apf-dismiss" onClick={() => setLastAdded(null)}>
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
