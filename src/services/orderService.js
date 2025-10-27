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

/**
 * Get Sales Order by ID
 * @param {string|number} id
 */
export const getSalesOrderById = (id) => {
    console.log(`📡 API Call: GET /api/sales-orders/${id}`);
    return api.get(`/sales-orders/${id}`);
};

/**
 * Mark Sales Order as Delivered
 * @param {string|number} id
 */
export const markOrderDelivered = (id) => {
    console.log(`📡 API Call: POST /api/sales-orders/${id}/deliver`);
    return api.post(`/sales-orders/${id}/deliver`); // Có thể không cần body
};