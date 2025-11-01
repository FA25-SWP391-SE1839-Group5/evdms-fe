import api from './api';

// Helper function to clean up query params
const sanitizeParams = (params = {}) => {
    const cleaned = {};
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            cleaned[key] = value;
        }
    });
    return cleaned;   
};

// ============================================
// SALES ORDERS API SERVICE
// ============================================

/**
 * Get all sales orders with optional filters, pagination, sorting
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.pageSize - Page size (default: 10)
 * @param {string} params.sortBy - Sort by field
 * @param {string} params.sortOrder - Sort order (asc/desc)
 * @param {string} params.search - Search term
 * @param {string} params.filters - Filters (e.g., "status:Pending")
 */
export const getAllSalesOrders = async (params = {}) => {
    try {
        const response = await api.get('/sales-orders', {
            params: sanitizeParams(params)
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching sales orders:', error);
        throw error;
    }
};

/**
 * Get a single sales order by ID
 * @param {string} id - Sales order ID (GUID)
 */
export const getSalesOrderById = async (id) => {
    try {
        const response = await api.get(`/sales-orders/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching sales order:', error);
        throw error;
    }
};

/**
 * Create a new sales order
 * @param {Object} salesOrderData - Sales order data
 * @param {string} salesOrderData.quotationId - Quotation ID (GUID)
 * @param {string} salesOrderData.dealerId - Dealer ID (GUID)
 * @param {string} salesOrderData.userId - User ID (GUID)
 * @param {string} salesOrderData.customerId - Customer ID (GUID)
 * @param {string} salesOrderData.vehicleId - Vehicle ID (GUID)
 * @param {string} salesOrderData.date - Order date (ISO 8601)
 * @param {string} salesOrderData.status - Order status (Pending/Confirmed/Completed/Cancelled)
 */
export const createSalesOrder = async (salesOrderData) => {
    try {
        const response = await api.post('/sales-orders', salesOrderData);
        return response.data;
    } catch (error) {
        console.error('Error creating sales order:', error);
        throw error;
    }
};

/**
 * Update an existing sales order (full update)
 * @param {string} id - Sales order ID (GUID)
 * @param {Object} salesOrderData - Complete sales order data
 */
export const updateSalesOrder = async (id, salesOrderData) => {
    try {
        const response = await api.put(`/sales-orders/${id}`, salesOrderData);
        return response.data;
    } catch (error) {
        console.error('Error updating sales order:', error);
        throw error;
    }
};

/**
 * Partially update a sales order
 * @param {string} id - Sales order ID (GUID)
 * @param {Object} partialData - Partial sales order data to update
 */
export const patchSalesOrder = async (id, partialData) => {
    try {
        const response = await api.patch(`/sales-orders/${id}`, partialData);
        return response.data;
    } catch (error) {
        console.error('Error patching sales order:', error);
        throw error;
    }
};

/**
 * Delete a sales order
 * @param {string} id - Sales order ID (GUID)
 */
export const deleteSalesOrder = async (id) => {
    try {
        const response = await api.delete(`/sales-orders/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting sales order:', error);
        throw error;
    }
};

/**
 * Get summary information for a sales order by ID
 * @param {string} id - Sales order ID (GUID)
 */
export const getSalesOrdersSummary = async (id) => {
    try {
        const response = await api.get(`/sales-orders/${id}/summary`);
        return response.data;
    } catch (error) {
        console.error('Error fetching sales order summary:', error);
        throw error;
    }
};

/**
 * Create a payment record
 * @param {Object} paymentData - { salesOrderId, amount, method }
 */
export const createPayment = async (paymentData) => {
    try {
        const response = await api.post('/payments', paymentData);
        return response.data;
    } catch (error) {
        console.error('Error creating payment:', error);
        throw error;
    }
};

/**
 * Deliver a sales order by ID
 * @param {string} id - Sales order ID (GUID)
 * @param {Object} [payload] - Optional delivery payload data
 */
export const deliverSalesOrders = async (id, payload = {}) => {
    try {
        const response = await api.post(`/sales-orders/${id}/deliver`, payload);
        return response.data;
    } catch (error) {
        console.error('Error delivering sales order:', error);
        throw error;
    }
};
