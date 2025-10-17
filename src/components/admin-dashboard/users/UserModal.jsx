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
                  </div>

                  
            </div>
        </div>
    </div>
  )
}
