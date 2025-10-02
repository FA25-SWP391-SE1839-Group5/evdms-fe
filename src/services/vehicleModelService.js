import api from "./api";

// ============================================
// VEHICLE MODEL CRUD
// ============================================

export const getAllVehicleModels = async () => {
  try {
    const response = await api.get('/vehicle-models');
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle models:', error);
    throw error;
  }
};

export const getVehicleModelById = async (id) => {
  try {
    const response = await api.get(`/vehicle-models/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle model:', error);
    throw error;
  }
};