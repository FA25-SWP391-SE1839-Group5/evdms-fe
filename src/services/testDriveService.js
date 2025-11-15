import api from './api';

// Helper function (có thể import từ file utils chung nếu cậu có)
const sanitizeParams = (params = {}) => {
    const cleaned = {};
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
        cleaned[key] = value;
        }
    });
    return cleaned;   
};

// ============================================
// TEST DRIVES API SERVICE
// ============================================

export const getAllTestDrives = async (params = {}) => {
    try {
        const response = await api.get('/test-drives', {
        params: sanitizeParams(params)
        });
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
    // API body: { customerId, variantId, scheduledAt, status? }
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

export const patchTestDrive = async (id, testDriveData) => {
    try {
        const response = await api.patch(`/test-drives/${id}`, testDriveData);
        return response.data;
    } catch (error) {
        console.error('Error partially updating test drive:', error);
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