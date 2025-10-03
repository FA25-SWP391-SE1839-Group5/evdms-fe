import api from "./api";

// ============================================
// VEHICLE VARIANT CRUD
// ============================================

export const getAllVehicleVariants = async () => {
  try {
    const response = await api.get('/vehicle-variants');
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle variants:', error);
    throw error;
  }
};

export const getVehicleVariantById = async (id) => {
  try {
    const response = await api.get(`/vehicle-variants/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle variant:', error);
    throw error;
  }
};

export const getVariantsByModelId = async (modelId) => {
  try {
    const response = await api.get(`/vehicle-variants/model/${modelId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching variants by model:', error);
    throw error;
  }
};

export const createVehicleVariant = async (variantData) => {
  try {
    const response = await api.post('/vehicle-variants', variantData);
    return response.data;
  } catch (error) {
    console.error('Error creating vehicle variant:', error);
    throw error;
  }
};

export const updateVehicleVariant = async (id, variantData) => {
  try {
    const response = await api.put(`/vehicle-variants/${id}`, variantData);
    return response.data;
  } catch (error) {
    console.error('Error updating vehicle variant:', error);
    throw error;
  }
};

export const deleteVehicleVariant = async (id) => {
  try {
    const response = await api.delete(`/vehicle-variants/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting vehicle variant:', error);
    throw error;
  }
};