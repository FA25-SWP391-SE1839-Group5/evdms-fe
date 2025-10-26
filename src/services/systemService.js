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

/**
 * EXPORT file Audit Logs (CSV/Excel)
 */
export const exportAuditLogs = async (format = 'csv') => { 
    console.log(`📡 API Call: GET /api/audit-logs/export?format=${format}`);
    try {
        const response = await api.get('/audit-logs/export', {
            params: { format },
            responseType: 'blob', 
        });

        const contentDisposition = response.headers['content-disposition'];
        let filename = `audit-logs.${format}`; 
        if (contentDisposition) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(contentDisposition);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
            }
        }

        FileSaver.saveAs(response.data, filename);

        return { success: true, message: 'Export successful.' }; 

    } catch (error) {
        console.error('Export Audit Logs Error:', error);
        let errorMessage = 'Failed to export audit logs.';
        if (error.response && error.response.data instanceof Blob && error.response.data.type === "application/json") {
             try {
                const errorBlob = await error.response.data.text();
                const errorJson = JSON.parse(errorBlob);
                errorMessage = errorJson.message || errorMessage;
             } catch (parseError) {
                 console.error("Could not parse error blob:", parseError);
             }
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        }
        throw new Error(errorMessage);
    }
};


