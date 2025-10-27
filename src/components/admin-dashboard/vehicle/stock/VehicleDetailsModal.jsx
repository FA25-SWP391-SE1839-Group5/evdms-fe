import React from 'react';

const RenderVehicleStatus = ({ status }) => {
    let badgeClass = 'secondary';
    switch (status?.toLowerCase()) {
        case 'available': badgeClass = 'success'; break;
        case 'reserved': badgeClass = 'warning'; break;
        case 'sold': badgeClass = 'danger'; break;
        case 'intransit': badgeClass = 'info'; break;
    }
    return <span className={`badge bg-label-${badgeClass}`}>{status || 'N/A'}</span>;
};

// Render Spec Value Helper
const renderSpecValue = (spec) => {
    if (!spec || spec.value === undefined || spec.value === null || spec.value === '') return <span className="text-muted fst-italic">N/A</span>;
    return `${spec.value}${spec.unit ? ` ${spec.unit}` : ''}`;
};

// Render Feature List Helper
const renderFeatureList = (list) => {
    if (!list || list.length === 0) return <span className="text-muted fst-italic">None</span>;
    return (
        <ul className="list-unstyled mb-0 small row row-cols-md-2"> {/* Chia 2 cột */}
            {list.map(f => <li key={f} className="col">- {f.replace(/([A-Z])/g, ' $1').trim()}</li>)}
        </ul>
    );
};


const VehicleDetailsModal = ({ show, onClose, vehicle, variant, dealersMap = {} }) => {
    if (!show || !vehicle) return null;

    const variantName = variant?.name || 'Unknown';
    const dealerName = dealersMap[vehicle.dealerId] || 'Unassigned / In Stock';

    return (
        <>
            <div 
                className={`modal fade ${show ? 'show d-block' : ''}`} 
                tabIndex="-1" 
                style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}
            >
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Vehicle Details - VIN: {vehicle.vin || 'N/A'}</h5>
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={onClose} 
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-5 border-end">
                                    <h6>Stock Information</h6>
                                    <table className="table table-bordered">
                                        <tbody>
                                            <tr>
                                                <th scope="row" style={{ width: '30%' }}>VIN</th>
                                                <td><code>{vehicle.vin || 'N/A'}</code></td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Variant</th>
                                                <td>{variantName} (ID: <code>{vehicle.variantId || 'N/A'}</code>)</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Color</th>
                                                <td>{vehicle.color || '-'}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Type</th>
                                                <td>{vehicle.type || '-'}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Status</th>
                                                <td><RenderVehicleStatus status={vehicle.status} /></td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Assigned Dealer</th>
                                                <td>{dealerName} {vehicle.dealerId ? `(ID: <code>${vehicle.dealerId}</code>)` : ''}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Vehicle Record ID</th>
                                                <td><code>{vehicle.id || 'N/A'}</code></td>
                                            </tr>
                                            {/* Thêm các trường khác nếu API cung cấp (createdAt, updatedAt, ...) */}
                                            {vehicle.createdAt && (
                                                <tr>
                                                    <th scope="row">Created At</th>
                                                    <td>{new Date(vehicle.createdAt).toLocaleString('en-GB')}</td>
                                                </tr>
                                            )}
                                            {vehicle.updatedAt && (
                                                <tr>
                                                    <th scope="row">Last Updated At</th>
                                                    <td>{new Date(vehicle.updatedAt).toLocaleString('en-GB')}</td>
                                                </tr>
                                            )}
                                            {/* Lưu ý: Specs & Features thuộc về Variant, không phải xe cụ thể này */}
                                            {/* Nếu muốn xem Specs/Features, cần thêm nút/link để xem chi tiết Variant */}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="col-md-7">
                                    <h6>Variant Specifications & Features</h6>
                                    {variant ? (
                                        <>
                                            {/* Specs */}
                                            <div className="mb-3">
                                                    <strong>Specifications:</strong>
                                                    {Object.keys(variant.specs || {}).length > 0 ? (
                                                        <ul className="list-unstyled row row-cols-md-2 mt-1 small">
                                                            {Object.entries(variant.specs).map(([key, specObj]) => (
                                                                <li key={key} className="col text-capitalize">
                                                                    {/* Format key cho dễ đọc */}
                                                                    <strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> {renderSpecValue(specObj)}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-muted fst-italic small">No specifications defined for this variant.</p>
                                                    )}
                                            </div>
                                            <hr />
                                            {/* Features */}
                                            <div>
                                                    <strong>Features:</strong>
                                                    {Object.keys(variant.features || {}).length > 0 ? (
                                                        Object.entries(variant.features).map(([category, featureList]) => (
                                                            <div key={category} className="mt-2">
                                                                <p className="mb-1"><strong>{category}:</strong></p>
                                                                {renderFeatureList(featureList)}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-muted fst-italic small">No features defined for this variant.</p>
                                                    )}
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-warning">Variant details not found.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {show && <div className="modal-backdrop fade show"></div>}
        </>
    );
};

export default VehicleDetailsModal;