const API_BASE = "https://fortunate-robby-lalallalalaalaallaalla-cfde15bf.koyeb.app/api";

const getToken = () => localStorage.getItem("pos_token");

export const api = {
  getAllProducts: async () => {
    const res = await fetch(`${API_BASE}/products`, {
      headers: { "Authorization": `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch products");
    return data;
  },

  getProduct: async (barcode) => {
    const res = await fetch(`${API_BASE}/products/${barcode}`, {
      headers: { "Authorization": `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Product not found");
    return data;
  },

  addProduct: async (payload) => {
    const res = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to add product");
    return data;
  },

  createSale: async (items, paymentMethod) => {
    const cartItems = items.map((item) => ({
      productId: item._id,
      quantity: item.qty,
    }));

    const res = await fetch(`${API_BASE}/orders/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ cartItems }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Sale failed");
    }

    const data = await res.json();
    return data;
  },

  // Returns: { date, totalOrders, totalRevenue, orders: [...] }
  getAllSales: async () => {
    const res = await fetch(`${API_BASE}/orders/sales`, {
      headers: { "Authorization": `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch sales");
    return data;
  },

  getEmployees: async () => {
    const res = await fetch(`${API_BASE}/auth/users`, {
      headers: { "Authorization": `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch employees");
    return data;
  },

  createUser: async (payload) => {
    const res = await fetch(`${API_BASE}/auth/add-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      },
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role: payload.role || "employee",
        branchId: JSON.parse(localStorage.getItem("pos_user"))?.branchId || null,
        isActive: true,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create employee");
    return data;
  },
};