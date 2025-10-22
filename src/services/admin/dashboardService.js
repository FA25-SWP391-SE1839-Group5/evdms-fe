import api from '../api';

// ============================================
// DEALERS
// ============================================
const sanitizeParams = (params = {}) => {
  const cleaned = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

export const getAllDealers = async (params = {}) => {
  try {
    const response = await api.get('/dealers', {
      params: sanitizeParams(params)
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dealers:', error);
    throw error;
  }
};

export const getDealerById = async (id) => {
  try {
    const response = await api.get(`/dealers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dealer:', error);
    throw error;
  }
};

export const createDealer = async (dealerData) => {
  try {
    const response = await api.post('/dealers', dealerData);
    return response.data;
  } catch (error) {
    console.error('Error creating dealer:', error);
    throw error;
  }
};

export const updateDealer = async (id, dealerData) => {
  try {
    const response = await api.put(`/dealers/${id}`, dealerData);
    return response.data;
  } catch (error) {
    console.error('Error updating dealer:', error);
    throw error;
  }
};

export const patchDealer = async (id, dealerData) => {
  try {
    const response = await api.patch(`/dealers/${id}`, dealerData);
    return response.data;
  } catch (error) {
    console.error('Error partially updating dealer:', error);
    throw error;
  }
};

export const deleteDealer = async (id) => {
  try {
    const response = await api.delete(`/dealers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting dealer:', error);
    throw error;
  }
};

// ============================================
// DEALER CONTRACTS
// ============================================

export const getAllDealerContracts = async (params = {}) => {
  try {
    const response = await api.get('/dealer-contracts', {
      params: sanitizeParams(params)
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dealer contracts:', error);
    throw error;
  }
};

export const getDealerContractById = async (id) => {
  try {
    const response = await api.get(`/dealer-contracts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dealer contract:', error);
    throw error;
  }
};

export const createDealerContract = async (payload) => {
  try {
    const response = await api.post('/dealer-contracts', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating dealer contract:', error);
    throw error;
  }
};

export const updateDealerContract = async (id, payload) => {
  try {
    const response = await api.put(`/dealer-contracts/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating dealer contract:', error);
    throw error;
  }
};

export const patchDealerContract = async (id, payload) => {
  try {
    const response = await api.patch(`/dealer-contracts/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error('Error partially updating dealer contract:', error);
    throw error;
  }
};

export const deleteDealerContract = async (id) => {
  try {
    const response = await api.delete(`/dealer-contracts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting dealer contract:', error);
    throw error;
  }
};

// ============================================
// CUSTOMERS
// ============================================
export const getAllCustomers = async () => {
  try {
    const response = await api.get('/customers');
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const getCustomerById = async (id) => {
  try {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customer:', error);
    throw error;
  }
};

export const createCustomer = async (customerData) => {
  try {
    const response = await api.post('/customers', customerData);
    return response.data;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

export const updateCustomer = async (id, customerData) => {
  try {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

export const deleteCustomer = async (id) => {
  try {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

// ============================================
// OEM INVENTORIES
// ============================================
export const getAllInventories = async () => {
  try {
    const response = await api.get('/oem-inventories');
    return response.data;
  } catch (error) {
    console.error('Error fetching inventories:', error);
    throw error;
  }
};

export const getInventoryById = async (id) => {
  try {
    const response = await api.get(`/oem-inventories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
};

export const createInventory = async (inventoryData) => {
  try {
    const response = await api.post('/oem-inventories', inventoryData);
    return response.data;
  } catch (error) {
    console.error('Error creating inventory:', error);
    throw error;
  }
};

export const updateInventory = async (id, inventoryData) => {
  try {
    const response = await api.put(`/oem-inventories/${id}`, inventoryData);
    return response.data;
  } catch (error) {
    console.error('Error updating inventory:', error);
    throw error;
  }
};

export const deleteInventory = async (id) => {
  try {
    const response = await api.delete(`/oem-inventories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting inventory:', error);
    throw error;
  }
};

// ============================================
// SALES ORDERS
// ============================================
export const getAllOrders = async () => {
  try {
    const response = await api.get('/sales-orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await api.get(`/sales-orders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/sales-orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrder = async (id, orderData) => {
  try {
    const response = await api.put(`/sales-orders/${id}`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

export const deleteOrder = async (id) => {
  try {
    const response = await api.delete(`/sales-orders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

// ============================================
// TEST DRIVES
// ============================================
export const getAllTestDrives = async () => {
  try {
    const response = await api.get('/test-drives');
    return response.data;
  } catch (error) {
    console.error('Error fetching test drives:', error);
    throw error;
  }
};

export const getTestDriveById = async (id) => {
  try {
    const response = await api.get(`/test-drives/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching test drive:', error);
    throw error;
  }
};

export const createTestDrive = async (testDriveData) => {
  try {
    const response = await api.post('/test-drives', testDriveData);
    return response.data;
  } catch (error) {
    console.error('Error creating test drive:', error);
    throw error;
  }
};

export const updateTestDrive = async (id, testDriveData) => {
  try {
    const response = await api.put(`/test-drives/${id}`, testDriveData);
    return response.data;
  } catch (error) {
    console.error('Error updating test drive:', error);
    throw error;
  }
};

export const deleteTestDrive = async (id) => {
  try {
    const response = await api.delete(`/test-drives/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting test drive:', error);
    throw error;
  }
};

// ============================================
// QUOTATIONS
// ============================================
export const getAllQuotations = async () => {
  try {
    const response = await api.get('/quotations');
    return response.data;
  } catch (error) {
    console.error('Error fetching quotations:', error);
    throw error;
  }
};

export const getQuotationById = async (id) => {
  try {
    const response = await api.get(`/quotations/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quotation:', error);
    throw error;
  }
};

export const createQuotation = async (quotationData) => {
  try {
    const response = await api.post('/quotations', quotationData);
    return response.data;
  } catch (error) {
    console.error('Error creating quotation:', error);
    throw error;
  }
};

export const updateQuotation = async (id, quotationData) => {
  try {
    const response = await api.put(`/quotations/${id}`, quotationData);
    return response.data;
  } catch (error) {
    console.error('Error updating quotation:', error);
    throw error;
  }
};

export const deleteQuotation = async (id) => {
  try {
    const response = await api.delete(`/quotations/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting quotation:', error);
    throw error;
  }
};

// ============================================
// PAYMENTS
// ============================================
export const getAllPayments = async () => {
  try {
    const response = await api.get('/payments');
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

export const getPaymentById = async (id) => {
  try {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment:', error);
    throw error;
  }
};

export const createPayment = async (paymentData) => {
  try {
    const response = await api.post('/payments', paymentData);
    return response.data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

export const updatePayment = async (id, paymentData) => {
  try {
    const response = await api.put(`/payments/${id}`, paymentData);
    return response.data;
  } catch (error) {
    console.error('Error updating payment:', error);
    throw error;
  }
};

export const deletePayment = async (id) => {
  try {
    const response = await api.delete(`/payments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting payment:', error);
    throw error;
  }
};

// ============================================
// PROMOTIONS
// ============================================
export const getAllPromotions = async () => {
  try {
    const response = await api.get('/promotions');
    return response.data;
  } catch (error) {
    console.error('Error fetching promotions:', error);
    throw error;
  }
};

export const getPromotionById = async (id) => {
  try {
    const response = await api.get(`/promotions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching promotion:', error);
    throw error;
  }
};

export const createPromotion = async (promotionData) => {
  try {
    const response = await api.post('/promotions', promotionData);
    return response.data;
  } catch (error) {
    console.error('Error creating promotion:', error);
    throw error;
  }
};

export const updatePromotion = async (id, promotionData) => {
  try {
    const response = await api.put(`/promotions/${id}`, promotionData);
    return response.data;
  } catch (error) {
    console.error('Error updating promotion:', error);
    throw error;
  }
};

export const deletePromotion = async (id) => {
  try {
    const response = await api.delete(`/promotions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting promotion:', error);
    throw error;
  }
};

// ============================================
// USERS
// ============================================
export const getAllUsers = async () => {
  console.log('📡 API Call: GET /api/users');
  const response = await api.get('/users');
  console.log('📥 Raw Response:', response.data);

  const resData = response.data;
  // 👉 Lấy mảng users từ data.items
  const users = resData?.data?.items || [];

  return {
    success: resData.success ?? true,
    data: users,
    message: resData.message ?? null
  };
};

export const getUserById = async (id) => {
  try {
    console.log(`📡 API Call: GET /api/users/${id}`);
    const response = await api.get(`/users/${id}`);
    console.log('📥 Response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ getUserById(${id}) error:`, error.response?.data || error.message);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    console.log('📡 API Call: POST /api/users');
    console.log('📤 Request body:', userData);

    // Validate required fields
    if (!userData.fullName || !userData.email || !userData.password) {
      throw new Error('Missing required fields: fullName, email, password');
    }

    const response = await api.post('/users', userData);
    console.log('✅ User created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ createUser error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    console.log(`📡 API Call: PUT /api/users/${id}`);
    console.log('📤 Request body:', userData);

    const response = await api.put(`/users/${id}`, userData);
    console.log('✅ User updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ updateUser(${id}) error:`, error.response?.data || error.message);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    console.log(`📡 API Call: DELETE /api/users/${id}`);
    const response = await api.delete(`/users/${id}`);
    console.log('✅ User deleted successfully from database:', response.data);
    return response;
  } catch (error) {
    console.error(`❌ deleteUser(${id}) error:`, error.response?.data || error.message);
    throw error;
  }
};

export const patchUser = async (id, userData) => {
  try {
    console.log(`📡 API Call: PATCH /api/users/${id}`);
    console.log('📤 Request body:', userData);

    const response = await api.patch(`/users/${id}`, userData);
    console.log('✅ User patched successfully:', response.data);
    return response;
  } catch (error) {
    console.error(`❌ patchUser(${id}) error:`, error.response?.data || error.message);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    console.log('📡 API Call: GET /api/users/me');
    const response = await api.get('/users/me');
    console.log('📥 Current user:', response.data);
    return response;
  } catch (error) {
    console.error('❌ getCurrentUser error:', error.response?.data || error.message);
    throw error;
  }
};
