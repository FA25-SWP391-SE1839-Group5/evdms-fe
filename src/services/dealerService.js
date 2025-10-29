import api from "./api";

// ============================================
// API CALLS - DEALERS
// ============================================

/**
 * Get All Dealers with pagination and filters
 * @param {object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.pageSize - Items per page (default: 10)
 * @param {string} params.sortBy - Sort field
 * @param {string} params.sortOrder - Sort order (asc/desc)
 * @param {string} params.search - Search term
 * @param {string} params.filters - Additional filters
 * @returns {Promise<object>} - { items, totalResults, page, pageSize }
 */
export const getAllDealers = async (params = {}) => {
    const {
        page = 1,
        pageSize = 10,
        sortBy = '',
        sortOrder = '',
        search = '',
        filters = ''
    } = params;

    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('pageSize', pageSize.toString());
    if (sortBy) queryParams.append('sortBy', sortBy);
    if (sortOrder) queryParams.append('sortOrder', sortOrder);
    if (search) queryParams.append('search', search);
    if (filters) queryParams.append('filters', filters);

    console.log("📡 API Call: GET /api/dealers?" + queryParams.toString());
    
    try {
        const response = await api.get(`/dealers?${queryParams.toString()}`);
        
        // Return full response data structure
        return {
            items: response.data?.data?.items || [],
            totalResults: response.data?.data?.totalResults || 0,
            page: response.data?.data?.page || 1,
            pageSize: response.data?.data?.pageSize || 10
        };
    } catch (error) {
        console.error("Error fetching dealers:", error);
        throw error;
    }
};

/**
 * Get Dealer by ID
 * @param {string|number} dealerId - ID của Dealer
 * @returns {Promise<object>} - Dealer data
 */
export const getDealerById = async (dealerId) => {
  console.log(`📡 API Call: GET /api/dealers/${dealerId}`);
  try {
    const response = await api.get(`/dealers/${dealerId}`);
    return response.data?.data || response.data;
  } catch (error) {
    console.error(`Error fetching dealer ${dealerId}:`, error);
    throw error;
  }
};

/**
 * CREATE Dealer
 * @param {object} dealerData - Dữ liệu của Dealer mới
 * @param {string} dealerData.name - Tên Dealer (bắt buộc)
 * @param {string} dealerData.region - Khu vực (bắt buộc)
 * @param {string} dealerData.address - Địa chỉ (bắt buộc)
 * @returns {Promise<object>}
 */
export const createDealer = async (dealerData) => {
  console.log("📡 API Call: POST /api/dealers");
  console.log("📤 Sending data:", dealerData);
  
  // Only send required fields: name, region, address
  const dataToSend = {
      name: dealerData.name,
      region: dealerData.region,
      address: dealerData.address
  };
  
  try {
    const response = await api.post('/dealers', dataToSend);
    return response.data;
  } catch (error) {
    console.error("Error creating dealer:", error);
    throw error;
  }
};

/**
 * UPDATE Dealer
 * @param {string|number} dealerId - ID của Dealer cần cập nhật
 * @param {object} dealerData - Dữ liệu cập nhật
 * @returns {Promise<object>}
 */
export const updateDealer = async (dealerId, dealerData) => {
  console.log(`📡 API Call: PUT /api/dealers/${dealerId}`);
  console.log("📤 Sending update data:", dealerData);
  
  const dataToSend = {
      name: dealerData.name,
      region: dealerData.region,
      address: dealerData.address
  };
  
  try {
    const response = await api.put(`/dealers/${dealerId}`, dataToSend);
    return response.data;
  } catch (error) {
    console.error(`Error updating dealer ${dealerId}:`, error);
    throw error;
  }
};

/**
 * DELETE Dealer
 * @param {string|number} dealerId - ID của Dealer cần xóa
 * @returns {Promise<object>}
 */
export const deleteDealer = async (dealerId) => {
  console.log(`📡 API Call: DELETE /api/dealers/${dealerId}`);
  try {
    const response = await api.delete(`/dealers/${dealerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting dealer ${dealerId}:`, error);
    throw error;
  }
};

// ============================================
// API CALLS - DEALER CONTRACTS
// ============================================

/**
 * Get All Dealer Contracts with pagination and filters
 * @param {object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.pageSize - Items per page (default: 10)
 * @param {string} params.sortBy - Sort field
 * @param {string} params.sortOrder - Sort order (asc/desc)
 * @param {string} params.search - Search term
 * @param {string} params.filters - Additional filters
 * @returns {Promise<object>} - { items, totalResults, page, pageSize }
 */
export const getAllDealerContracts = async (params = {}) => {
    const {
        page = 1,
        pageSize = 10,
        sortBy = '',
        sortOrder = '',
        search = '',
        filters = ''
    } = params;

    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('pageSize', pageSize.toString());
    if (sortBy) queryParams.append('sortBy', sortBy);
    if (sortOrder) queryParams.append('sortOrder', sortOrder);
    if (search) queryParams.append('search', search);
    if (filters) queryParams.append('filters', filters);

    console.log("📡 API Call: GET /api/dealer-contracts?" + queryParams.toString());
    
    try {
        const response = await api.get(`/dealer-contracts?${queryParams.toString()}`);
        
        // Return full response data structure
        return {
            items: response.data?.data?.items || [],
            totalResults: response.data?.data?.totalResults || 0,
            page: response.data?.data?.page || 1,
            pageSize: response.data?.data?.pageSize || 10
        };
    } catch (error) {
        console.error("Error fetching dealer contracts:", error);
        throw error;
    }
};

/**
 * Get Dealer Contract by ID
 * @param {string|number} contractId - ID của Contract
 * @returns {Promise<object>} - Contract data
 */
export const getDealerContractById = async (contractId) => {
  console.log(`📡 API Call: GET /api/dealer-contracts/${contractId}`);
  try {
    const response = await api.get(`/dealer-contracts/${contractId}`);
    return response.data?.data || response.data;
  } catch (error) {
    console.error(`Error fetching dealer contract ${contractId}:`, error);
    throw error;
  }
};

/**
 * CREATE Dealer Contract
 * @param {object} contractData - Dữ liệu của Hợp đồng mới
 * @param {string} contractData.dealerId
 * @param {string} contractData.startDate - ISO date string
 * @param {string} contractData.endDate - ISO date string
 * @param {number} contractData.salesTarget
 * @param {number} contractData.outstandingDebt
 * @returns {Promise<object>}
 */
export const createDealerContract = async (contractData) => {
  console.log("📡 API Call: POST /api/dealer-contracts");
  console.log("📤 Sending data:", contractData);
  
  const dataToSend = {
    dealerId: contractData.dealerId,
    startDate: contractData.startDate,
    endDate: contractData.endDate,
    salesTarget: Number(contractData.salesTarget) || 0,
    outstandingDebt: Number(contractData.outstandingDebt) || 0
  };
  
  try {
    const response = await api.post('/dealer-contracts', dataToSend);
    return response.data;
  } catch (error) {
    console.error("Error creating dealer contract:", error);
    throw error;
  }
};

/**
 * UPDATE Dealer Contract
 * @param {string|number} contractId
 * @param {object} contractData
 * @returns {Promise<object>}
 */
export const updateDealerContract = async (contractId, contractData) => {
  console.log(`📡 API Call: PUT /api/dealer-contracts/${contractId}`);
  console.log("📤 Sending update data:", contractData);
  
  const dataToSend = {
    dealerId: contractData.dealerId,
    startDate: contractData.startDate,
    endDate: contractData.endDate,
    salesTarget: Number(contractData.salesTarget) || 0,
    outstandingDebt: Number(contractData.outstandingDebt) || 0
  };
  
  try {
    const response = await api.put(`/dealer-contracts/${contractId}`, dataToSend);
    return response.data;
  } catch (error) {
    console.error(`Error updating dealer contract ${contractId}:`, error);
    throw error;
  }
};

/**
 * DELETE Dealer Contract
 * @param {string|number} contractId
 * @returns {Promise<object>}
 */
export const deleteDealerContract = async (contractId) => {
  console.log(`📡 API Call: DELETE /api/dealer-contracts/${contractId}`);
  try {
    const response = await api.delete(`/dealer-contracts/${contractId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting dealer contract ${contractId}:`, error);
    throw error;
  }
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