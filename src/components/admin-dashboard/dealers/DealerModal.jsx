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

                                {/* Form Group: Region */}
                                <div className="mb-3">
                                    <label htmlFor="region" className="form-label">Region *</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors?.region ? 'is-invalid' : ''}`}
                                        id="region"
                                        name="region"
                                        value={formData.region || ''}
                                        onChange={onFormChange}
                                        placeholder="E.g., Ho Chi Minh City"
                                    />
                                    {errors?.region && <div className="invalid-feedback">{errors.region}</div>}
                                </div>

                                {/* Form Group: Address */}
                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label">Address *</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors?.address ? 'is-invalid' : ''}`}
                                        id="address"
                                        name="address"
                                        value={formData.address || ''}
                                        onChange={onFormChange}
                                        placeholder="E.g., 100 Nguyen Van Cu, District 1"
                                    />
                                    {errors?.address && <div className="invalid-feedback">{errors.address}</div>}
                                </div>

                                {/* Form Group: Status (isActive) */}
                                <div className="form-check form-switch mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="isActive"
                                        name="isActive"
                                        checked={formData.isActive || false}
                                        onChange={onFormChange}
                                    />
                                    <label className="form-check-label" htmlFor="isActive">
                                        {formData.isActive ? 'Active' : 'Inactive'}
                                    </label>
                                </div>
                                <div className="modal-footer">
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-secondary" 
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                    >
                                        {dealer ? 'Update Dealer' : 'Create Dealer'}
                                    </button>
                                </div>
                            </div>    
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
