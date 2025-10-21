import React from 'react'

export default function DealerDetailsModal({ show, onClose, dealer, renderStatusBadge }) {
    if (!show || !dealer) {
        return null;
    }

    // renderStatusBadge là hàm được truyền từ component cha
    const renderBadge = renderStatusBadge || ((status) => <span>{status ? 'Active' : 'Inactive'}</span>);

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
                            <h5 className="modal-title">Details of {dealer.name}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                                aria-label="Close"
                            ></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
