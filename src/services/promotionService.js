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

/**
 * CREATE Promotion
 * @param {object} promotionData
 * @param {string} promotionData.description
 * @param {number | null} promotionData.discountPercent - Allow null
 * @param {string} promotionData.startDate - ISO Date string
 * @param {string} promotionData.endDate - ISO Date string
 */
export const createPromotion = (promotionData) => {
    console.log("📡 API Call: POST /api/promotions");
    // Ensure discountPercent is number or null
    const dataToSend = {
        ...promotionData,
        discountPercent: promotionData.discountPercent === '' || promotionData.discountPercent === null ? null : Number(promotionData.discountPercent)
    };
    console.log("📤 Sending data:", dataToSend);
    return api.post('/promotions', dataToSend);
};

/**
 * UPDATE Promotion
 * @param {string|number} id
 * @param {object} promotionData
 */
export const updatePromotion = (id, promotionData) => {
    console.log(`📡 API Call: PUT /api/promotions/${id}`);
    const dataToSend = {
        ...promotionData,
        discountPercent: promotionData.discountPercent === '' || promotionData.discountPercent === null ? null : Number(promotionData.discountPercent)
    };
    console.log("📤 Sending update data:", dataToSend);
    return api.put(`/promotions/${id}`, dataToSend);
};

/**
 * DELETE Promotion
 * @param {string|number} id
 */
export const deletePromotion = (id) => {
    console.log(`📡 API Call: DELETE /api/promotions/${id}`);
    return api.delete(`/promotions/${id}`);
};