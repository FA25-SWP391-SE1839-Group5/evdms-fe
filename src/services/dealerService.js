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

/**
 * Get Dealer's ID
 * @param {string|number} dealerId - ID của Dealer
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getDealerById = (dealerId) => {
  console.log(`📡 API Call: GET /api/dealers/${dealerId}`);
  return api.get(`/dealers/${dealerId}`);
};