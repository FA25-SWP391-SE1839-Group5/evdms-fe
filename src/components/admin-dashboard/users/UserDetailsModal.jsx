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
                    <div className="modal-content"></div>
                        <div className="modal-header">
                            <h5 className="modal-title">Details of {user.fullName}</h5>
                            <button 
                                type="button"
                                className="btn-close" 
                                onClick={onClose} 
                                aria-label="Close"
                            ></button>
                        </div>
                </div>
        </>
    )
}
