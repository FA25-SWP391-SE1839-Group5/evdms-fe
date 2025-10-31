import { AlertCircle, CheckCircle, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getAllDealers } from "../../../services/dealerService";
import RolesPermissionsTab from "./RolesPermissionsTab";
import UserDetailsModal from "./UserDetailsModal";
import UserModal from "./UserModal";
import UserStatsCards from "./UserStatsCards";

// Import các thư viện export
import { saveAs } from "file-saver";
import { createUser, deleteUser, exportUsers, getAllUsers, updateUser } from "../../../services/userService";

const UserManagement = () => {
  const [activeTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [filterRole, setFilterRole] = useState("");
  const [filterPlan, setFilterPlan] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [submitting, setSubmitting] = useState(false);
  const [sortColumn, setSortColumn] = useState("fullName");
  const [sortDirection, setSortDirection] = useState("asc");

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "DealerStaff",
    dealerId: "",
    isActive: true,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const fetchInitialData = async () => {
    try {
      setSubmitting(true);
      setLoading(true);
      setError("");
      const [userResponse, dealerResponse] = await Promise.all([getAllUsers(currentPage, pageSize), getAllDealers()]);
      setUsers(userResponse?.data?.items || []);
      setDealers(dealerResponse.items || []);
    } catch (err) {
      const errorMsg = err.message || "Failed to load initial data";
      setError(errorMsg);
      console.error("Fetch Initial Data Error:", err);
      setUsers([]);
      setDealers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchInitialDataCallback = useCallback(fetchInitialData, [currentPage, pageSize]);

  useEffect(() => {
    fetchInitialDataCallback();
  }, [fetchInitialDataCallback]);

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName || formData.fullName.trim().length < 2) {
      errors.fullName = "Full name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      setError("Please fix the validation errors");
      return;
    }

    try {
      if (editingUser) {
        // UPDATE USER
        const updateData = { ...formData };

        if (!updateData.password || updateData.password.trim() === "") {
          delete updateData.password;
        }
        // Maybe don't send dealerId if API doesn't allow updating it
        // delete updateData.dealerId;
        const response = await updateUser(editingUser.id, updateData);

        if (response.success) {
          setSuccess(`User "${formData.fullName}" updated successfully`);
          await fetchInitialData();
          handleCloseModal();
        } else {
          throw new Error(response.message || "Update failed");
        }
      } else {
        // CREATE NEW USER (no password)
        const response = await createUser(formData);
        if (response.success) {
          setSuccess(`User "${formData.fullName}" created successfully! They can now login with their credentials.`);
          await fetchInitialData();
          handleCloseModal();
        } else {
          throw new Error(response.message || "Creation failed");
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Operation failed";
      setError(`Database operation failed: ${errorMsg}`);

      if (errorMsg.toLowerCase().includes("email") && errorMsg.toLowerCase().includes("exists")) {
        setValidationErrors({ email: "This email is already registered" });
      }
    }
  };

  const handleDelete = async (userId, userName) => {
    const confirmMessage = `⚠️ DELETE USER FROM DATABASE?\n\nUser: ${userName}\n\nThis will permanently remove the user from the database.\nThey will NOT be able to login anymore.\n\nAre you absolutely sure?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await deleteUser(userId);

      if (response.data?.success) {
        setSuccess(`User "${userName}" has been permanently deleted from database. They can no longer login.`);
        await fetchInitialData();
      } else {
        throw new Error("Delete operation failed");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to delete user";
      setError(errorMsg);
    }
  };

  // START: HÀM MỚI ĐỂ SUSPEND/ACTIVATE USER
  const handleToggleSuspend = async (userToToggle) => {
    const actionText = userToToggle.isActive ? "suspend" : "activate";
    const confirmMessage = `Are you sure you want to ${actionText} the user "${userToToggle.fullName}"?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      // Chúng ta chỉ cập nhật trạng thái 'isActive'
      const updateData = { isActive: !userToToggle.isActive };
      const response = await updateUser(userToToggle.id, updateData);

      if (response.success) {
        setSuccess(`User "${userToToggle.fullName}" has been ${actionText}d.`);
        await fetchInitialData(); // Tải lại danh sách
      } else {
        throw new Error(response.message || "Toggle status failed");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || `Failed to ${actionText} user.`;
      setError(errorMsg);
    }
  };

  // HÀM ĐỂ XEM CHI TIẾT
  const handleView = (user) => {
    setViewingUser(user);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setViewingUser(null);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      role: user.role || "DealerStaff",
      dealerId: user.dealerId || "",
      isActive: user.isActive !== undefined ? user.isActive : true,
    });
    setShowModal(true);
    setError("");
    setValidationErrors({});
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      fullName: "",
      email: "",
      role: "DealerStaff",
      dealerId: "",
      isActive: true,
    });
    setError("");
    setValidationErrors({});
  };

  // HÀM ĐỂ XỬ LÝ SẮP XẾP
  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      // Đảo ngược hướng nếu bấm vào cột đang sort
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      // Chuyển sang cột mới, mặc định là tăng dần
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
    setCurrentPage(1); // Reset về trang 1 khi sort
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) || (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRole = filterRole ? user.role === filterRole : true;
      const matchesStatus = filterStatus ? user.isActive === (filterStatus === "true") : true;
      const matchesDealer = filterPlan ? user.dealerName === filterPlan : true;
      return matchesSearch && matchesRole && matchesStatus && matchesDealer;
    });
  }, [users, searchTerm, filterRole, filterStatus, filterPlan]);

  // CẬP NHẬT LOGIC: SẮP XẾP SAU KHI LỌC
  const sortedAndFilteredUsers = useMemo(() => {
    const sortableUsers = [...filteredUsers]; // Tạo bản sao để không ảnh hưởng mảng gốc

    sortableUsers.sort((a, b) => {
      let aValue = a[sortColumn];
      let bValue = b[sortColumn];

      // Xử lý giá trị null/undefined hoặc các trường hợp đặc biệt
      if (aValue == null && bValue == null) return 0; // Cả hai null, coi như bằng nhau
      if (aValue == null) return sortDirection === "asc" ? 1 : -1; // A null, đẩy A về cuối (asc) / đầu (desc)
      if (bValue == null) return sortDirection === "asc" ? -1 : 1; // B null, đẩy B về cuối (asc) / đầu (desc)

      let comparison = 0;
      // So sánh string (không phân biệt hoa thường)
      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
      }
      // So sánh boolean (true > false)
      else if (typeof aValue === "boolean" && typeof bValue === "boolean") {
        comparison = aValue === bValue ? 0 : aValue ? 1 : -1;
      }
      // Có thể thêm logic cho số nếu cần
      // else if (typeof aValue === 'number' && typeof bValue === 'number') {
      //   comparison = aValue - bValue;
      // }
      else {
        // Trường hợp khác (hoặc type khác nhau), cố gắng so sánh như string
        comparison = String(aValue).toLowerCase().localeCompare(String(bValue).toLowerCase());
      }

      // Đảo ngược kết quả nếu sortDirection là 'desc'
      return sortDirection === "asc" ? comparison : comparison * -1;
    });

    return sortableUsers;
  }, [filteredUsers, sortColumn, sortDirection]); // Phụ thuộc vào dữ liệu đã lọc và state sort

  // Logic Phân trang
  // Tính toán tổng số trang
  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  // Tính toán mảng user để hiển thị cho trang hiện tại
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Tính toán thông tin hiển thị (ví dụ: "Showing 1 to 10 of 50")
  const startEntry = filteredUsers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endEntry = Math.min(currentPage * pageSize, filteredUsers.length);

  const getRoleBadgeClass = (role) => {
    const roleMap = {
      Admin: "danger",
      DealerManager: "warning",
      DealerStaff: "info",
      EVMStaff: "primary",
    };
    return roleMap[role] || "secondary";
  };

  const formatRoleDisplay = (role) => {
    const roleDisplayMap = {
      Admin: "Admin",
      DealerManager: "Dealer Manager",
      DealerStaff: "Dealer Staff",
      EVMStaff: "EVM Staff",
    };
    return roleDisplayMap[role] || role;
  };

  // HÀM MỚI ĐỂ HIỂN THỊ ICON SORT
  const renderSortIcon = (columnKey) => {
    if (sortColumn !== columnKey) {
      // Hiển thị icon trung tính nếu không phải cột đang sort
      return <i className="bx bx-sort text-muted ms-1 opacity-50 small"></i>;
    }
    // Hiển thị icon lên/xuống tùy theo hướng
    return sortDirection === "asc" ? <i className="bx bx-sort-up text-primary ms-1 small"></i> : <i className="bx bx-sort-down text-primary ms-1 small"></i>;
  };

  // Export users as CSV using backend API
  const handleExport = async () => {
    try {
      const response = await exportUsers();
      const blob = new Blob([response.data], { type: "text/csv" });
      let filename = "users.csv";
      const headers = response.headers || {};
      const disposition = headers["content-disposition"] || headers["Content-Disposition"];
      if (disposition) {
        // Prefer UTF-8 filename
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
      saveAs(blob, filename);
      setSuccess("Export successful!");
    } catch (err) {
      setError(err.message || "Export failed.");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading users from database...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Render Stats Cards (only on 'users' tab) */}
      {activeTab === "users" && <UserStatsCards users={users} />}

      {/* Alert messages */}
      {error && (
        <div className="alert alert-danger alert-dismissible d-flex align-items-center" role="alert">
          <AlertCircle size={20} className="me-2" />
          <div className="flex-grow-1">{error}</div>
          <button type="button" className="btn-close" onClick={() => setError("")}></button>
        </div>
      )}
      {success && (
        <div className="alert alert-success alert-dismissible d-flex align-items-center" role="alert">
          <CheckCircle size={20} className="me-2" />
          <div className="flex-grow-1">{success}</div>
          <button type="button" className="btn-close" onClick={() => setSuccess("")}></button>
        </div>
      )}

      {/* Card */}
      {activeTab === "users" ? (
        <div className="card">
          <div className="card-header border-bottom">
            <h5 className="card-title mb-3">Search Filters</h5>
            <div className="d-flex justify-content-between align-items-center row pb-2 gap-3 gap-md-0">
              <div className="col-md-4">
                <select className="form-select" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="DealerManager">Dealer Manager</option>
                  <option value="DealerStaff">Dealer Staff</option>
                  <option value="EVMStaff">EVM Staff</option>
                </select>
              </div>
              <div className="col-md-4">
                <select className="form-select" value={filterPlan} onChange={(e) => setFilterPlan(e.target.value)}>
                  <option value="">Select Dealer</option>
                  {[...new Set(users.map((u) => u.dealerName).filter(Boolean))].map((dealer) => (
                    <option key={dealer} value={dealer}>
                      {dealer}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="">Select Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card-datatable table-responsive">
            <div className="row m-2 justify-content-between">
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1); // Reset về trang 1 khi đổi
                  }}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>

              <div className="col-md-10 d-flex align-items-center justify-content-end gap-2">
                <input type="search" className="form-control w-50" placeholder="Search User" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <button type="button" className="btn btn-outline-secondary d-flex align-items-center" onClick={handleExport}>
                  <i className="bx bx-export me-1"></i> Export
                </button>

                <button type="button" className="btn btn-primary rounded-pill d-flex align-items-center px-3 py-2" onClick={() => setShowModal(true)}>
                  <Plus size={18} className="me-2" />
                  <span className="fw-semibold">Add User</span>
                </button>
              </div>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("fullName")} style={{ cursor: "pointer" }} className="sorting">
                    Full Name {renderSortIcon("fullName")}
                  </th>
                  <th onClick={() => handleSort("email")} style={{ cursor: "pointer" }} className="sorting">
                    Email {renderSortIcon("email")}
                  </th>
                  <th onClick={() => handleSort("role")} style={{ cursor: "pointer" }} className="sorting">
                    Role {renderSortIcon("role")}
                  </th>
                  <th onClick={() => handleSort("dealerName")} style={{ cursor: "pointer" }} className="sorting">
                    Dealer
                  </th>
                  <th onClick={() => handleSort("isActive")} style={{ cursor: "pointer" }} className="sorting">
                    Status
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="table-border-bottom-0">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      {filteredUsers.length === 0 && !searchTerm && !filterRole && !filterStatus ? "No users found" : "No users match your filters/search"}
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.fullName || "N/A"}</td>
                      <td>{user.email || "N/A"}</td>
                      <td>
                        <span className={`badge bg-label-${getRoleBadgeClass(user.role)}`}>{formatRoleDisplay(user.role)}</span>
                      </td>
                      <td>{user.dealerName || "-"}</td>
                      <td>
                        <span className={`badge bg-label-${user.isActive ? "success" : "secondary"}`}>{user.isActive ? "Active" : "Inactive"}</span>
                      </td>

                      <td>
                        <div className="d-flex align-items-center">
                          {/* 1. Nút Xóa (Thùng rác) */}
                          <button
                            type="button"
                            className="btn btn-icon btn-text-secondary rounded-pill btn-sm"
                            data-bs-toggle="tooltip"
                            title="Delete"
                            onClick={() => handleDelete(user.id, user.fullName)}
                          >
                            <i className="bx bx-trash" />
                          </button>

                          {/* 2. Nút Xem (Con mắt) */}
                          <button type="button" className="btn btn-icon btn-text-secondary rounded-pill btn-sm" data-bs-toggle="tooltip" title="View" onClick={() => handleView(user)}>
                            <i className="bx bx-show" />
                          </button>

                          {/* 3. Nút Menu (Ba chấm) */}
                          <div className="dropdown">
                            <button type="button" className="btn p-0 dropdown-toggle hide-arrow btn-sm" data-bs-toggle="dropdown">
                              <i className="bx bx-dots-vertical-rounded" />
                            </button>
                            <div className="dropdown-menu">
                              <button type="button" className="dropdown-item" onClick={() => handleEdit(user)}>
                                <i className="bx bx-edit-alt me-2" /> Edit
                              </button>

                              <button type="button" className="dropdown-item" onClick={() => handleToggleSuspend(user)}>
                                {user.isActive ? (
                                  <>
                                    <i className="bx bx-block me-2" /> Suspend
                                  </>
                                ) : (
                                  <>
                                    <i className="bx bx-check-circle me-2" /> Activate
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* THANH PHÂN TRANG */}
            <div className="d-flex justify-content-between align-items-center p-3">
              <small className="text-muted">
                Showing {startEntry} to {endEntry} of {sortedAndFilteredUsers.length} entries
              </small>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 1}>
                      &laquo; Previous
                    </button>
                  </li>
                  <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalPages || totalPages === 0}>
                      Next &raquo;
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      ) : (
        <RolesPermissionsTab
          users={users}
          formatRoleDisplay={formatRoleDisplay} // Pass the formatter function
        />
      )}

      {/* Modal */}
      <UserModal
        show={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        user={editingUser}
        formData={formData || {}}
        onFormChange={handleChange}
        errors={validationErrors}
        dealers={dealers}
        submitting={submitting}
      />

      {/* Details Modal */}
      <UserDetailsModal show={showDetailsModal} onClose={handleCloseDetailsModal} user={viewingUser} getRoleBadgeClass={getRoleBadgeClass} formatRoleDisplay={formatRoleDisplay} />
    </>
  );
};

export default UserManagement;
