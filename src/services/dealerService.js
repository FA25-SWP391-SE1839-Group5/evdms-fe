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

/**
 * CREATE Dealer
 * @param {object} dealerData - Dữ liệu của Dealer mới
 * @param {string} dealerData.name - Tên Dealer (bắt buộc)
 * @param {string} dealerData.region - Khu vực (bắt buộc)
 * @param {string} dealerData.address - Địa chỉ (bắt buộc)
 * @param {string} [dealerData.email] - Email (tùy chọn)
 * @param {string} [dealerData.phone] - Số điện thoại (tùy chọn)
 * @param {string} [dealerData.contactPerson] - Người liên hệ (tùy chọn)
 * @param {string} [dealerData.taxCode] - Mã số thuế (tùy chọn)
 * @param {boolean} [dealerData.isActive] - Trạng thái hoạt động (tùy chọn, mặc định là true)
 * @returns {Promise<AxiosResponse<any>>}
 */
export const createDealer = (dealerData) => {
  console.log("📡 API Call: POST /api/dealers");
  console.log("📤 Sending data:", dealerData);
  // Đảm bảo chỉ gửi các trường API cần (name, region, address và các trường tùy chọn khác nếu có)
  const dataToSend = {
      name: dealerData.name,
      region: dealerData.region,
      address: dealerData.address,
      ...(dealerData.email && { email: dealerData.email }),
      ...(dealerData.phone && { phone: dealerData.phone }),
      ...(dealerData.contactPerson && { contactPerson: dealerData.contactPerson }),
      ...(dealerData.taxCode && { taxCode: dealerData.taxCode }),
      // Gửi isActive nếu có trong form, nếu không backend có thể tự đặt mặc định
      ...(typeof dealerData.isActive === 'boolean' && { isActive: dealerData.isActive }), 
  };
  return api.post('/dealers', dataToSend);
};