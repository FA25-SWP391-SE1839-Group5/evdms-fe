import api from './api'; 

// ============================================
// VEHICLE MODELS
// ============================================

/**
 * Lấy tất cả Vehicle Models
 * @param {object} params - Optional query parameters (sorting, filtering, pagination)
 */
export const getAllVehicleModels = (params = {}) => {
    console.log("📡 API Call: GET /api/vehicle-models");
    return api.get('/vehicle-models', { params });
};