import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createUser, deleteUser, getAllUsers, getUserById, patchUser } from "../../../services/userService";
import { decodeJwt } from "../../../utils/jwt";
import UserDetailsModal from "../../admin-dashboard/users/UserDetailsModal";
import StaffUserModal from "./StaffUserModal";

const StaffManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filterRole, setFilterRole] = useState("");
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
      // Always filter by dealerId from JWT
      const token = localStorage.getItem("evdms_auth_token");
      let dealerId;
      if (token) {
        const payload = decodeJwt(token);
        dealerId = payload?.dealerId;
      }
      const userParams = { page: currentPage, pageSize };
      if (dealerId) userParams.filters = JSON.stringify({ dealerId });
      const userResponse = await getAllUsers(userParams);
      setUsers(userResponse?.data?.items || []);
    } catch (err) {
      const errorMsg = err.message || "Failed to load initial data";
      setError(errorMsg);
      setUsers([]);
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
    setSubmitting(true);
    if (!validateForm()) {
      setError("Please fix the validation errors");
      setSubmitting(false);
      return;
    }
    try {
      if (editingUser) {
        // PATCH USER: only send changed fields
        const changedFields = {};
        Object.keys(formData).forEach((key) => {
          if (formData[key] !== editingUser[key]) {
            changedFields[key] = formData[key];
          }
        });
        if (Object.keys(changedFields).length === 0) {
          setError("No changes detected.");
          setSubmitting(false);
          return;
        }
        const response = await patchUser(editingUser.id, changedFields);
        if (response.data?.success || response.success) {
          setSuccess(`User "${formData.fullName}" updated successfully`);
          await fetchInitialData();
          handleCloseModal();
        } else {
          throw new Error(response.data?.message || response.message || "Update failed");
        }
      } else {
        // CREATE NEW USER: restrict role, set dealerId from JWT, no password or assigned dealer
        const token = localStorage.getItem("evdms_auth_token");
        let dealerId;
        if (token) {
          const payload = decodeJwt(token);
          dealerId = payload?.dealerId;
        }
        const userPayload = { ...formData, dealerId };
        const response = await createUser(userPayload);
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
    } finally {
      setSubmitting(false);
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

  const handleToggleSuspend = async (userToToggle) => {
    const actionText = userToToggle.isActive ? "suspend" : "activate";
    const confirmMessage = `Are you sure you want to ${actionText} the user "${userToToggle.fullName}"?`;
    if (!window.confirm(confirmMessage)) {
      return;
    }
    try {
      const updateData = { isActive: !userToToggle.isActive };
      const response = await patchUser(userToToggle.id, updateData);
      if (response.data?.success || response.success) {
        setSuccess(`User "${userToToggle.fullName}" has been ${actionText}d.`);
        await fetchInitialData();
      } else {
        throw new Error((response.data && response.data.message) || response.message || "Toggle status failed");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || `Failed to ${actionText} user.`;
      setError(errorMsg);
    }
  };

  const handleView = async (user) => {
    setSubmitting(true);
    try {
      const userDetailsResp = await getUserById(user.id);
      const userDetails = userDetailsResp.data || userDetailsResp;
      setViewingUser(userDetails);
      setShowDetailsModal(true);
    } catch {
      setError("Failed to load user details.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setViewingUser(null);
  };

  const handleEdit = async (user) => {
    setSubmitting(true);
    try {
      const userDetailsResp = await getUserById(user.id);
      const userDetails = userDetailsResp.data || userDetailsResp;
      // Only allow DealerStaff and DealerManager roles in the edit modal
      let safeRole = userDetails.role;
      if (safeRole !== "DealerStaff" && safeRole !== "DealerManager") {
        safeRole = "DealerStaff";
      }
      setEditingUser(userDetails);
      setFormData({
        fullName: userDetails.fullName || "",
        email: userDetails.email || "",
        role: safeRole,
        isActive: userDetails.isActive !== undefined ? userDetails.isActive : true,
      });
      setShowModal(true);
      setError("");
      setValidationErrors({});
    } catch {
      setError("Failed to load user details.");
    } finally {
      setSubmitting(false);
    }
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
    setSubmitting(false);
    setError("");
    setValidationErrors({});
  };

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) || (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRole = filterRole ? user.role === filterRole : true;
      const matchesStatus = filterStatus ? user.isActive === (filterStatus === "true") : true;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, filterRole, filterStatus]);

  const sortedAndFilteredUsers = useMemo(() => {
    const sortableUsers = [...filteredUsers];
    sortableUsers.sort((a, b) => {
      let aValue = a[sortColumn];
      let bValue = b[sortColumn];
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortDirection === "asc" ? 1 : -1;
      if (bValue == null) return sortDirection === "asc" ? -1 : 1;
      let comparison = 0;
      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
      } else if (typeof aValue === "boolean" && typeof bValue === "boolean") {
        comparison = aValue === bValue ? 0 : aValue ? 1 : -1;
      } else {
        comparison = String(aValue).toLowerCase().localeCompare(String(bValue).toLowerCase());
      }
      return sortDirection === "asc" ? comparison : comparison * -1;
    });
    return sortableUsers;
  }, [filteredUsers, sortColumn, sortDirection]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, currentPage, pageSize]);
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
  const renderSortIcon = (columnKey) => {
    if (sortColumn !== columnKey) {
      return <i className="bx bx-sort text-muted ms-1 opacity-50 small"></i>;
    }
    return sortDirection === "asc" ? <i className="bx bx-sort-up text-primary ms-1 small"></i> : <i className="bx bx-sort-down text-primary ms-1 small"></i>;
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
      <div className="card">
        <div className="card-header border-bottom bg-white">
          <div className="d-flex justify-content-end mb-3">
            <button
              type="button"
              className="btn btn-primary rounded-pill d-flex align-items-center px-4 py-2"
              style={{ minWidth: 140 }}
              onClick={() => {
                setShowModal(true);
                setSubmitting(false);
              }}
            >
              <Plus size={18} className="me-2" />
              <span className="fw-semibold">Add Staff</span>
            </button>
          </div>
          <div className="d-flex flex-wrap align-items-center mb-2 gap-2" style={{ justifyContent: "flex-start" }}>
            <div style={{ minWidth: 180, maxWidth: 240, flex: "1 1 180px" }}>
              <input type="search" className="form-control" placeholder="Search User" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div style={{ minWidth: 140, maxWidth: 180, flex: "1 1 140px" }}>
              <select className="form-select" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                <option value="">Select Role</option>
                <option value="DealerManager">Dealer Manager</option>
                <option value="DealerStaff">Dealer Staff</option>
              </select>
            </div>
            <div style={{ minWidth: 140, maxWidth: 180, flex: "1 1 140px" }}>
              <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">Select Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div style={{ minWidth: 110, maxWidth: 140, flex: "0 1 110px" }}>
              <select
                className="form-select"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value="10">Show 10</option>
                <option value="25">Show 25</option>
                <option value="50">Show 50</option>
                <option value="100">Show 100</option>
              </select>
            </div>
          </div>
        </div>
        <div className="card-datatable table-responsive">
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
                        <button type="button" className="btn btn-icon btn-text-secondary rounded-pill btn-sm" data-bs-toggle="tooltip" title="View" onClick={() => handleView(user)}>
                          <i className="bx bx-show" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-icon btn-text-secondary rounded-pill btn-sm"
                          data-bs-toggle="tooltip"
                          title="Delete"
                          onClick={() => handleDelete(user.id, user.fullName)}
                        >
                          <i className="bx bx-trash" />
                        </button>
                        <div className="dropdown">
                          <button type="button" className="btn p-0 dropdown-toggle hide-arrow btn-sm" data-bs-toggle="dropdown">
                            <i className="bx bx-dots-vertical-rounded" />
                          </button>
                          <div className="dropdown-menu">
                            <button type="button" className="dropdown-item" onClick={() => handleEdit(user)}>
                              <i className="bx bx-edit-alt me-2" /> Edit
                            </button>
                            <button
                              type="button"
                              className="dropdown-item"
                              onClick={() => handleToggleSuspend(user)}
                              disabled={user.role === "DealerManager"}
                              style={user.role === "DealerManager" ? { opacity: 0.5, pointerEvents: "none" } : {}}
                            >
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
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center p-3 gap-2">
            <small className="text-muted mb-2 mb-md-0">
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
      <StaffUserModal
        show={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        user={editingUser}
        formData={formData || {}}
        onFormChange={handleChange}
        errors={validationErrors}
        submitting={submitting}
      />
      <UserDetailsModal show={showDetailsModal} onClose={handleCloseDetailsModal} user={viewingUser} getRoleBadgeClass={getRoleBadgeClass} formatRoleDisplay={formatRoleDisplay} />
    </>
  );
};

export default StaffManagement;
