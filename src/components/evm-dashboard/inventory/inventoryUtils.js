// inventoryUtils.js
// Utility functions for inventory management

export const getStockStatus = (quantity) => {
  if (quantity === 0) return { label: "Out of Stock", color: "danger" };
  if (quantity <= 5) return { label: "Low Stock", color: "warning" };
  if (quantity <= 20) return { label: "In Stock", color: "info" };
  return { label: "Well Stocked", color: "success" };
};

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
