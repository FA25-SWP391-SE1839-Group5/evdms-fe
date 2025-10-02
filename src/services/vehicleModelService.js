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

export const createVehicleModel = async (modelData) => {
  try {
    const response = await api.post('/vehicle-models', modelData);
    return response.data;
  } catch (error) {
    console.error('Error creating vehicle model:', error);
    throw error;
  }
};

export const updateVehicleModel = async (id, modelData) => {
  try {
    const response = await api.put(`/vehicle-models/${id}`, modelData);
    return response.data;
  } catch (error) {
    console.error('Error updating vehicle model:', error);
    throw error;
  }
};

export const deleteVehicleModel = async (id) => {
  try {
    const response = await api.delete(`/vehicle-models/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting vehicle model:', error);
    throw error;
  }
};

// ============================================
// IMAGE UPLOAD
// ============================================

export const uploadVehicleImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/vehicle-models/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Response structure: { success: true, imageUrl: "...", message: "..." }
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// ============================================
// VALIDATION
// ============================================

export const validateImageFile = (file) => {
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!file) {
    return 'No file selected';
  }

  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.split('.').pop();

  if (!allowedExtensions.includes(fileExtension)) {
    return `Only ${allowedExtensions.join(', ')} files are allowed`;
  }

  if (file.size > maxSize) {
    return 'File size must be less than 5MB';
  }

  return null; // Valid
};