import React, { useState, useEffect } from 'react';
import { getQuotationById } from '../../../services/dashboardService';

// --- Helper Functions (Copy từ QuotationManagement) ---
const formatQuoteId = (id) => `#${id?.slice(-6).toUpperCase() || 'N/A'}`;
const formatDate = (isoString) => isoString ? new Date(isoString).toLocaleString('vi-VN') : 'N/A';
const formatCurrency = (amount) => typeof amount === 'number' ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount) : 'N/A';

const RenderQuotationStatus = ({ status }) => {
    let badgeClass = 'secondary';
    const st = String(status).toLowerCase();
    switch (st) {
        case 'pending': badgeClass = 'warning'; break;
        case 'accepted': badgeClass = 'success'; break;
        case 'expired': badgeClass = 'danger'; break;
        case 'draft': badgeClass = 'info'; break;
    }
    return <span className={`badge bg-label-${badgeClass}`}>{status || 'N/A'}</span>;
};
// --- End Helper Functions ---

const QuotationDetailsModal = ({ show, onClose, quoteId, customerMap = {}, dealerMap = {}, variantMap = {} }) => {
    const [quoteDetails, setQuoteDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch chi tiết báo giá khi modal mở
    useEffect(() => {
        if (show && quoteId) {
            const fetchQuoteDetails = async () => {
                setLoading(true);
                setError('');
                setQuoteDetails(null);
                try {
                    // Gọi API GET /api/quotations/{id}
                    const response = await getQuotationById(quoteId); //
                    
                    // Giả định API trả về { success: true, data: {...} } hoặc { data: {...} }
                    const data = response.data?.data || response.data;
                    if (response.data?.success === false || !data) {
                        throw new Error(response.data?.message || 'Failed to load quotation details');
                    }
                    setQuoteDetails(data);
                } catch (err) {
                    setError(err.response?.data?.message || err.message || 'Could not load details.');
                } finally {
                    setLoading(false);
                }
            };
            fetchQuoteDetails();
        }
    }, [show, quoteId]); // Trigger khi 'show' hoặc 'quoteId' thay đổi

    if (!show) return null;

    // Lấy thông tin từ object chi tiết (nếu đã load xong) hoặc từ map (hiển thị tạm)
    const data = quoteDetails || {}; // Dùng data chi tiết nếu có
    const customer = customerMap[data.customerId];
    const dealerName = dealerMap[data.dealerId] || 'N/A';
    const variantName = variantMap[data.variantId] || 'N/A';

    return (
        <>
            <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
                <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Quotation Details - {formatQuoteId(quoteId)}</h5>
                            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {loading && (
                                <div className="text-center p-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading details...</span>
                                    </div>
                                </div>
                            )}
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    Error: {error}
                                </div>
                            )}
                            {quoteDetails && !loading && ( // Chỉ hiển thị khi load xong
                                <div className="row">
                                    {/* Cột 1: Thông tin báo giá */}
                                    <div className="col-md-6 border-end">
                                        <h6>Quotation Info</h6>
                                        <dl className="row mt-3">
                                            <dt className="col-sm-4">Quote #:</dt>
                                            <dd className="col-sm-8">{formatQuoteId(quoteDetails.id)}</dd>

                                            <dt className="col-sm-4">Date Created:</dt>
                                            <dd className="col-sm-8">{formatDate(quoteDetails.createdAt)}</dd>
                                            
                                            <dt className="col-sm-4">Valid Until:</dt>
                                            <dd className="col-sm-8">{formatDate(quoteDetails.validUntil)}</dd>

                                            <dt className="col-sm-4">Status:</dt>
                                            <dd className="col-sm-8"><RenderQuotationStatus status={quoteDetails.status} /></dd>

                                            <dt className="col-sm-4">Base Price:</dt>
                                            <dd className="col-sm-8">{formatCurrency(quoteDetails.basePrice)}</dd>
                                            
                                            <dt className="col-sm-4">Final Price:</dt>
                                            <dd className="col-sm-8 fw-semibold">{formatCurrency(quoteDetails.finalPrice)}</dd>
                                            
                                            {/* Thêm các trường khác nếu có, vd: discount, tax... */}
                                        </dl>
                                    </div>
                                    {/* Cột 2: Thông tin liên quan */}
                                    <div className="col-md-6">
                                        <h6>Related Information</h6>
                                        <dl className="row mt-3">
                                            <dt className="col-sm-4">Customer:</dt>
                                            <dd className="col-sm-8">
                                                {customer ? `${customer.name} (${customer.email})` : (quoteDetails.customerId || 'N/A')}
                                            </dd>
                                            
                                            <dt className="col-sm-4">Created By:</dt>
                                            <dd className="col-sm-8">{dealerName}</dd> {/* Giả định dealerId là đại lý tạo */}

                                            <dt className="col-sm-4">Vehicle:</dt>
                                            <dd className="col-sm-8">{variantName}</dd>
                                            
                                            <dt className="col-sm-4">Color:</dt>
                                            <dd className="col-sm-8">{quoteDetails.color || '-'}</dd>
                                            
                                            {/* Hiển thị chi tiết Options/Features nếu API trả về */}
                                            {quoteDetails.options && (
                                                <>
                                                    <dt className="col-sm-4">Options:</dt>
                                                    <dd className="col-sm-8">
                                                        <pre style={{ maxHeight: '150px', overflowY: 'auto', fontSize: '0.8rem' }}>
                                                            {JSON.stringify(quoteDetails.options, null, 2)}
                                                        </pre>
                                                    </dd>
                                                </>
                                            )}
                                        </dl>
                                    </div>
                                </div>
                            )}
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

export default QuotationDetailsModal;