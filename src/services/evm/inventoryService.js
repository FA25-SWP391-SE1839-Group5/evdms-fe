import api from "../api";

// ============================================
// API CALLS - OEM INVENTORIES
// ============================================

/**
 * Get All OEM Inventories with pagination and filters
 * @param {object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.pageSize - Items per page (default: 10)
 * @param {string} params.sortBy - Sort field
 * @param {string} params.sortOrder - Sort order (asc/desc)
 * @param {string} params.search - Search term
 * @param {string} params.filters - Additional filters
 * @returns {Promise<object>} - { items, totalResults, page, pageSize }
 */
export const getAllInventories = async (params = {}) => {
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

    console.log("📡 API Call: GET /api/oem-inventories?" + queryParams.toString());
    
    try {
        const response = await api.get(`/oem-inventories?${queryParams.toString()}`);
        
        // Return full response data structure
        return {
            items: response.data?.data?.items || [],
            totalResults: response.data?.data?.totalResults || 0,
            page: response.data?.data?.page || 1,
            pageSize: response.data?.data?.pageSize || 10
        };
    } catch (error) {
        console.error("Error fetching inventories:", error);
        throw error;
    }
};

/**
 * Get Inventory by ID
 * @param {string|number} inventoryId - ID của Inventory
 * @returns {Promise<object>} - Inventory data
 */
export const getInventoryById = async (inventoryId) => {
  console.log(`📡 API Call: GET /api/oem-inventories/${inventoryId}`);
  try {
    const response = await api.get(`/oem-inventories/${inventoryId}`);
    return response.data?.data || response.data;
  } catch (error) {
    console.error(`Error fetching inventory ${inventoryId}:`, error);
    throw error;
  }
};

/**
 * CREATE Inventory
 * @param {object} inventoryData - Dữ liệu của Inventory mới
 * @param {string} inventoryData.variantId - Vehicle Variant ID
 * @param {number} inventoryData.quantity - Initial quantity
 * @returns {Promise<object>}
 */
export const createInventory = async (inventoryData) => {
  console.log("📡 API Call: POST /api/oem-inventories");
  console.log("📤 Sending data:", inventoryData);
  
  const dataToSend = {
    variantId: inventoryData.variantId,
    quantity: Number(inventoryData.quantity) || 0
  };
  
  try {
    const response = await api.post('/oem-inventories', dataToSend);
    return response.data;
  } catch (error) {
    console.error("Error creating inventory:", error);
    throw error;
  }
};

/**
 * UPDATE Inventory (Full replacement with PUT)
 * @param {string|number} inventoryId
 * @param {object} inventoryData
 * @returns {Promise<object>}
 */
export const updateInventory = async (inventoryId, inventoryData) => {
  console.log(`📡 API Call: PUT /api/oem-inventories/${inventoryId}`);
  console.log("📤 Sending update data:", inventoryData);
  
  const dataToSend = {
    variantId: inventoryData.variantId,
    quantity: Number(inventoryData.quantity) || 0
  };
  
  try {
    const response = await api.put(`/oem-inventories/${inventoryId}`, dataToSend);
    return response.data;
  } catch (error) {
    console.error(`Error updating inventory ${inventoryId}:`, error);
    throw error;
  }
};

/**
 * Adjust inventory quantity (add or remove stock)
 * Uses PATCH endpoint for partial update
 * @param {string} inventoryId - The inventory ID
 * @param {string} variantId - The variant ID (required by API)
 * @param {number} newQuantity - New total quantity value
 * @returns {Promise<Object>} Updated inventory data
 */
export const adjustInventoryQuantity = async (inventoryId, variantId, newQuantity) => {
  try {
    const response = await api.patch(`/oem-inventories/${inventoryId}`, {
      variantId,
      quantity: newQuantity
    });
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error adjusting inventory quantity:', error);
    throw error;
  }
};

/**
 * DELETE Inventory
 * @param {string|number} inventoryId
 * @returns {Promise<object>}
 */
export const deleteInventory = async (inventoryId) => {
  console.log(`📡 API Call: DELETE /api/oem-inventories/${inventoryId}`);
  try {
    const response = await api.delete(`/oem-inventories/${inventoryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting inventory ${inventoryId}:`, error);
    throw error;
  }
};
