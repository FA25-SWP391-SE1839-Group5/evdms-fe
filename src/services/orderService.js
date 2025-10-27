import api from "./api";

// ============================================
// API CALLS - SALES ORDERS
// ============================================

/**
 * Get All Sales Orders
 * @param {object} params - Optional query parameters (filters, pagination)
 */
export const getAllSalesOrders = (params = {}) => {
    console.log("📡 API Call: GET /api/sales-orders");
    // Giả định API trả về { data: { items: [...] } }
    return api.get('/sales-orders', { params });
};