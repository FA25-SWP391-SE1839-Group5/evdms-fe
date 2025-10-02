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