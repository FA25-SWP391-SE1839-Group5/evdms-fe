import React, { useState, useEffect, useMemo } from 'react';
import { Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../../services/dashboardService';
import UserModal from './UserModal';

// Import các thư viện export
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [filterRole, setFilterRole] = useState('');
  const [filterPlan, setFilterPlan] = useState(''); 
  const [filterStatus, setFilterStatus] = useState(''); 

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'DealerStaff',
    isActive: true
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const fetchUsers = async () => {
  try {
    setLoading(true);
    const response = await getAllUsers();
    setUsers(response.data || []);
  } catch (err) {
    setError(err.message || 'Failed to load users');
    setUsers([]);
  } finally {
    setLoading(false);
  }
};


  const validateForm = () => {
    const errors = {};

    if (!formData.fullName || formData.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!editingUser || (formData.password && formData.password.trim() !== '')) {
      if (!formData.password || formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/;
      if (formData.password && !passwordRegex.test(formData.password)) {
        errors.password = 'Password must contain uppercase, lowercase, number, and special character';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setError('Please fix the validation errors');
      return;
    }

    try {
      if (editingUser) {
        // UPDATE USER
        const updateData = { ...formData };
        
        if (!updateData.password || updateData.password.trim() === '') {
          delete updateData.password;
        }
        
        const response = await updateUser(editingUser.id, updateData);
        
        if (response.success) {
          setSuccess(`User "${formData.fullName}" updated successfully`);
          await fetchUsers();
          handleCloseModal();
        } else {
          throw new Error(response.message || 'Update failed');
        }
      } else {
        // CREATE NEW USER
        if (!formData.password || formData.password.trim() === '') {
          setError('Password is required for new users');
          return;
        }
        
        const response = await createUser(formData);
        
        if (response.success) {
          setSuccess(`User "${formData.fullName}" created successfully! They can now login with their credentials.`);
          await fetchUsers();
          handleCloseModal();
        } else {
          throw new Error(response.message || 'Creation failed');
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Operation failed';
      setError(`Database operation failed: ${errorMsg}`);
      
      if (errorMsg.toLowerCase().includes('email') && errorMsg.toLowerCase().includes('exists')) {
        setValidationErrors({ email: 'This email is already registered' });
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
        await fetchUsers();
      } else {
        throw new Error('Delete operation failed');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete user';
      setError(errorMsg);
    }
  };

  // START: HÀM MỚI ĐỂ SUSPEND/ACTIVATE USER
  const handleToggleSuspend = async (userToToggle) => {
    const actionText = userToToggle.isActive ? 'suspend' : 'activate';
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
        await fetchUsers(); // Tải lại danh sách
      } else {
        throw new Error(response.message || 'Toggle status failed');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || `Failed to ${actionText} user.`;
      setError(errorMsg);
    }
  };
  // END: HÀM MỚI

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      password: '',
      role: user.role || 'DealerStaff',
      isActive: user.isActive !== undefined ? user.isActive : true
    });
    setShowModal(true);
    setError('');
    setValidationErrors({});
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      fullName: '',
      email: '',
      password: '',
      role: 'DealerStaff',
      isActive: true
    });
    setError('');
    setValidationErrors({});
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = (
        (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      const matchesRole = filterRole ? user.role === filterRole : true;
      const matchesStatus = filterStatus ? user.isActive === (filterStatus === 'true') : true;
      // const matchesPlan = filterPlan ? user.plan === filterPlan : true;
      
      return matchesSearch && matchesRole && matchesStatus; // && matchesPlan;
    });
  }, [users, searchTerm, filterRole, filterStatus, filterPlan]);

  // START: Logic Phân trang
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
  // END: Logic Phân trang

  const getRoleBadgeClass = (role) => {
    const roleMap = {
      'Admin': 'danger',
      'DealerManager': 'warning',
      'DealerStaff': 'info',
      'EVMStaff': 'primary'
    };
    return roleMap[role] || 'secondary';
  };

  const formatRoleDisplay = (role) => {
    const roleDisplayMap = {
      'Admin': 'Admin',
      'DealerManager': 'Dealer Manager',
      'DealerStaff': 'Dealer Staff',
      'EVMStaff': 'EVM Staff'
    };
    return roleDisplayMap[role] || role;
  };

  const handleExport = (format) => {
    const exportData = filteredUsers.map(user => ({
      "Full Name": user.fullName,
      "Email": user.email,
      "Role": formatRoleDisplay(user.role),
      "Status": user.isActive ? 'Active' : 'Inactive'
    }));

    switch (format) {
      case 'pdf': {
        const doc = new jsPDF();
        doc.text("User List", 14, 16);
        autoTable(doc, { 
          head: [["Full Name", "Email", "Role", "Status"]],
          body: exportData.map(Object.values),
          startY: 20,
        });
        doc.save('users-list.pdf');
        break;
      }
        
      case 'excel': {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Users");
        XLSX.writeFile(wb, "users-list.xlsx");
        break;
      }

      case 'csv': {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const csv = XLSX.utils.sheet_to_csv(ws);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'users-list.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;
      }

      case 'print': {
        const doc = new jsPDF();
        doc.text("User List", 14, 16);
        autoTable(doc, { 
          head: [["Full Name", "Email", "Role", "Status"]],
          body: exportData.map(Object.values),
          startY: 20,
        });
        doc.autoPrint();
        doc.output('dataurlnewwindow');
        break;
      }
        
      case 'copy': {
        const textToCopy = [
          Object.keys(exportData[0]).join('\t'),
          ...exportData.map(row => Object.values(row).join('\t'))
        ].join('\n');

        navigator.clipboard.writeText(textToCopy).then(() => {
          setSuccess('Đã sao chép dữ liệu vào clipboard!');
        }, (err) => {
          setError('Không thể sao chép dữ liệu.');
        });
        break;
      }

      default:
        break;
    }
  };


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading users from database...</span>
        </div>
      </div>
    );
  }

  return (
   <>
      <h4 className="fw-bold py-3 mb-4">
        <span className="text-muted fw-light">User Management /</span> 
        {activeTab === 'roles' ? ' Roles & Permissions ' : ' User Accounts '}
      </h4>

      {/* Tab Navigation */}
      <div className="row">
        <div className="col-md-12">
          <ul className="nav nav-pills flex-column flex-md-row mb-3">
            <li className="nav-item">
              <a 
                className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveTab('users'); }}
              >
                <i className="bx bx-user me-1" /> Users List
              </a>
            </li>
            <li className="nav-item">
              <a 
                className={`nav-link ${activeTab === 'roles' ? 'active' : ''}`}
                href="#"
                onClick={(e) => { e.preventDefault(); setActiveTab('roles'); }}
              >
                <i className="bx bx-lock-alt me-1" /> Roles & Permissions
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Alert messages */}
      {error && (
        <div className="alert alert-danger alert-dismissible d-flex align-items-center" role="alert">
          <AlertCircle size={20} className="me-2" />
          <div className="flex-grow-1">{error}</div>
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}
      {success && (
        <div className="alert alert-success alert-dismissible d-flex align-items-center" role="alert">
          <CheckCircle size={20} className="me-2" />
          <div className="flex-grow-1">{success}</div>
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      {/* Card */}
      {activeTab === 'users' ? (
        <div className="card">
            <div className="card-header border-bottom">
                <h5 className="card-title mb-3">Search Filters</h5>
                <div className="d-flex justify-content-between align-items-center row pb-2 gap-3 gap-md-0">
                    <div className="col-md-4">
                        <select 
                          className="form-select"
                          value={filterRole}
                          onChange={(e) => setFilterRole(e.target.value)}
                        >
                            <option value="">Select Role</option>
                            <option value="Admin">Admin</option>
                            <option value="DealerManager">Dealer Manager</option>
                            <option value="DealerStaff">Dealer Staff</option>
                            <option value="EVMStaff">EVM Staff</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <select 
                          className="form-select"
                          value={filterPlan}
                          onChange={(e) => setFilterPlan(e.target.value)}
                        >
                            <option value="">Select Plan</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <select 
                          className="form-select"
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                        >
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
                        <select className="form-select">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <div className="col-md-10 d-flex align-items-center justify-content-end gap-2">
                        <input
                            type="search"
                            className="form-control w-50"
                            placeholder="Search User"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn btn-secondary dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className='bx bx-export me-1'></i> Export
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button type="button" className="dropdown-item" onClick={() => handleExport('print')}>
                                <i className='bx bx-printer me-2'></i> Print
                              </button>
                            </li>
                            <li>
                              <button type="button" className="dropdown-item" onClick={() => handleExport('csv')}>
                                <i className='bx bx-file me-2'></i> Csv
                              </button>
                            </li>
                            <li>
                              <button type="button" className="dropdown-item" onClick={() => handleExport('excel')}>
                                <i className='bx bx-file-blank me-2'></i> Excel
                              </button>
                            </li>
                            <li>
                              <button type="button" className="dropdown-item" onClick={() => handleExport('pdf')}>
                                <i className='bx bxs-file-pdf me-2'></i> Pdf
                              </button>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                              <button type="button" className="dropdown-item" onClick={() => handleExport('copy')}>
                                <i className='bx bx-copy me-2'></i> Copy
                              </button>
                            </li>
                          </ul>
                        </div>

                        <button
                          type="button"
                          className="btn btn-primary rounded-pill d-flex align-items-center px-3 py-2"
                          onClick={() => setShowModal(true)}
                        >
                          <Plus size={18} className="me-2" />
                          <span className="fw-semibold">Add User</span>
                        </button>
                    </div>
                </div>
            
                <table className="table">
                    <thead>
                        <tr>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="table-border-bottom-0">
                        {filteredUsers.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center py-4">
                            {searchTerm ? 'No users match your search' : 'No users found'}
                            </td>
                        </tr>
                        ) : (
                        filteredUsers.map(user => (
                            <tr key={user.id}>
                            <td>{user.fullName || 'N/A'}</td>
                            <td>{user.email || 'N/A'}</td>
                            <td>
                                <span className={`badge bg-label-${getRoleBadgeClass(user.role)}`}>
                                {formatRoleDisplay(user.role)}
                                </span>
                            </td>
                            <td>
                                <span className={`badge bg-label-${user.isActive ? 'success' : 'secondary'}`}>
                                {user.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </td>

                            {/* START: CỘT ACTIONS MỚI */}
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

                                  {/* 2. Nút Xem (Con mắt) - Chưa có logic */}
                                  <button 
                                    type="button" 
                                    className="btn btn-icon btn-text-secondary rounded-pill btn-sm"
                                    data-bs-toggle="tooltip" 
                                    title="View"
                                  >
                                    <i className="bx bx-show" /> 
                                  </button>

                                  {/* 3. Nút Menu (Ba chấm) */}
                                  <div className="dropdown">
                                    <button 
                                      type="button" 
                                      className="btn p-0 dropdown-toggle hide-arrow btn-sm" 
                                      data-bs-toggle="dropdown"
                                    >
                                      <i className="bx bx-dots-vertical-rounded" />
                                    </button>
                                    <div className="dropdown-menu">
                                      <button type="button" className="dropdown-item" onClick={() => handleEdit(user)}>
                                        <i className="bx bx-edit-alt me-2" /> Edit
                                      </button>
                                      
                                      <button type="button" className="dropdown-item" onClick={() => handleToggleSuspend(user)}>
                                        {user.isActive 
                                          ? <><i className="bx bx-block me-2" /> Suspend</>
                                          : <><i className="bx bx-check-circle me-2" /> Activate</>
                                        }
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            {/* END: CỘT ACTIONS MỚI */}

                            </tr>
                        ))
                        )}
                    </tbody>
                </table>
            </div>

          </div>
      ) : (
        <div className="card">
          <h5 className="card-header">Roles & Permissions</h5>
          <div className="card-body">
            <p className="mb-0">Roles and permissions management - Coming soon...</p>
          </div>
        </div>
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
      />
    </>
  );
};

export default UserManagement;