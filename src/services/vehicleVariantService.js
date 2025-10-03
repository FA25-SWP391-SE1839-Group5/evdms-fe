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
