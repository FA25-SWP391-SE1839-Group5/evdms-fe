import api from "./api";

// Helper function (if not already in a shared utils file)
const sanitizeParams = (params = {}) => {
  const cleaned = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

// ============================================
// DEALER ORDERS API SERVICE (/api/dealer-orders)
// ============================================

/**
 * Get all dealer orders (presumably for the logged-in dealer)
 * @param {object} params - Optional query parameters (page, pageSize, search, sortBy, etc.)
 */
export const getAllDealerOrders = async (params = {}) => {
  try {
    console.log("API Call: GET /api/dealer-orders with params:", params);
    const response = await api.get("/dealer-orders", {
      params: sanitizeParams(params),
    });
    console.log("API Response:", response.data);
    // Adjust based on actual API response structure
    return response.data;
  } catch (error) {
    console.error("Error fetching dealer orders:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get a specific dealer order by ID
 * @param {string} id - The ID of the dealer order
 */
export const getDealerOrderById = async (id) => {
  try {
    console.log(`API Call: GET /api/dealer-orders/${id}`);
    const response = await api.get(`/dealer-orders/${id}`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching dealer order ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Create a new dealer order
 * @param {object} orderData - { variantId, quantity, color }
 */
export const createDealerOrder = async (orderData) => {
  try {
    console.log("API Call: POST /api/dealer-orders with data:", orderData);
    // Ensure quantity is a number
    const payload = {
      ...orderData,
      quantity: Number(orderData.quantity) || 1, // Default to 1 if invalid
    };
    const response = await api.post("/dealer-orders", payload);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating dealer order:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Patch/Update a dealer order (e.g., EVM Staff cancels)
 * NOTE: Dealer Manager might not have permission for this, but included for completeness based on description.
 * @param {string} id - The ID of the dealer order
 * @param {object} updateData - Data to update (e.g., { status: 'Canceled' })
 */
export const patchDealerOrder = async (id, updateData) => {
  try {
    console.log(`API Call: PATCH /api/dealer-orders/${id} with data:`, updateData);
    const response = await api.patch(`/dealer-orders/${id}`, updateData);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error patching dealer order ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Mark a dealer order as delivered (EVM Staff action)
 * NOTE: Dealer Manager might not have permission for this.
 * @param {string} id - The ID of the dealer order
 */
export const markDealerOrderDelivered = async (id) => {
  try {
    console.log(`API Call: POST /api/dealer-orders/${id}/deliver`);
    const response = await api.post(`/dealer-orders/${id}/deliver`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error marking dealer order ${id} delivered:`, error.response?.data || error.message);
    throw error;
  }
};

// ============================================
// DEALER PAYMENTS API SERVICE (/api/dealer-payments)
// ============================================

/**
 * Get all dealer payments (presumably related to dealer orders)
 * @param {object} params - Optional query parameters
 */
export const getAllDealerPayments = async (params = {}) => {
  try {
    console.log("API Call: GET /api/dealer-payments with params:", params);
    // Assuming the endpoint exists, adjust if needed
    const response = await api.get("/dealer-payments", {
      params: sanitizeParams(params),
    });
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching dealer payments:", error.response?.data || error.message);
    // It's possible this endpoint doesn't exist yet for GET all
    console.warn("Endpoint GET /api/dealer-payments might not exist.");
    throw error;
  }
};

/**
 * Create a dealer payment record (EVM Staff action)
 * NOTE: Dealer Manager might not have permission for this.
 * @param {object} paymentData - Data for creating payment (likely includes dealerOrderId)
 */
export const createDealerPayment = async (paymentData) => {
  try {
    console.log("API Call: POST /api/dealer-payments with data:", paymentData);
    const response = await api.post("/dealer-payments", paymentData);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating dealer payment:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Upload payment document (Dealer Manager action)
 * @param {string} paymentId - The ID of the dealer payment record
 * @param {File} file - The PDF file to upload
 */
export const uploadDealerPaymentDocument = async (paymentId, file) => {
  try {
    console.log(`API Call: POST /api/dealer-payments/${paymentId}/upload-document`);
    const formData = new FormData();
    formData.append("Document", file); // API likely expects the file under the key 'file'

    const response = await api.post(`/dealer-payments/${paymentId}/upload-document`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Important for file uploads
      },
    });
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error uploading document for payment ${paymentId}:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Mark dealer payment as paid (EVM Staff action)
 * NOTE: Dealer Manager might not have permission for this.
 * @param {string} paymentId - The ID of the dealer payment record
 */
export const markDealerPaymentPaid = async (paymentId) => {
  try {
    console.log(`API Call: POST /api/dealer-payments/${paymentId}/mark-paid`);
    const response = await api.post(`/dealer-payments/${paymentId}/mark-paid`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error marking payment ${paymentId} as paid:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Mark dealer payment as failed (EVM Staff action)
 * NOTE: Dealer Manager might not have permission for this.
 * @param {string} paymentId - The ID of the dealer payment record
 */
export const markDealerPaymentFailed = async (paymentId) => {
  try {
    console.log(`API Call: POST /api/dealer-payments/${paymentId}/mark-failed`);
    const response = await api.post(`/dealer-payments/${paymentId}/mark-failed`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error marking payment ${paymentId} as failed:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Hủy một đơn đặt hàng
 * @param {string} orderId - ID của đơn hàng cần hủy
 */
export const cancelDealerOrder = async (orderId) => {
  try {
    console.log(`📡 API Call: PATCH /api/dealer-orders/${orderId} to cancel`);
    // Tui giả định API cần một body để thay đổi status
    // ví dụ: { status: "Canceled" }
    const response = await api.patch(`/dealer-orders/${orderId}`, { status: "Canceled" });
    return response.data;
  } catch (error) {
    console.error("❌ cancelDealerOrder error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to cancel order.");
  }
};
