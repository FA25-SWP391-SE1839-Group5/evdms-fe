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

/**
 * DELETE Dealer Contract
 * @param {string|number} contractId
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteDealerContract = (contractId) => {
  console.log(`📡 API Call: DELETE /api/dealer-contracts/${contractId}`);
  return api.delete(`/dealer-contracts/${contractId}`);
};

// ============================================
// API CALLS - DEALER ORDERS 
// ============================================
/**
 * Get All Dealer Orders
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getAllDealerOrders = () => {
    console.log("📡 API Call: GET /api/dealer-orders");
    return api.get('/dealer-orders');
};

/**
 * CREATE Dealer Order
 * @param {object} orderData - Dữ liệu Order mới
 * @param {string} orderData.dealerId
 * @param {string} orderData.variantId // ID của biến thể xe
 * @param {number} orderData.quantity
 * @param {string} orderData.color
 * @param {string} orderData.status // e.g., 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
 * @returns {Promise<AxiosResponse<any>>}
 */
export const createDealerOrder = (orderData) => {
  console.log("📡 API Call: POST /api/dealer-orders");
  console.log("📤 Sending data:", orderData);
  // Ensure quantity is a number
  const dataToSend = { ...orderData, quantity: Number(orderData.quantity) || 1 };
  return api.post('/dealer-orders', dataToSend);
};

/**
 * UPDATE Dealer Order
 * @param {string|number} orderId
 * @param {object} orderData - Chỉ chứa các trường cần update
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateDealerOrder = (orderId, orderData) => {
  console.log(`📡 API Call: PUT /api/dealer-orders/${orderId}`);
  console.log("📤 Sending update data:", orderData);
  // Ensure quantity is a number if present
  const dataToSend = orderData.quantity
      ? { ...orderData, quantity: Number(orderData.quantity) }
      : orderData;
  return api.put(`/dealer-orders/${orderId}`, dataToSend);
};

/**
 * DELETE Dealer Order
 * @param {string|number} orderId
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteDealerOrder = (orderId) => {
  console.log(`📡 API Call: DELETE /api/dealer-orders/${orderId}`);
  return api.delete(`/dealer-orders/${orderId}`);
};

// ============================================
// API CALLS - VEHICLE VARIANTS 
// ============================================

/**
 * Get All Vehicle Variants
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getAllVehicleVariants = () => {
    console.log("📡 API Call: GET /api/vehicle-variants");
    // Giả định endpoint là '/vehicle-variants', hãy sửa nếu cần
    return api.get('/vehicle-variants'); 
};

// ============================================
// API CALLS - DEALER PAYMENTS
// ============================================

/**
 * Get All Dealer Payments
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getAllDealerPayments = () => {
    console.log("📡 API Call: GET /api/dealer-payments");
    return api.get('/dealer-payments');
};

/**
 * CREATE Dealer Payment
 * @param {object} paymentData
 * @param {string} paymentData.dealerId
 * @param {number} paymentData.amount
 * @param {string} paymentData.paymentMethod
 * @returns {Promise<AxiosResponse<any>>}
 */
export const createDealerPayment = (paymentData) => {
  console.log("📡 API Call: POST /api/dealer-payments");
  // Ensure amount is a number, status will likely be set by backend (default 'Pending')
  const dataToSend = { ...paymentData, amount: Number(paymentData.amount) || 0 };
  console.log("📤 Sending data:", dataToSend);
  return api.post('/dealer-payments', dataToSend);
};

/**
 * UPDATE Dealer Payment (e.g., amount, method)
 * @param {string|number} paymentId
 * @param {object} paymentData
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateDealerPayment = (paymentId, paymentData) => {
  console.log(`📡 API Call: PUT /api/dealer-payments/${paymentId}`);
   // Ensure amount is a number if present
   const dataToSend = paymentData.amount
      ? { ...paymentData, amount: Number(paymentData.amount) }
      : paymentData;
  console.log("📤 Sending update data:", dataToSend);
  return api.put(`/dealer-payments/${paymentId}`, dataToSend);
};

/**
 * DELETE Dealer Payment
 * @param {string|number} paymentId
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteDealerPayment = (paymentId) => {
  console.log(`📡 API Call: DELETE /api/dealer-payments/${paymentId}`);
  return api.delete(`/dealer-payments/${paymentId}`);
};

/**
 * Mark Dealer Payment as PAID
 * @param {string|number} paymentId
 * @returns {Promise<AxiosResponse<any>>}
 */
export const markPaymentPaid = (paymentId) => {
  console.log(`📡 API Call: POST /api/dealer-payments/${paymentId}/mark-paid`);
  // POST request typically doesn't need a body for this kind of action
  return api.post(`/dealer-payments/${paymentId}/mark-paid`);
};

/**
 * Mark Dealer Payment as FAILED
 * @param {string|number} paymentId
 * @returns {Promise<AxiosResponse<any>>}
 */
export const markPaymentFailed = (paymentId) => {
  console.log(`📡 API Call: POST /api/dealer-payments/${paymentId}/mark-failed`);
  // POST request typically doesn't need a body
  return api.post(`/dealer-payments/${paymentId}/mark-failed`);
};

/**
 * Upload document cho Dealer Payment
 * @param {string} paymentId - ID của payment
 * @param {File} documentFile - File document (PDF)
 */
export const uploadDealerPaymentDocument = (paymentId, documentFile) => {
    console.log(`📡 API Call: POST /api/dealer-payments/${paymentId}/upload-document`);
    const formData = new FormData();
    formData.append('document', documentFile); // Tên field 'document' có thể cần đổi

    return api.post(`/dealer-payments/${paymentId}/upload-document`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

/**
 * Xóa document của Dealer Payment
 * @param {string} paymentId - ID của payment
 * @param {string} documentId - ID của document cần xóa (hoặc publicId, tùy backend)
 */
export const deleteDealerPaymentDocument = (paymentId, documentId) => { // Cần làm rõ cách xác định document cần xóa
     console.log(`📡 API Call: DELETE /api/dealer-payments/${paymentId}/delete-document`);
     // API này có thể cần documentId trong URL hoặc body
     return api.delete(`/dealer-payments/${paymentId}/delete-document`, { data: { documentId } }); // Ví dụ gửi ID trong body
};