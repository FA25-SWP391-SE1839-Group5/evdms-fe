import FileSaver from "file-saver";
import api from "./api";

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
  return api.get("/audit-logs", { params });
};

/**
 * EXPORT file Audit Logs (CSV/Excel)
 * @param {string} format - 'csv', 'excel', 'pdf'
 * @param {object} filters - Các bộ lọc (search, timePeriod, roles, actions)
 */
export const exportAuditLogs = async (filters = {}) => {
  // Only allow startDate and endDate as query params
  const params = {};
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;

  console.log(`📡 API Call: GET /api/audit-logs/export`, params);
  try {
    const response = await api.get("/audit-logs/export", {
      params,
      responseType: "blob",
    });

    // Robust filename extraction (CSV only)
    let filename = "audit-logs.csv";
    const disposition = response.headers["content-disposition"] || response.headers["Content-Disposition"];
    if (disposition) {
      let match = disposition.match(/filename\*=UTF-8''([^;\s]+)/);
      if (match && match[1]) {
        filename = decodeURIComponent(match[1]);
      } else {
        match = disposition.match(/filename=([^;\s]+)/);
        if (match && match[1]) {
          filename = match[1].replace(/['"]/g, "");
        }
      }
    }

    FileSaver.saveAs(response.data, filename);
    return { success: true, message: "Export successful." };
  } catch (error) {
    console.error("Export Audit Logs Error:", error);
    let errorMessage = "Failed to export audit logs.";
    if (error.response && error.response.data instanceof Blob && error.response.data.type === "application/json") {
      try {
        const errorBlob = await error.response.data.text();
        const errorJson = JSON.parse(errorBlob);
        errorMessage = errorJson.message || errorMessage;
      } catch (parseError) {
        console.error("Could not parse error blob:", parseError);
      }
    }
    return { success: false, message: errorMessage };
  }
};
console.error("Export Audit Logs Error:");
