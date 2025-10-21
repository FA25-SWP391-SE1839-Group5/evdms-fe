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

/**
 * UPDATE Dealer
 * @param {string|number} dealerId - ID của Dealer cần cập nhật
 * @param {object} dealerData - Dữ liệu cập nhật (chỉ chứa các trường cần thay đổi)
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateDealer = (dealerId, dealerData) => {
  console.log(`📡 API Call: PUT /api/dealers/${dealerId}`); // Hoặc PATCH nếu API hỗ trợ
  console.log("📤 Sending update data:", dealerData);
  // Gửi toàn bộ dữ liệu hoặc chỉ các trường thay đổi tùy thuộc vào API (PUT thường gửi toàn bộ)
  return api.put(`/dealers/${dealerId}`, dealerData); 
};

/**
 * DELETE Dealer
 * @param {string|number} dealerId - ID của Dealer cần xóa
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteDealer = (dealerId) => {
  console.log(`📡 API Call: DELETE /api/dealers/${dealerId}`);
  return api.delete(`/dealers/${dealerId}`);
};

// ============================================
// API CALLS - DEALER CONTRACTS (MỚI)
// ============================================

/**
 * Get All Dealer Contracts
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getAllDealerContracts = () => {
    console.log("📡 API Call: GET /api/dealer-contracts");
    return api.get('/dealer-contracts');
};

/**
 * CREATE Dealer Contract
 * @param {object} contractData - Dữ liệu của Hợp đồng mới
 * @param {string} contractData.dealerId
 * @param {string} contractData.startDate
 * @param {string} contractData.endDate
 * @param {number} contractData.salesTarget
 * @returns {Promise<AxiosResponse<any>>}
 */
export const createDealerContract = (contractData) => {
  console.log("📡 API Call: POST /api/dealer-contracts");
  console.log("📤 Sending data:", contractData);
  return api.post('/dealer-contracts', contractData);
};

/**
 * UPDATE Dealer Contract
 * @param {string|number} contractId
 * @param {object} contractData
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateDealerContract = (contractId, contractData) => {
  console.log(`📡 API Call: PUT /api/dealer-contracts/${contractId}`);
  console.log("📤 Sending update data:", contractData);
  return api.put(`/dealer-contracts/${contractId}`, contractData);
};




// ============================================
// CÁC API KHÁC LIÊN QUAN ĐẾN DEALER (nếu cần)
// Ví dụ: DealerContract, DealerOrder, DealerPayment
// Bạn có thể thêm các hàm tương tự ở đây
// ============================================

// Ví dụ cho DealerContract:
// export const getAllDealerContracts = (dealerId) => {
//   console.log(`📡 API Call: GET /api/dealer-contracts?dealerId=${dealerId}`); // Giả sử có query param
//   return api.get('/dealer-contracts', { params: { dealerId } });
// };