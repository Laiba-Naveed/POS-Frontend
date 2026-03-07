import React, { useState, useEffect } from "react";
import { api } from "../api";
import { getTodayStats } from "../utils/helpers";
import { useToast } from "../hooks/useToast";
import { useCart } from "../hooks/useCart";
import { Toast, SuccessModal } from "../components/shared";
import { POSHeader, CategoryBar, ProductGrid, CartPanel } from "../components/pos";

export function POSPage({ onGoAdmin }) {
  const [products, setProducts]         = useState([]);
  const [activeCategory, setActive]     = useState(null);
  const [loading, setLoading]           = useState(false);
  const [fetching, setFetching]         = useState(true);
  const [success, setSuccess]           = useState(null);
  const [payMethod, setPayMethod]       = useState("cash");
  const [orderNote, setOrderNote]       = useState("");
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [dailyOrders, setDailyOrders]   = useState(0);

  const { toast, showToast } = useToast();
  const {
    cart, setCart,
    cartItems, total, itemCount,
    handleAdd, handleDec,
    handleRemoveAll, clearCart,
  } = useCart(products, showToast);

  // Fetch ALL products once on mount
  useEffect(() => {
    (async () => {
      try {
        const prodData = await api.getAllProducts();
        const list = Array.isArray(prodData) ? prodData : prodData.products || [];
        setProducts(list);
      } catch (e) {
        showToast(e.message || "Could not load products", "error");
      } finally {
        setFetching(false);
      }

      try {
        const salesData = await api.getAllSales();
        const { revenue, orders } = getTodayStats(salesData);
        setDailyRevenue(revenue);
        setDailyOrders(orders);
      } catch (_) {}
    })();
  }, []);

  // No API call needed — just filter from already-loaded products
  const handleCategorySelect = (cat) => {
    setActive((prev) => (prev === cat ? null : cat));
  };

  const categoryProducts = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : [];

  const handlePay = async () => {
    if (!cartItems.length) return;
    setLoading(true);
    try {
      const orderItems = cartItems.map((i) => ({
        barcode: i.barcode,
        name: i.name,
        price: i.price,
        quantity: i.qty,
      }));
      const response = await api.createSale(orderItems, payMethod);
      const paid = response.totalAmount || total;

      setProducts((prev) =>
        prev.map((p) => {
          const item = cartItems.find((i) => i.barcode === p.barcode);
          return item ? { ...p, stock: Math.max(0, p.stock - item.qty) } : p;
        })
      );

      setSuccess({ total: paid, method: payMethod, items: itemCount });
      setOrderNote("");
      setDailyRevenue((r) => r + paid);
      setDailyOrders((o) => o + 1);
      setCart({});
    } catch (e) {
      showToast(e.message || "Payment failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pos-root">
      <POSHeader
        dailyRevenue={dailyRevenue}
        dailyOrders={dailyOrders}
        onGoAdmin={onGoAdmin}
      />

      <div className="pos-body">
        <div className="pos-left">
          <CategoryBar
            products={products}
            cart={cart}
            activeCategory={activeCategory}
            onSelect={handleCategorySelect}
            fetching={fetching}
          />
          <ProductGrid
            activeCategory={activeCategory}
            categoryProducts={categoryProducts}
            cart={cart}
            onAdd={handleAdd}
            onDec={handleDec}
          />
        </div>

        <CartPanel
          cartItems={cartItems}
          total={total}
          itemCount={itemCount}
          payMethod={payMethod}
          setPayMethod={setPayMethod}
          loading={loading}
          onClear={clearCart}
          orderNote={orderNote}
          setOrderNote={setOrderNote}
          onRemoveItem={handleRemoveAll}
          onPay={handlePay}
        />
      </div>

      <Toast toast={toast} />
      <SuccessModal success={success} onClose={() => setSuccess(null)} />
    </div>
  );
}