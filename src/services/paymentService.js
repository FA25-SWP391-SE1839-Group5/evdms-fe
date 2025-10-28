import api from './api';

// Helper function
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
// PAYMENTS API SERVICE
// ============================================

export const getAllPayments = async (params = {}) => {
  try {
    const response = await api.get('/payments', {
      params: sanitizeParams(params)
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

export const getPaymentById = async (id) => {
  try {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment:', error);
    throw error;
  }
};

export const createPayment = async (paymentData) => {
  // API body: { salesOrderId, amount, method, status? }
  try {
    const response = await api.post('/payments', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

export const updatePayment = async (id, paymentData) => {
  try {
    const response = await api.put(`/payments/${id}`, paymentData);
    return response.data;
  } catch (error) {
    console.error('Error updating payment:', error);
    throw error;
  }
};

export const patchPayment = async (id, paymentData) => {
  try {
    const response = await api.patch(`/payments/${id}`, paymentData);
    return response.data;
  } catch (error) {
    console.error('Error partially updating payment:', error);
    throw error;
  }
};

export const deletePayment = async (id) => {
  try {
    const response = await api.delete(`/payments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting payment:', error);
    throw error;
  }
};