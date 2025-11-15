import api from './api';

const sanitizeParams = (params = {}) => {
  const cleaned = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

export const getAllQuotations = async (params = {}) => {
  try {
    const response = await api.get('/quotations', { params: sanitizeParams(params) });
    return response.data;
  } catch (error) {
    console.error('Error fetching quotations:', error);
    throw error;
  }
};

export const getQuotationById = async (id) => {
  try {
    const response = await api.get(`/quotations/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quotation:', error);
    throw error;
  }
};

export const createQuotation = async (quotationData) => {
  try {
    const response = await api.post('/quotations', quotationData);
    return response.data;
  } catch (error) {
    console.error('Error creating quotation:', error);
    throw error;
  }
};

export const updateQuotation = async (id, quotationData) => {
  try {
    const response = await api.put(`/quotations/${id}`, quotationData);
    return response.data;
  } catch (error) {
    console.error('Error updating quotation:', error);
    throw error;
  }
};

export const deleteQuotation = async (id) => {
  try {
    const response = await api.delete(`/quotations/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting quotation:', error);
    throw error;
  }
};
