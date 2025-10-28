import React from 'react';

// Import lại các hàm helper nếu cần (hoặc truyền giá trị đã format)
const formatOrderId = (id) => `#${id?.slice(-6).toUpperCase() || 'N/A'}`;
const formatDate = (isoString) => isoString ? new Date(isoString).toLocaleString('vi-VN') : 'N/A';
const formatCurrency = (amount) => typeof amount === 'number' ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount) : 'N/A';

// Render Status Badge
const RenderSalesOrderStatus = ({ status }) => {
    let badgeClass = 'secondary';
    switch (status?.toLowerCase()) {
        case 'pending': badgeClass = 'warning'; break;
        case 'processing': badgeClass = 'info'; break;
        case 'shipped': badgeClass = 'primary'; break;
        case 'delivered': badgeClass = 'success'; break;
        case 'cancelled': badgeClass = 'danger'; break;
    }
    return <span className={`badge bg-label-${badgeClass}`}>{status || 'N/A'}</span>;
};

const SalesOrderDetailsModal = ({ show, onClose, order, customerMap = {}, dealerMap = {}, variantMap = {} }) => {
    if (!show || !order) return null;

    // Lấy thông tin từ maps
    const customer = customerMap[order.customerId];
    const dealerName = dealerMap[order.dealerId] || 'N/A';
    const variantName = variantMap[order.variantId] || 'N/A';

    return (
        <>
            <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document"> {/* Dùng modal-lg */}
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Sales Order Details - {formatOrderId(order.id)}</h5>
                            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                {/* Thông tin cơ bản */}
                                <div className="col-md-6 border-end">
                                    <h6>Order Information</h6>
                                    <dl className="row mt-3">
                                        <dt className="col-sm-4">Order #:</dt>
                                        <dd className="col-sm-8">{formatOrderId(order.id)}</dd>

                                        <dt className="col-sm-4">Date:</dt>
                                        <dd className="col-sm-8">{formatDate(order.createdAt || order.updatedAt)}</dd>

                                        <dt className="col-sm-4">Status:</dt>
                                        <dd className="col-sm-8"><RenderSalesOrderStatus status={order.status} /></dd>

                                        <dt className="col-sm-4">Total Amount:</dt>
                                        <dd className="col-sm-8 fw-semibold">{formatCurrency(order.totalAmount)}</dd>

                                         <dt className="col-sm-4">Quotation ID:</dt>
                                        <dd className="col-sm-8"><code>{order.quotationId || 'N/A'}</code></dd>
                                    </dl>
                                </div>
                                {/* Thông tin liên quan */}
                                <div className="col-md-6">
                                     <h6>Related Information</h6>
                                     <dl className="row mt-3">
                                         <dt className="col-sm-4">Customer:</dt>
                                         <dd className="col-sm-8">
                                             {customer ? `${customer.name} (${customer.email})` : (order.customerId || 'N/A')}
                                         </dd>

                                         <dt className="col-sm-4">Dealer:</dt>
                                         <dd className="col-sm-8">{dealerName}</dd>

                                        <dt className="col-sm-4">Vehicle:</dt>
                                        <dd className="col-sm-8">{variantName}</dd>

                                        {/* Hiển thị Quantity và Color nếu có trong API response */}
                                        {order.quantity !== undefined && (
                                            <>
                                                <dt className="col-sm-4">Quantity:</dt>
                                                <dd className="col-sm-8">{order.quantity}</dd>
                                            </>
                                        )}
                                         {order.color && (
                                            <>
                                                <dt className="col-sm-4">Color:</dt>
                                                <dd className="col-sm-8">{order.color}</dd>
                                            </>
                                        )}
                                        {/* Thêm các trường khác nếu API cung cấp (vd: shipping address...) */}
                                     </dl>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Close</button>
                            {/* Có thể thêm nút Print hoặc Mark Delivered ở đây nếu cần */}
                        </div>
                    </div>
                </div>
            </div>
            {show && <div className="modal-backdrop fade show"></div>}
        </>
    );
};

export default SalesOrderDetailsModal;