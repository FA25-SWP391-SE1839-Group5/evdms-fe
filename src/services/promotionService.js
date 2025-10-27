import api from "./api";

// ============================================
// API CALLS - PROMOTIONS
// ============================================

/**
 * Get All Promotions
 * @param {object} params - Optional query parameters
 */
export const getAllPromotions = (params = {}) => {
    console.log("📡 API Call: GET /api/promotions");
    return api.get('/promotions', { params });
};

/**
 * Get Promotion by ID
 * @param {string|number} id
 */
export const getPromotionById = (id) => {
    console.log(`📡 API Call: GET /api/promotions/${id}`);
    return api.get(`/promotions/${id}`);
};