import api from "./api";

export const getAllUsers = async (params = {}) => {
  try {
    const response = await api.get(`/users`, {
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch users.");
  }
};

export const getCurrentUser = async () => {
  try {
    console.log("📡 API Call: GET /api/users/me");
    const response = await api.get("/users/me");
    console.log("📥 Current user:", response.data);
    return response;
  } catch (error) {
    console.error("❌ getCurrentUser error:", error.response?.data || error.message);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    console.log(`📡 API Call: GET /api/users/${id}`);
    const response = await api.get(`/users/${id}`);
    console.log("📥 Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ getUserById(${id}) error:`, error.response?.data || error.message);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    console.log("📡 API Call: POST /api/users");

    const dataToSend = {
      fullName: userData.fullName,
      email: userData.email,
      role: userData.role || "DealerStaff", // Mặc định nếu không có
      ...(userData.dealerId && { dealerId: userData.dealerId }),
      ...(typeof userData.isActive === "boolean" && { isActive: userData.isActive }),
    };
    console.log("📤 Request body:", dataToSend);

    // Validate required fields
    if (!userData.fullName || !userData.email) {
      throw new Error("Missing required fields: fullName, email");
    }

    const response = await api.post("/users", dataToSend);
    console.log("✅ User created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ createUser error:", error.response?.data || error.message);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    console.log(`📡 API Call: PUT /api/users/${id}`);

    const dataToSend = { ...userData };
    // Xóa password nếu rỗng (logic cũ giữ nguyên)
    if (!dataToSend.password || dataToSend.password.trim() === "") {
      delete dataToSend.password;
    }
    // Nếu API không cho sửa dealerId khi PUT, bạn có thể xóa nó ở đây:
    // delete dataToSend.dealerId;
    console.log("📤 Request body:", dataToSend);

    const response = await api.put(`/users/${id}`, dataToSend);
    console.log("✅ User updated successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ updateUser(${id}) error:`, error.response?.data || error.message);
    throw error;
  }
};

export const patchUser = async (id, userData) => {
  try {
    console.log(`📡 API Call: PATCH /api/users/${id}`);
    console.log("📤 Request body:", userData);

    const response = await api.patch(`/users/${id}`, userData);
    console.log("✅ User patched successfully:", response.data);
    return response;
  } catch (error) {
    console.error(`❌ patchUser(${id}) error:`, error.response?.data || error.message);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    console.log(`📡 API Call: DELETE /api/users/${id}`);
    const response = await api.delete(`/users/${id}`);
    console.log("✅ User deleted successfully from database:", response.data);
    return response;
  } catch (error) {
    console.error(`❌ deleteUser(${id}) error:`, error.response?.data || error.message);
    throw error;
  }
};

// Export users as CSV
export const exportUsers = async () => {
  try {
    const response = await api.get("/users/export", {
      responseType: "blob",
    });
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to export users.");
  }
};

// Export users by dealer as CSV
export const exportUsersByDealer = async () => {
  try {
    const response = await api.get("/users/export-by-dealer", {
      responseType: "blob",
    });
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to export users by dealer.");
  }
};
