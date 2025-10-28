import React, { useState, useEffect, useMemo } from 'react';
import { AlertCircle, CheckCircle, Plus, Edit, Trash } from 'lucide-react';
import { getAllDealerOrders, deleteDealerOrder, getAllDealers, getAllVehicleVariants } from '../../../../services/dealerService';
import DealerOrderModal from './DealerOrderModal';
import OrderStatsCards from './OrdersStatsCards';
import DealerOrderDetailsModal from './DealerOrderDetailsModal';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

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
    const [loadingPageData, setLoadingPageData] = useState(true); // Đổi tên state loading chính

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showFormModal, setShowFormModal] = useState(false);
    const [orderToEdit, setOrderToEdit] = useState(null);

    const [showViewModal, setShowViewModal] = useState(false);
    const [orderToView, setOrderToView] = useState(null);

    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [globalSearch, setGlobalSearch] = useState('');

    // fetchData to load 3 API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingPageData(true); 
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
                setLoadingPageData(false); 
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
        // Start with all orders
        let filtered = [...orders];

        // Apply global search if present
        if (globalSearch) {
            const searchTermLower = globalSearch.toLowerCase();
            filtered = filtered.filter(order => {
                const orderId = formatOrderId(order.id).toLowerCase();
                const date = formatDate(order.createdAt || order.updatedAt).toLowerCase();
                const dealerName = (dealerMap[order.dealerId] || '').toLowerCase();
                const status = (order.status || '').toLowerCase();
                const variantName = (variantMap[order.variantId] || '').toLowerCase();
                const color = (order.color || '').toLowerCase();
                const quantity = String(order.quantity || '').toLowerCase();

                return (
                    orderId.includes(searchTermLower) ||
                    date.includes(searchTermLower) ||
                    dealerName.includes(searchTermLower) ||
                    status.includes(searchTermLower) ||
                    variantName.includes(searchTermLower) ||
                    color.includes(searchTermLower) ||
                    quantity.includes(searchTermLower)
                );
            });
        }
        return filtered;
    }, [
        orders,
        dealerMap,
        variantMap,
        globalSearch
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

    const handleExport = (format) => {
        // Use the currently filtered (and paginated if desired, but usually export all filtered)
        const exportData = filteredOrders.map(order => ({
            "Order #": formatOrderId(order.id),
            "Date": formatDate(order.createdAt || order.updatedAt),
            "Dealer": dealerMap[order.dealerId] || 'N/A',
            "Variant": variantMap[order.variantId] || 'N/A',
            "Qty": order.quantity,
            "Color": order.color,
            "Status": order.status || 'N/A'
        }));

        if (exportData.length === 0) {
            setError("No data to export based on current filters.");
            return;
        }

        const header = ["Order #", "Date", "Dealer", "Variant", "Qty", "Color", "Status"];

        try {
            switch (format) {
                case 'pdf': {
                    const doc = new jsPDF();
                    doc.text("Dealer Orders List", 14, 16);
                    autoTable(doc, {
                        head: [header],
                        body: exportData.map(Object.values),
                        startY: 20,
                    });
                    doc.save('dealer-orders.pdf');
                    break;
                }
                case 'excel': {
                    const ws = XLSX.utils.json_to_sheet(exportData, { header: header });
                    // Rename header row if needed (optional)
                    // XLSX.utils.sheet_add_aoa(ws, [header], { origin: "A1" });
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, "Dealer Orders");
                    XLSX.writeFile(wb, "dealer-orders.xlsx");
                    break;
                }
                case 'csv': {
                    const ws = XLSX.utils.json_to_sheet(exportData, { header: header });
                    const csv = XLSX.utils.sheet_to_csv(ws);
                    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement('a');
                    if (link.download !== undefined) { // Check for download attribute support
                        const url = URL.createObjectURL(blob);
                        link.setAttribute('href', url);
                        link.setAttribute('download', 'dealer-orders.csv');
                        link.style.visibility = 'hidden';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                    break;
                }
                case 'print': {
                    const doc = new jsPDF();
                    doc.text("Dealer Orders List", 14, 16);
                    autoTable(doc, {
                        head: [header],
                        body: exportData.map(Object.values),
                        startY: 20,
                    });
                    doc.autoPrint();
                    doc.output('dataurlnewwindow'); // Open print dialog in new window
                    break;
                }
                case 'copy': {
                     const textToCopy = [
                        header.join('\t'), // Header row
                        ...exportData.map(row => Object.values(row).join('\t')) // Data rows
                     ].join('\n');

                     navigator.clipboard.writeText(textToCopy).then(() => {
                        setSuccess('Data copied to clipboard!');
                     }, (err) => {
                        setError('Failed to copy data.');
                        console.error('Copy error:', err);
                     });
                     break;
                }
                default:
                    console.warn('Unknown export format:', format);
                    break;
            }
            setSuccess(`Exported data as ${format.toUpperCase()}.`);
        } catch (exportError) {
             setError(`Failed to export data as ${format.toUpperCase()}.`);
             console.error(`Export Error (${format}):`, exportError);
        }
    };

    const handleViewDetails = (orderId) => {
        const order = orders.find(o => o.id === orderId);
        if (order) {
            setOrderToView(order);
            setShowViewModal(true);
        }
    };

    if (loadingPageData) {
        return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
    }

    return (
        <>
            {/* OrderStatsCards */}
            <OrderStatsCards orders={orders} />

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
                        <div className="col-md-3">
                            <input 
                                type="search" 
                                name="globalSearch"
                                value={globalSearch}
                                onChange={handleFilterChange}
                                className="form-control" 
                                placeholder="Search Order..." 
                            />
                        </div>
                        <div className="col-md-8 ms-auto d-flex justify-content-end align-items-center gap-3">
                            <label className="d-flex align-items-center">
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
                            </label>
                            {/* Export Button */}
                            <div className="btn-group">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className='bx bx-export me-1'></i> Export
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                    <button type="button" className="dropdown-item" onClick={() => handleExport('print')}>
                                        <i className='bx bx-printer me-2'></i> Print
                                    </button>
                                    </li>
                                    <li>
                                    <button type="button" className="dropdown-item" onClick={() => handleExport('csv')}>
                                        <i className='bx bx-file me-2'></i> Csv
                                    </button>
                                    </li>
                                    <li>
                                    <button type="button" className="dropdown-item" onClick={() => handleExport('excel')}>
                                        <i className='bx bx-file-blank me-2'></i> Excel
                                    </button>
                                    </li>
                                    <li>
                                    <button type="button" className="dropdown-item" onClick={() => handleExport('pdf')}>
                                        <i className='bx bxs-file-pdf me-2'></i> Pdf
                                    </button>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                    <button type="button" className="dropdown-item" onClick={() => handleExport('copy')}>
                                        <i className='bx bx-copy me-2'></i> Copy
                                    </button>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-md-auto">
                                <button
                                    type="button"
                                    className="btn btn-primary rounded-pill d-flex align-items-center"
                                    onClick={handleAdd}
                                >
                                    <Plus size={18} className="me-2" />
                                    <span className="fw-semibold">Add Order</span>
                                </button>
                            </div>
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
                        </thead>
                        <tbody className="table-border-bottom-0">
                            {paginatedOrders.length === 0 ? (
                                <tr><td colSpan="8" className="text-center py-4">No orders found.</td></tr>
                            ) : (
                                paginatedOrders.map(order => (
                                    <tr key={order.id}>
                                        <td>
                                            <a 
                                                href="#" 
                                                className="fw-semibold text-primary"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleViewDetails(order.id);
                                                }}
                                                title="View Details"
                                            >
                                                {formatOrderId(order.id)}
                                            </a>
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
                                                    <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => handleEdit(order.id)}>
                                                        <Edit size={16} className="me-1"/> Edit
                                                    </button>
                                                    <button className="dropdown-item text-danger d-flex align-items-center gap-2" onClick={() => handleDelete(order.id)}>
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

            {/* Modal */}
            <DealerOrderModal
                show={showFormModal}
                onClose={() => { setShowFormModal(false); setOrderToEdit(null); }}
                onSaveSuccess={handleSaveSuccess}
                dealers={dealers} 
                orderToEdit={orderToEdit}
            />

            {/* Modal Views */}
            <DealerOrderDetailsModal
                show={showViewModal}
                onClose={() => { setShowViewModal(false); setOrderToView(null); }}
                order={orderToView}
                dealerName={orderToView ? dealerMap[orderToView.dealerId] : 'N/A'}
                variantName={orderToView ? variantMap[orderToView.variantId] : 'N/A'}
            />
        </>
    )
}
