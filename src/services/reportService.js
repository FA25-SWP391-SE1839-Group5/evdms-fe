import api from "./api";

export const getVariantOrderRates = async (params = {}) => {
  try {
    console.log("API Call: GET /api/reports/variant-order-rates with params:", params);
    const response = await api.get("/reports/variant-order-rates", {
      params: sanitizeParams(params),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching variant order rates report:", error.response?.data || error.message);
    throw error;
  }
};

export const exportVariantOrderRates = async (format = "csv", params = {}) => {
  try {
    console.log(`API Call: GET /api/reports/variant-order-rates/export?format=${format} with params:`, params);
    const response = await api.get("/reports/variant-order-rates/export", {
      params: { ...sanitizeParams(params), format },
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    const contentDisposition = response.headers["content-disposition"];
    let filename = `variant_order_rates_report.${format}`;
    if (contentDisposition) {
      // Try to extract RFC 5987 encoded filename* first
      let filenameMatch = contentDisposition.match(/filename\*=UTF-8''([^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = decodeURIComponent(filenameMatch[1]);
      } else {
        // Fallback to regular filename="..."
        filenameMatch = contentDisposition.match(/filename="?([^";\n]+)"?/);
        if (filenameMatch && filenameMatch[1]) filename = filenameMatch[1];
      }
    }
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return { success: true };
  } catch (error) {
    console.error(`Error exporting variant order rates report (${format}):`, error.response?.data || error.message);
    throw error;
  }
};

export const getDealerTotalSales = async (params = {}) => {
  try {
    console.log("API Call: GET /api/reports/dealer-total-sales with params:", params);
    const response = await api.get("/reports/dealer-total-sales", {
      params: sanitizeParams(params),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching dealer total sales report:", error.response?.data || error.message);
    throw error;
  }
};

export const exportDealerTotalSales = async (format = "csv", params = {}) => {
  try {
    console.log(`API Call: GET /api/reports/dealer-total-sales/export?format=${format} with params:`, params);
    const response = await api.get("/reports/dealer-total-sales/export", {
      params: { ...sanitizeParams(params), format },
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    const contentDisposition = response.headers["content-disposition"];
    let filename = `dealer_total_sales_report.${format}`;
    if (contentDisposition) {
      // Try to extract RFC 5987 encoded filename* first
      let filenameMatch = contentDisposition.match(/filename\*=UTF-8''([^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = decodeURIComponent(filenameMatch[1]);
      } else {
        // Fallback to regular filename="..."
        filenameMatch = contentDisposition.match(/filename="?([^";\n]+)"?/);
        if (filenameMatch && filenameMatch[1]) filename = filenameMatch[1];
      }
    }
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return { success: true };
  } catch (error) {
    console.error(`Error exporting dealer total sales report (${format}):`, error.response?.data || error.message);
    throw error;
  }
};

export const getRegionSales = async (params = {}) => {
  try {
    console.log("API Call: GET /api/reports/region-sales with params:", params);
    const response = await api.get("/reports/region-sales", {
      params: sanitizeParams(params),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching region sales report:", error.response?.data || error.message);
    throw error;
  }
};

export const exportRegionSales = async (format = "csv", params = {}) => {
  try {
    console.log(`API Call: GET /api/reports/region-sales/export?format=${format} with params:`, params);
    const response = await api.get("/reports/region-sales/export", {
      params: { ...sanitizeParams(params), format },
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    const contentDisposition = response.headers["content-disposition"];
    let filename = `region_sales_report.${format}`;
    if (contentDisposition) {
      // Try to extract RFC 5987 encoded filename* first
      let filenameMatch = contentDisposition.match(/filename\*=UTF-8''([^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = decodeURIComponent(filenameMatch[1]);
      } else {
        // Fallback to regular filename="..."
        filenameMatch = contentDisposition.match(/filename="?([^";\n]+)"?/);
        if (filenameMatch && filenameMatch[1]) filename = filenameMatch[1];
      }
    }
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return { success: true };
  } catch (error) {
    console.error(`Error exporting region sales report (${format}):`, error.response?.data || error.message);
    throw error;
  }
};

// Helper function (if not already in a shared utils file)
const sanitizeParams = (params = {}) => {
  const cleaned = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

// ============================================
// REPORTS API SERVICE (/api/reports)
// ============================================

/**
 * Get dealer staff sales performance report
 * @param {object} params - Optional query parameters (e.g., dealerId, startDate, endDate)
 */
export const getDealerStaffSales = async (params = {}) => {
  try {
    console.log("API Call: GET /api/reports/dealer-staff-sales with params:", params);
    // Ensure dealerId is passed if required by the API for a Dealer Manager
    const response = await api.get("/reports/dealer-staff-sales", {
      params: sanitizeParams(params),
    });
    console.log("API Response:", response.data);
    // Adjust based on actual API response structure (e.g., response.data.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching dealer staff sales report:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Export dealer staff sales performance report
 * @param {string} format - 'csv' or 'excel' (or 'pdf' if supported)
 * @param {object} params - Optional query parameters (e.g., dealerId, startDate, endDate)
 */
export const exportDealerStaffSales = async (format = "csv", params = {}) => {
  try {
    console.log(`API Call: GET /api/reports/dealer-staff-sales/export?format=${format} with params:`, params);
    const response = await api.get(`/reports/dealer-staff-sales/export`, {
      params: { ...sanitizeParams(params), format },
      responseType: "blob", // Important for downloading files
    });

    // Trigger file download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    const contentDisposition = response.headers["content-disposition"];
    let filename = `dealer_staff_sales_report.${format}`; // Default filename
    if (contentDisposition) {
      // Try to extract RFC 5987 encoded filename* first
      let filenameMatch = contentDisposition.match(/filename\*=UTF-8''([^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = decodeURIComponent(filenameMatch[1]);
      } else {
        // Fallback to regular filename="..."
        filenameMatch = contentDisposition.match(/filename="?([^";\n]+)"?/);
        if (filenameMatch && filenameMatch[1]) filename = filenameMatch[1];
      }
    }
    link.setAttribute("download", filename);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    console.log("Export successful");
    return { success: true };
  } catch (error) {
    console.error(`Error exporting dealer staff sales report (${format}):`, error.response?.data || error.message);
    throw error;
  }
};
