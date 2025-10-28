import api from "./api";

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
// FEEDBACKS API SERVICE
// ============================================

/**
 * Get All Feedbacks
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getAllFeedbacks = async (params = {}) => {
    try {
        const response = await api.get('/feedbacks', {
        params: sanitizeParams(params) // Tái sử dụng hàm sanitizeParams
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        throw error;
    }
};

/**
 * Get Feedbacks BY ID
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getFeedbackById = async (id) => {
    try {
        const response = await api.get(`/feedbacks/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching feedback:', error);
        throw error;
    }
};

/**
 * PATCH feedback
 * @returns {Promise<AxiosResponse<any>>}
 */
export const patchFeedback = async (id, feedbackData) => {
    try {
        const response = await api.patch(`/feedbacks/${id}`, feedbackData);
        return response.data;
    } catch (error) {
        console.error('Error partially updating feedback:', error);
        throw error;
    }
};

export const deleteFeedback = async (id) => {
    try {
        const response = await api.delete(`/feedbacks/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting feedback:', error);
        throw error;
    }
};