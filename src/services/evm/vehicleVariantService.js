import api from "./api";

// ============================================
// VEHICLE VARIANT CRUD
// ============================================

/**
 * Get all vehicle variants with pagination
 * @param {Object} params - Query parameters { page, pageSize, sortBy, sortOrder, search, filters }
 * @returns {Promise<Object>} { items, totalResults, page, pageSize }
 */
export const getAllVehicleVariants = async (params = {}) => {
  try {
    const response = await api.get('/vehicle-variants', { params });
    // Handle different response structures
    const data = response.data?.data || response.data;
    return {
      items: data.items || [],
      totalResults: data.totalResults || 0,
      page: data.page || params.page || 1,
      pageSize: data.pageSize || params.pageSize || 10
    };
  } catch (error) {
    console.error('Error fetching vehicle variants:', error);
    throw error;
  }
};

/**
 * Get single vehicle variant by ID
 * @param {string} id - Variant ID
 * @returns {Promise<Object>} Variant details
 */
export const getVehicleVariantById = async (id) => {
  try {
    const response = await api.get(`/vehicle-variants/${id}`);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error fetching vehicle variant:', error);
    throw error;
  }
};

/**
 * Get variants by model ID
 * @param {string} modelId - Model ID
 * @returns {Promise<Array>} Array of variants
 */
export const getVariantsByModelId = async (modelId) => {
  try {
    const response = await api.get(`/vehicle-variants/model/${modelId}`);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error fetching variants by model:', error);
    throw error;
  }
};

/**
 * Create new vehicle variant
 * @param {Object} variantData - { modelId, name, basePrice, specs?, features? }
 * @returns {Promise<Object>} Created variant
 */
export const createVehicleVariant = async (variantData) => {
  try {
    const response = await api.post('/vehicle-variants', variantData);
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error creating vehicle variant:', error);
    throw error;
  }
};

/**
 * Update vehicle variant (full replacement)
 * @param {string} id - Variant ID
 * @param {Object} variantData - Complete variant data
 * @returns {Promise<Object>} Updated variant
 */
export const updateVehicleVariant = async (id, variantData) => {
  try {
    const response = await api.put(`/vehicle-variants/${id}`, variantData);
    return response.data?.data || response.data;
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

// ============================================
// VALIDATION
// ============================================

export const validateVariantData = (data) => {
  const errors = {};

  if (!data.vehicleModelId) {
    errors.vehicleModelId = 'Vehicle model is required';
  }

  if (!data.variantName || data.variantName.trim() === '') {
    errors.variantName = 'Variant name is required';
  }

  if (!data.price || data.price <= 0) {
    errors.price = 'Price must be greater than 0';
  }

  if (!data.range || data.range <= 0) {
    errors.range = 'Range must be greater than 0';
  }

  if (!data.accelerationTime || data.accelerationTime <= 0) {
    errors.accelerationTime = 'Acceleration time must be greater than 0';
  }

  if (!data.topSpeed || data.topSpeed <= 0) {
    errors.topSpeed = 'Top speed must be greater than 0';
  }

  if (!data.motorPower || data.motorPower <= 0) {
    errors.motorPower = 'Motor power must be greater than 0';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};