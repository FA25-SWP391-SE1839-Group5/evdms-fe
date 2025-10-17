import React from 'react'

export default function UserModal({ show, onClose, onSubmit, user, formData, onFormChange, errors}) {
  if (!show) {
    return null;
  }
  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">
                        {user ? 'Edit User' : 'Add New User'}
                    </h5>
                    <button type="button" className="btn-close" onClick={onClose}></button>
                </div>
                <form onSubmit={onSubmit}>
                <div className="modal-body">
                  {/* Full Name */}
                  <div className="mb-3">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                      name="fullName"
                      value={formData.fullName}
                      onChange={onFormChange}
                      placeholder="Enter full name"
                      required
                    />
                    {errors.fullName && (
                      <div className="invalid-feedback">{errors.fullName}</div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      name="email"
                      value={formData.email}
                      onChange={onFormChange}
                      placeholder="user@example.com"
                      required
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label">
                      Password {user ? '(leave blank to keep current)' : '*'}
                    </label>
                    <input
                      type="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      name="password"
                      value={formData.password}
                      onChange={onFormChange}
                      placeholder={user ? 'Enter new password' : 'Min 6 characters'}
                      required={!user}
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                    {!user && (
                      <small className="form-text text-muted">
                        Must contain: uppercase, lowercase, number, special character
                      </small>
                    )}
                  </div>

                  {/* Role */}
                  <div className="mb-3">
                    <label className="form-label">Role *</label>
                    <select
                      className="form-select"
                      name="role"
                      value={formData.role}
                      onChange={onFormChange}
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
                      onChange={onFormChange}
                    />
                    <label className="form-check-label">
                      Active {!formData.isActive && <span className="text-danger">(User cannot login)</span>}
                    </label>
                  </div>
                  <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {user ? 'Update User' : 'Create User'}
                  </button>
                </div>
                </div>
              </form>

                  
            </div>
        </div>
    </div>
  )
}
