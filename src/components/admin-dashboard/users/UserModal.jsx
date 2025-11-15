export default function UserModal({ show, onClose, onSubmit, user, formData, onFormChange, errors, dealers, submitting }) {
  if (!show) {
    return null;
  }

  const isEditMode = Boolean(user);
  const shouldShowDealerSelect = ["DealerStaff", "DealerManager"].includes(formData?.role);

  return (
    <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex="-1" style={{ backgroundColor: show ? "rgba(0,0,0,0.5)" : "transparent" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{user ? "Edit User" : "Add New User"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={onSubmit}>
            <div className="modal-body">
              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                  name="fullName"
                  value={formData.fullName || ""}
                  onChange={onFormChange}
                  placeholder="Enter full name"
                  required
                />
                {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  name="email"
                  value={formData.email}
                  onChange={onFormChange}
                  placeholder="user@example.com"
                  required
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              {/* Role */}
              <div className="mb-3">
                <label className="form-label">Role *</label>
                <select className="form-select" name="role" value={formData.role || "DealerStaff"} onChange={onFormChange} required>
                  <option value="Admin">Admin</option>
                  <option value="DealerManager">Dealer Manager</option>
                  <option value="DealerStaff">Dealer Staff</option>
                  <option value="EVMStaff">EVM Staff</option>
                </select>
              </div>

              {/* 3. THÊM Ô CHỌN DEALER (hiển thị có điều kiện) */}
              {shouldShowDealerSelect && (
                <div className="mb-3">
                  <label htmlFor="dealerId" className="form-label">
                    Assigned Dealer {!isEditMode ? "*" : ""} {/* Bắt buộc khi tạo mới */}
                  </label>
                  <select
                    id="dealerId"
                    name="dealerId"
                    className={`form-select ${errors?.dealerId ? "is-invalid" : ""}`}
                    value={formData?.dealerId || ""}
                    onChange={onFormChange}
                    required={!isEditMode && shouldShowDealerSelect}
                    // Always enabled
                  >
                    <option value="">-- Select Dealer --</option>
                    {dealers &&
                      dealers.map((dealer) => (
                        <option key={dealer.id} value={dealer.id}>
                          {dealer.name}
                        </option>
                      ))}
                  </select>
                  {errors?.dealerId && <div className="invalid-feedback">{errors.dealerId}</div>}
                  {(!dealers || dealers.length === 0) && <div className="form-text text-warning">Loading dealers or no dealers available...</div>}
                </div>
              )}

              {/* Active Status */}
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="isActive"
                  id="userIsActiveSwitch"
                  checked={formData?.isActive === undefined ? true : formData.isActive}
                  onChange={onFormChange}
                />
                <label className="form-check-label">Active {!formData.isActive && <span className="text-danger">(User cannot login)</span>}</label>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{isEditMode ? "Update User" : "Create User"}</>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
