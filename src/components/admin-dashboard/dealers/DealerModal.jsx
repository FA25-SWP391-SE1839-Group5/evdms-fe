import React from 'react'

export default function DealerModal({ show, onClose, onSubmit, dealer, formData, onFormChange, errors }) {
    if (!show) return null;

    const title = dealer ? `Edit Dealer: ${dealer.name}` : 'Add New Dealer';

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
                        <form onSubmit={onSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title">{title}</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={onClose} 
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                {/* Form Group: Name */}
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Dealer Name *</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors?.name ? 'is-invalid' : ''}`}
                                        id="name"
                                        name="name"
                                        value={formData.name || ''}
                                        onChange={onFormChange}
                                        placeholder="E.g., EV Motors Saigon"
                                    />
                                    {errors?.name && <div className="invalid-feedback">{errors.name}</div>}
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </>
    )
}
