import React, { useState, useEffect, useMemo } from 'react';
import { AlertCircle, CheckCircle, Plus, Edit, Trash, FileText } from 'lucide-react';
import { getAllDealerOrders, deleteDealerOrder, getAllDealers, getAllVehicleVariants } from '../../../../services/dealerService';
import DealerOrderModal from './DealerOrderModal';

// --- Helper Functions ---
const formatOrderId = (id) => {
    // Chỉ hiển thị vài ký tự cuối của ID cho gọn
    return `#${id?.slice(-6).toUpperCase() || 'N/A'}`; 
};

const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString('en-GB'); // Format en-GB: DD/MM/YYYY, HH:MM:SS
};

// Render Status Badge based on API status
const RenderOrderStatus = ({ status }) => {
    let badgeClass = 'secondary'; // Default
    switch (status?.toLowerCase()) {
        case 'pending': badgeClass = 'warning'; break;
        case 'processing': badgeClass = 'info'; break;
        case 'shipped': badgeClass = 'primary'; break;
        case 'delivered': badgeClass = 'success'; break;
        case 'cancelled': badgeClass = 'danger'; break;
    }
    return <span className={`badge bg-label-${badgeClass}`}>{status || 'N/A'}</span>;
};

export default function DealerOrderManagement() {
    const [orders, setOrders] = useState([]);
    const [dealers, setDealers] = useState([]);
    const [dealerMap, setDealerMap] = useState({});

    const [variantMap, setVariantMap] = useState({});
    const [loadingData, setLoadingData] = useState(true); // Đổi tên state loading chính

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showFormModal, setShowFormModal] = useState(false);
    const [orderToEdit, setOrderToEdit] = useState(null);

    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterOrderId, setFilterOrderId] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterDealer, setFilterDealer] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [globalSearch, setGlobalSearch] = useState('');

    // fetchData to load 3 API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingData(true); 
                setError(''); 

                // Fetch Orders, Dealers, và Variants
                const [ordersRes, dealersRes, variantsRes] = await Promise.all([
                    getAllDealerOrders(),
                    getAllDealers(),
                    getAllVehicleVariants(), 
                ]);

                // Handle Orders
                setOrders(ordersRes.data?.data?.items || ordersRes.data?.items || ordersRes.data || []);

                // Handle Dealers và Dealer Map
                const dealerList = dealersRes.data?.data?.items || dealersRes.data?.items || dealersRes.data || [];
                setDealers(dealerList);
                const dMap = dealerList.reduce((acc, dealer) => {
                    acc[dealer.id] = dealer.name; return acc;
                }, {});
                setDealerMap(dMap);

                // Handle Variants và Variant Map
                const variantList = variantsRes.data?.data?.items || variantsRes.data?.items || variantsRes.data || [];
                const vMap = variantList.reduce((acc, variant) => {
                    acc[variant.id] = variant.name; return acc;
                }, {});
                setVariantMap(vMap); 

            } catch (err) {
                console.error("Failed to load data:", err);
                const errorMsg = err.response?.data?.message || err.message || 'Failed to load page data';
                if (err.config?.url?.includes('vehicle-variants')) {
                     setError(`Failed to load vehicle variants: ${errorMsg}`);
                } else {
                     setError(errorMsg);
                }
            } finally {
                setLoadingData(false); 
            }
        };
        fetchData();
    }, []);

    // Auto-hide alerts
    useEffect(() => {
        if (error || success) {
          const timer = setTimeout(() => { setError(''); setSuccess(''); }, 5000);
          return () => clearTimeout(timer);
        }
    }, [error, success]);

    // Filter Logic
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const orderId = formatOrderId(order.id).toLowerCase();
            const date = formatDate(order.createdAt || order.updatedAt).toLowerCase(); // Giả sử có createdAt
            const dealerName = (dealerMap[order.dealerId] || '').toLowerCase();
            const status = (order.status || '').toLowerCase();
            const variantName = (variantMap[order.variantId] || '').toLowerCase();
            const color = (order.color || '').toLowerCase();
            const quantity = String(order.quantity || '').toLowerCase();

            // Global search first
            if (globalSearch) {
                const searchTermLower = globalSearch.toLowerCase();
                if (
                    !orderId.includes(searchTermLower) &&
                    !date.includes(searchTermLower) &&
                    !dealerName.includes(searchTermLower) &&
                    !status.includes(searchTermLower) &&
                    !variantName.includes(searchTermLower) &&
                    !color.includes(searchTermLower) &&
                    !quantity.includes(searchTermLower)
                ) {
                    return false; // Skip if global search doesn't match
                }
            }

            // Then specific column filters
            const matchesId = filterOrderId === '' || orderId.includes(filterOrderId.toLowerCase());
            const matchesDate = filterDate === '' || date.includes(filterDate.toLowerCase());
            const matchesDealer = filterDealer === '' || dealerName.includes(filterDealer.toLowerCase());
            const matchesStatus = filterStatus === '' || status === filterStatus.toLowerCase();

            return matchesId && matchesDate && matchesDealer && matchesStatus;
        });
    }, [
        orders, 
        dealerMap, 
        variantMap,
        globalSearch,
        filterOrderId, 
        filterDate, 
        filterDealer, 
        filterStatus
    ]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredOrders.length / pageSize);
    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredOrders.slice(startIndex, startIndex + pageSize);
    }, [filteredOrders, currentPage, pageSize]);
    const startEntry = filteredOrders.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endEntry = Math.min(currentPage * pageSize, filteredOrders.length);

    // Handlers
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setCurrentPage(1); 
        switch (name) {
            case 'filterOrderId': setFilterOrderId(value); break;
            case 'filterDate': setFilterDate(value); break;
            case 'filterDealer': setFilterDealer(value); break;
            case 'filterStatus': setFilterStatus(value); break;
            case 'globalSearch': setGlobalSearch(value); break;
            default: break;
        }
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleAdd = () => {
        setOrderToEdit(null);
        setShowFormModal(true);
    };
    const handleSaveSuccess = async (isEdit) => {
        setShowFormModal(false);
        setOrderToEdit(null);
        setSuccess(isEdit ? 'Order updated successfully!' : 'Order created successfully!');
        try {
            const ordersRes = await getAllDealerOrders();
            setOrders(ordersRes.data?.data?.items || []);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to reload orders');
        }
    };
    const handleEdit = (orderId) => {
        const order = orders.find(o => o.id === orderId);
        if (order) {
            setOrderToEdit(order);
            setShowFormModal(true);
        }
    };
    const handleDelete = async (orderId) => {
        const orderNum = formatOrderId(orderId);
        const confirmMessage = `Are you sure you want to delete Order ${orderNum}?`;
        if (!window.confirm(confirmMessage)) return;
        try {
            await deleteDealerOrder(orderId);
            setSuccess(`Order ${orderNum} deleted successfully.`);
            const ordersRes = await getAllDealerOrders();
            setOrders(ordersRes.data?.data?.items || []);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to delete order');
        }
    };

    if (loading) { /* ... loading spinner ... */ 
        return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
    }

    return (
        <>
            <h4 className="fw-bold py-3 mb-4">
              <span className="text-muted fw-light">Dealers /</span> Dealer Orders
            </h4>

            {/* Alert Message */}
            {error && ( /* ... error alert ... */ 
                <div className="alert alert-danger alert-dismissible d-flex align-items-center mb-4" role="alert">
                    <AlertCircle size={20} className="me-2" /><div className="flex-grow-1">{error}</div>
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
            )}
            {success && ( /* ... success alert ... */ 
                <div className="alert alert-success alert-dismissible d-flex align-items-center mb-4" role="alert">
                    <CheckCircle size={20} className="me-2" /><div className="flex-grow-1">{success}</div>
                    <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                </div>
            )}

            <div className="card">
                {/* Header: Search, Entries, Export, Add */}
                <div className="card-header border-bottom">
                    <div className="d-flex justify-content-between align-items-center row py-3 gap-3 gap-md-0">
                        <div className="col-md-4">
                            <input 
                                type="search" 
                                name="globalSearch"
                                value={globalSearch}
                                onChange={handleFilterChange}
                                className="form-control" 
                                placeholder="Search Order..." 
                            />
                        </div>
                        <div className="col-md-8 d-flex justify-content-end align-items-center gap-3">
                            <label className="d-flex align-items-center">
                                Show&nbsp;
                                <select 
                                    className="form-select" 
                                    value={pageSize} 
                                    onChange={handlePageSizeChange} 
                                    style={{ width: 'auto' }}
                                >
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                                &nbsp;entries
                            </label>
                            {/* Export Button (Chưa có logic) */}
                            <button className="btn btn-secondary" type="button">
                                <FileText size={18} className="me-1"/> Export
                            </button>
                            <button className="btn btn-primary" type="button" onClick={handleAdd}>
                                <Plus size={18} className="me-1"/> Add Order
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="table-responsive text-nowrap">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Date</th>
                                <th>Dealer</th>
                                <th>Variant</th>
                                <th>Qty</th>
                                <th>Color</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            <tr className="filters">
                                <th>
                                    <input type="text" name="filterOrderId" value={filterOrderId} onChange={handleFilterChange} className="form-control" placeholder="Search #" />
                                </th>
                                <th>
                                    <input type="text" name="filterDate" value={filterDate} onChange={handleFilterChange} className="form-control" placeholder="Search Date" />
                                </th>
                                <th>
                                    <input type="text" name="filterDealer" value={filterDealer} onChange={handleFilterChange} className="form-control" placeholder="Search Dealer" />
                                </th>
                                <th>{/* Filter Variant? Maybe later */}</th>
                                <th>{/* Filter Qty? */}</th>
                                <th>{/* Filter Color? */}</th>
                                <th>
                                    <select name="filterStatus" value={filterStatus} onChange={handleFilterChange} className="form-select">
                                        <option value="">All</option>
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="table-border-bottom-0">
                            {paginatedOrders.length === 0 ? (
                                <tr><td colSpan="8" className="text-center py-4">No orders found.</td></tr>
                            ) : (
                                paginatedOrders.map(order => (
                                    <tr key={order.id}>
                                        <td>
                                            <span className="fw-semibold text-primary">{formatOrderId(order.id)}</span>
                                        </td>
                                        <td>{formatDate(order.createdAt || order.updatedAt)}</td>
                                        <td>{dealerMap[order.dealerId] || 'N/A'}</td>
                                        <td>{variantMap[order.variantId] || 'N/A'}</td>
                                        <td>{order.quantity}</td>
                                        <td>{order.color}</td>
                                        <td><RenderOrderStatus status={order.status} /></td>
                                        <td>
                                            <div className="dropdown">
                                                <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                    <i className="bx bx-dots-vertical-rounded"></i>
                                                </button>
                                                <div className="dropdown-menu">
                                                    <button className="dropdown-item" onClick={() => handleEdit(order.id)}>
                                                        <Edit size={16} className="me-1"/> Edit
                                                    </button>
                                                    <button className="dropdown-item text-danger" onClick={() => handleDelete(order.id)}>
                                                        <Trash size={16} className="me-1"/> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="d-flex justify-content-between align-items-center p-3">
                    <small className="text-muted">Showing {startEntry} to {endEntry} of {filteredOrders.length} entries</small>
                    <nav>
                        <ul className="pagination pagination-sm mb-0">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>&laquo;</button>
                        </li>
                        {/* TODO: Add page number links if needed */}
                        <li className="page-item active" aria-current="page"><span className="page-link">{currentPage}</span></li>
                        <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages}>&raquo;</button>
                        </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    )
}
