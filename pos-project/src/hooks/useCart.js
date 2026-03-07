import { useState, useCallback } from "react";

/**
 * useCart – manages cart state for the POS.
 * Cart shape: { [barcode]: qty }
 */
export function useCart(products, showToast) {
  const [cart, setCart] = useState({});

  const handleAdd = useCallback(
    (product) => {
      setCart((prev) => {
        const cur = prev[product.barcode] || 0;
        if (cur >= product.stock) {
          showToast(`Only ${product.stock} in stock`, "warning");
          return prev;
        }
        return { ...prev, [product.barcode]: cur + 1 };
      });
    },
    [showToast]
  );

  const handleDec = useCallback((barcode) => {
    setCart((prev) => {
      const cur = prev[barcode] || 0;
      if (cur <= 1) {
        const next = { ...prev };
        delete next[barcode];
        return next;
      }
      return { ...prev, [barcode]: cur - 1 };
    });
  }, []);

  const handleRemoveAll = useCallback(
    (barcode) => {
      setCart((prev) => {
        const next = { ...prev };
        delete next[barcode];
        return next;
      });
      showToast("Item removed", "warning");
    },
    [showToast]
  );

  const clearCart = useCallback(() => {
    setCart({});
    showToast("Cart cleared", "warning");
  }, [showToast]);

  /** Resolves cart entries into full product objects with qty */
  const cartItems = Object.entries(cart)
    .map(([barcode, qty]) => {
      const p = products.find((x) => x.barcode === barcode);
      return p ? { ...p, qty } : null;
    })
    .filter(Boolean);

  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const itemCount = cartItems.reduce((s, i) => s + i.qty, 0);

  return {
    cart,
    setCart,
    cartItems,
    total,
    itemCount,
    handleAdd,
    handleDec,
    handleRemoveAll,
    clearCart,
  };
}
