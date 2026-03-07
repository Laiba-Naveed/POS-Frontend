const API_BASE = "http://192.168.18.27:5000/api";

export const api = {
  getAllProducts: async () => {
    const res = await fetch(`${API_BASE}/products`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch products");
    return data;
  },

  getProduct: async (barcode) => {
    const res = await fetch(`${API_BASE}/products/${barcode}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Product not found");
    return data;
  },

  addProduct: async (payload) => {
    const res = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to add product");
    return data;
  },

  createSale: async (items, paymentMethod) => {
  const res = await fetch(`${API_BASE}/orders/checkout`, {  // Correct endpoint
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, payMethod: paymentMethod }), // send expected fields
  });

  // Check if response is OK before parsing JSON
  if (!res.ok) {
    const text = await res.text();  // read HTML or error message
    throw new Error(text || "Sale failed");
  }

  const data = await res.json(); // safe to parse JSON now
  return data;
},

  getAllSales: async () => {
    const res = await fetch(`${API_BASE}/sales`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch sales");
    return data;
  },
};
