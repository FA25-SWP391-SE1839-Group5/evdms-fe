import React from 'react'

export default function UserDetailsModal({ show, onClose, user, getRoleBadgeClass, formatRoleDisplay }) {
    if (!show || !user) {
        return null;
    }

    const getBadgeClass = getRoleBadgeClass || (() => 'secondary');
    const formatRole = formatRoleDisplay || ((role) => role);

    return (
        <>
            <div 
                className={`modal fade ${show ? 'show' : ''}`} 
                style={{ display: show ? 'block' : 'none' }} 
                tabIndex="-1" 
                role="dialog"
            >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Details of {user.fullName}</h5>
                            <button 
                                type="button"
                                className="btn-close" 
                                onClick={onClose} 
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <table className="table table-borderless">
                                <tbody>
                                    <tr>
                                        <td className="ps-0" style={{width: '30%'}}><strong>Name:</strong></td>
                                        <td>{user.fullName || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td className="ps-0"><strong>Email:</strong></td>
                                        <td>{user.email || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td className="ps-0"><strong>Role:</strong></td>
                                        <td>
                                            <span className={`badge bg-label-${getBadgeClass(user.role)}`}>
                                                {formatRole(user.role)}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="ps-0"><strong>Status:</strong></td>
                                        <td>
                                            <span className={`badge bg-label-${user.isActive ? 'success' : 'secondary'}`}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="ps-0"><strong>User ID:</strong></td>
                                        <td><code className="text-muted">{user.id || 'N/A'}</code></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button 
                                type="button" 
                                className="btn btn-secondary" 
                                onClick={onClose}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
                
            {/* Modal Backdrop */}
            {show && <div className="modal-backdrop fade show"></div>}
        </>
    )
}
