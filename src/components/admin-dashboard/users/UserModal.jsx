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
                        {editingUser ? 'Edit User' : 'Add New User'}
                    </h5>
                    <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                </div>
            </div>
        </div>
    </div>
  )
}
