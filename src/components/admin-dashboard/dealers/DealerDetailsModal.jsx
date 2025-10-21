import React from 'react'

export default function DealerDetailsModal({ show, onClose, dealer, renderStatusBadge }) {
    if (!show || !dealer) {
        return null;
    }

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
                        <div className="modal-body">
                            <table className="table table-borderless">
                                <tbody>
                                    <tr>
                                        <td className="ps-0" style={{width: '30%'}}><strong>Name:</strong></td>
                                        <td>{dealer.name || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td className="ps-0"><strong>Region:</strong></td>
                                        <td>{dealer.region || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td className="ps-0"><strong>Address:</strong></td>
                                        <td>{dealer.address || 'N/A'}</td>
                                    </tr>
                                    <tr>
                                        <td className="ps-0"><strong>Status:</strong></td>
                                        <td>
                                            {renderBadge(dealer.isActive)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="ps-0"><strong>Dealer ID:</strong></td>
                                        <td><code className="text-muted">{dealer.id || 'N/A'}</code></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
