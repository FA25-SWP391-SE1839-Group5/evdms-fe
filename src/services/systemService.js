import api from './api';
import FileSaver from 'file-saver';

// ============================================
// AUDIT LOGS
// ============================================

/**
 * GET ALL Audit Logs 
 * @param {object} params - Optional query parameters
 */
export const getAllAuditLogs = (params = {}) => {
    console.log("📡 API Call: GET /api/audit-logs");
    // Giả sử API trả về cấu trúc tương tự các API khác
    // response.data?.data?.items
    return api.get('/audit-logs', { params });
};



