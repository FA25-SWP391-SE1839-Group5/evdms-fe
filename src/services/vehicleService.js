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

