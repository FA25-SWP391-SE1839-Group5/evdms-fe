// File: components/admin-dashboard/vehicle-inventory/stock/VehicleDetailsModal.jsx
import React from 'react';

// Hàm helper (có thể dùng lại hoặc import)
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

const VehicleDetailsModal = ({ show, onClose, vehicle, variantsMap = {}, dealersMap = {} }) => {
    if (!show || !vehicle) return null;

    const variantName = variantsMap[vehicle.variantId] || 'Unknown';
    const dealerName = dealersMap[vehicle.dealerId] || 'Unassigned / In Stock';

    return (
        <>
            <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Vehicle Details - VIN: {vehicle.vin || 'N/A'}</h5>
                            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
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
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
            {show && <div className="modal-backdrop fade show"></div>}
        </>
    );
};

export default VehicleDetailsModal;