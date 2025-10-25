import api from './api'; 

// ============================================
// VEHICLE MODELS
// ============================================

/**
 * Get all Vehicle Models
 * @param {object} params - Optional query parameters (sorting, filtering, pagination)
 */
export const getAllVehicleModels = (params = {}) => {
    console.log("📡 API Call: GET /api/vehicle-models");
    return api.get('/vehicle-models', { params });
};

/**
 * Get Vehicle Model by ID
 * @param {string} id - Model ID
 */
export const getVehicleModelById = (id) => {
    console.log(`📡 API Call: GET /api/vehicle-models/${id}`);
    return api.get(`/vehicle-models/${id}`);
};

/**
 * CREATE Vehicle Model 
 * @param {object} modelData - { name: string, description: string, imageUrl?: string, imagePublicId?: string }
 */
export const createVehicleModel = (modelData) => {
    console.log("📡 API Call: POST /api/vehicle-models");
    console.log("📤 Sending data:", modelData);
    return api.post('/vehicle-models', modelData);
};

/**
 * UPDATE Vehicle Model
 * @param {string} id - Model ID
 * @param {object} modelData - Dữ liệu cập nhật
 */
export const updateVehicleModel = (id, modelData) => {
    console.log(`📡 API Call: PUT /api/vehicle-models/${id}`);
    console.log("📤 Sending update data:", modelData);
    return api.put(`/vehicle-models/${id}`, modelData);
};

/**
 * DELETE Vehicle Model
 * @param {string} id - Model ID
 */
export const deleteVehicleModel = (id) => {
    console.log(`📡 API Call: DELETE /api/vehicle-models/${id}`);
    return api.delete(`/vehicle-models/${id}`);
};

/**
 * Upload IMAGE for Vehicle Model
 * @param {string} modelId - Model ID
 * @param {File} imageFile - File ảnh cần upload
 */
export const uploadVehicleModelImage = (modelId, imageFile) => {
    console.log(`📡 API Call: POST /api/vehicle-models/${modelId}/upload-image`); 
    const formData = new FormData();
    formData.append('imageFile', imageFile); 

    return api.post(`/vehicle-models/${modelId}/upload-image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

/**
 * DELETE Vehicle Model's IMAGE
 * @param {string} modelId - Model ID (Theo lưu ý mới của bạn)
 */
export const deleteVehicleModelImage = (modelId) => {
    console.log(`📡 API Call: DELETE /api/vehicle-models/${modelId}/delete-image`); // Endpoint có thể khác
    // API này có thể cần gửi imagePublicId trong body hoặc không, tùy backend
    return api.delete(`/vehicle-models/${modelId}/delete-image`);
};

// ============================================
// VEHICLE VARIANTS
// ============================================

/**
 * GET ALL Vehicle Variants
 * @param {object} params - Optional query parameters
 */
export const getAllVehicleVariants = (params = {}) => {
    console.log("📡 API Call: GET /api/vehicle-variants");
    return api.get('/vehicle-variants', { params });
};

/**
 * GET Vehicle Variant BY ID
 * @param {string} id - Variant ID
 */
export const getVehicleVariantById = (id) => {
    console.log(`📡 API Call: GET /api/vehicle-variants/${id}`);
    return api.get(`/vehicle-variants/${id}`);
};

/**
 * CREATE Vehicle Variant 
 * @param {object} variantData - Dữ liệu variant (modelId, name, basePrice, specs, features)
 */
export const createVehicleVariant = (variantData) => {
    console.log("📡 API Call: POST /api/vehicle-variants");
    console.log("📤 Sending data:", variantData);
    return api.post('/vehicle-variants', variantData);
};

/**
 * UPDATE Vehicle Variant
 * @param {string} id - Variant ID
 * @param {object} variantData - Dữ liệu cập nhật
 */
export const updateVehicleVariant = (id, variantData) => {
    console.log(`📡 API Call: PUT /api/vehicle-variants/${id}`);
    console.log("📤 Sending update data:", variantData);
    return api.put(`/vehicle-variants/${id}`, variantData);
};

/**
 * DELETE Vehicle Variant
 * @param {string} id - Variant ID
 */
export const deleteVehicleVariant = (id) => {
    console.log(`📡 API Call: DELETE /api/vehicle-variants/${id}`);
    return api.delete(`/vehicle-variants/${id}`);
};

// ============================================
// VEHICLES (Inventory Stock)
// ============================================

/**
 * GET ALL VEHICLES IN INVENTORY (Vehicles)
 * @param {object} params - Optional query parameters
 */
export const getAllVehicles = (params = {}) => {
    console.log("📡 API Call: GET /api/vehicles");
    return api.get('/vehicles', { params });
};

/**
 * GET VEHICLE BY ID
 * @param {string} id - Vehicle ID
 */
export const getVehicleById = (id) => {
    console.log(`📡 API Call: GET /api/vehicles/${id}`);
    return api.get(`/vehicles/${id}`);
};

/**
 * CREATE VEHICLE
 * @param {object} vehicleData - { variantId, dealerId, color, vin, type, status }
 */
export const createVehicle = (vehicleData) => {
    console.log("📡 API Call: POST /api/vehicles");
    console.log("📤 Sending data:", vehicleData);
    return api.post('/vehicles', vehicleData);
};

/**
 * UPDATE VEHICLE
 * @param {string} id - Vehicle ID
 * @param {object} vehicleData - Dữ liệu cập nhật
 */
export const updateVehicle = (id, vehicleData) => {
    console.log(`📡 API Call: PUT /api/vehicles/${id}`);
    console.log("📤 Sending update data:", vehicleData);
    return api.put(`/vehicles/${id}`, vehicleData);
};

/**
 * DELETE VEHICLE
 * @param {string} id - Vehicle ID
 */
export const deleteVehicle = (id) => {
    console.log(`📡 API Call: DELETE /api/vehicles/${id}`);
    return api.delete(`/vehicles/${id}`);
};