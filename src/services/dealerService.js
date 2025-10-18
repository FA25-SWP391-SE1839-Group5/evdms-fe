import api from "./api";

// ============================================
// API CALLS - DEALERS
// ============================================

/**
 * Get All Dealers
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getAllDealers = async () => {
    console.log("📡 API Call: GET /api/dealers");
    return api.get('/dealers');
};