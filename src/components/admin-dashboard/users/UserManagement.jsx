import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../../services/dashboardService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'DealerStaff',
    isActive: true
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  // Auto-hide alerts after 5 seconds
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

    // Full Name validation
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation (only for new users or when password is provided)
    if (!editingUser || (formData.password && formData.password.trim() !== '')) {
      if (!formData.password || formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
      // Check for at least one uppercase, one lowercase, one number, one special char
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/;
      if (formData.password && !passwordRegex.test(formData.password)) {
        errors.password = 'Password must contain uppercase, lowercase, number, and special character';
      }
    }

    // Phone validation (optional but must be valid if provided)
    if (formData.phoneNumber && formData.phoneNumber.trim() !== '') {
      const phoneRegex = /^[0-9]{10,15}$/;
      if (!phoneRegex.test(formData.phoneNumber.replace(/[\s-]/g, ''))) {
        errors.phoneNumber = 'Phone number must be 10-15 digits';
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
    
    // Clear validation error for this field
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

    // Validate form
    if (!validateForm()) {
      setError('Please fix the validation errors');
      return;
    }

    try {
      if (editingUser) {
        // UPDATE USER
        const updateData = { ...formData };
        
        // Remove password if empty (keep existing password)
        if (!updateData.password || updateData.password.trim() === '') {
          delete updateData.password;
        }
        
        console.log('🔄 Updating user in DB:', editingUser.id);
        console.log('📤 Update data:', { ...updateData, password: updateData.password ? '***' : 'unchanged' });
        
        const response = await updateUser(editingUser.id, updateData);
        
        if (response.success) {
          console.log('✅ User updated successfully in database');
          setSuccess(`User "${formData.fullName}" updated successfully in database`);
          await fetchUsers(); // Refresh from DB
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
        
        console.log('➕ Creating new user in DB');
        console.log('📤 User data:', { ...formData, password: '***' });
        
        const response = await createUser(formData);
        
        if (response.success) {
          console.log('✅ New user created in database:', response.data);
          setSuccess(`User "${formData.fullName}" created successfully! They can now login with their credentials.`);
          await fetchUsers(); // Refresh from DB
          handleCloseModal();
        } else {
          throw new Error(response.message || 'Creation failed');
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Operation failed';
      setError(`Database operation failed: ${errorMsg}`);
      console.error('❌ Submit error:', err);
      
      // Handle specific error cases
      if (errorMsg.toLowerCase().includes('email') && errorMsg.toLowerCase().includes('exists')) {
        setValidationErrors({ email: 'This email is already registered' });
      }
    }
  };

  const handleDelete = async (userId, userName) => {
    const confirmMessage = `⚠️ DELETE USER FROM DATABASE?\n\nUser: ${userName}\n\nThis will permanently remove the user from the database.\nThey will NOT be able to login anymore.\n\nAre you absolutely sure?`;
    
    if (!window.confirm(confirmMessage)) {
      console.log('🚫 Delete cancelled by user');
      return;
    }

    try {
      console.log('🗑️ Deleting user from database:', userId);
      
      const response = await deleteUser(userId);
      
      if (response.data?.success) {
        console.log('✅ User permanently deleted from database');
        setSuccess(`User "${userName}" has been permanently deleted from database. They can no longer login.`);
        await fetchUsers(); // Refresh from DB
      } else {
        throw new Error('Delete operation failed');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete user from database';
      setError(errorMsg);
      console.error('❌ Delete error:', err);
    }
  };

  const handleEdit = (user) => {
    console.log('✏️ Editing user:', user);
    setEditingUser(user);
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      password: '', // Always empty for security
      phoneNumber: user.phoneNumber || '',
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
      phoneNumber: '',
      role: 'DealerStaff',
      isActive: true
    });
    setError('');
    setValidationErrors({});
  };

  const filteredUsers = users.filter(user =>
    (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
    <div className="container-xxl flex-grow-1 container-p-y">
      <h4 className="fw-bold py-3 mb-4">
        User Management
        <small className="text-muted ms-2">({users.length} users in database)</small>
      </h4>

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
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Users List</h5>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} className="me-1" />
            Add User
          </button>
        </div>

        {/* Search */}
        <div className="card-body">
          <div className="input-group mb-3">
            <span className="input-group-text">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      {searchTerm ? 'No users match your search' : 'No users found in database'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>{user.fullName || 'N/A'}</td>
                      <td>{user.email || 'N/A'}</td>
                      <td>{user.phoneNumber || 'N/A'}</td>
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
                      <td>
                        <button 
                          className="btn btn-sm btn-icon btn-outline-primary me-2"
                          onClick={() => handleEdit(user)}
                          title="Edit user"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="btn btn-sm btn-icon btn-outline-danger"
                          onClick={() => handleDelete(user.id, user.fullName)}
                          title="Delete user permanently from database"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {/* Full Name */}
                  <div className="mb-3">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className={`form-control ${validationErrors.fullName ? 'is-invalid' : ''}`}
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      required
                    />
                    {validationErrors.fullName && (
                      <div className="invalid-feedback">{validationErrors.fullName}</div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="user@example.com"
                      required
                    />
                    {validationErrors.email && (
                      <div className="invalid-feedback">{validationErrors.email}</div>
                    )}
                    {!editingUser && (
                      <small className="form-text text-muted">
                        This email will be used for login
                      </small>
                    )}
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label">
                      Password {editingUser ? '(leave blank to keep current)' : '*'}
                    </label>
                    <input
                      type="password"
                      className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={editingUser ? 'Enter new password to change' : 'Min 6 chars with uppercase, lowercase, number, special char'}
                      required={!editingUser}
                    />
                    {validationErrors.password && (
                      <div className="invalid-feedback">{validationErrors.password}</div>
                    )}
                    {!editingUser && (
                      <small className="form-text text-muted">
                        Must contain: uppercase, lowercase, number, special character (@$!%*?&#)
                      </small>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className={`form-control ${validationErrors.phoneNumber ? 'is-invalid' : ''}`}
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="0123456789"
                    />
                    {validationErrors.phoneNumber && (
                      <div className="invalid-feedback">{validationErrors.phoneNumber}</div>
                    )}
                  </div>

                  {/* Role */}
                  <div className="mb-3">
                    <label className="form-label">Role *</label>
                    <select
                      className="form-select"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="Admin">Admin</option>
                      <option value="DealerManager">Dealer Manager</option>
                      <option value="DealerStaff">Dealer Staff</option>
                      <option value="EVMStaff">EVM Staff</option>
                    </select>
                  </div>

                  {/* Active Status */}
                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                    />
                    <label className="form-check-label">
                      Active {!formData.isActive && <span className="text-danger">(User cannot login)</span>}
                    </label>
                  </div>

                  {!editingUser && (
                    <div className="alert alert-info mb-0">
                      <small>
                        <strong>Note:</strong> After creating this user, they can immediately login with their email and password.
                      </small>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    <X size={16} className="me-1" />
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Save size={16} className="me-1" />
                    {editingUser ? 'Update User' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;