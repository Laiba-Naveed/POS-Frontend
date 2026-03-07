import { CATEGORY_META, DEFAULT_META } from "../constants/categories";

/** Returns category visual metadata, falling back to defaults */
export const getMeta = (cat) =>
  CATEGORY_META[cat] || { ...DEFAULT_META, urdu: cat };

/** Format a number as Pakistani Rupees */
export const fmt = (n) => `Rs. ${Number(n).toLocaleString()}`;

/**
 * Derives today's revenue and order count from a raw sales response.
 * Supports common date field names: createdAt, date, created_at, timestamp, saleDate
 */
export const getTodayStats = (salesData) => {
  const list = Array.isArray(salesData)
    ? salesData
    : salesData.sales || salesData.data || [];

  const todayStr = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  const todaySales = list.filter((sale) => {
    const raw =
      sale.createdAt ||
      sale.date ||
      sale.created_at ||
      sale.timestamp ||
      sale.saleDate ||
      "";
    if (!raw) return false;
    return new Date(raw).toISOString().slice(0, 10) === todayStr;
  });

  const revenue = todaySales.reduce((sum, sale) => {
    return (
      sum +
      Number(
        sale.totalAmount ?? sale.total ?? sale.amount ?? sale.grandTotal ?? 0
      )
    );
  }, 0);

  return { revenue, orders: todaySales.length };
};
