import React, { useState, useEffect, useMemo } from 'react';
import { AlertCircle, Truck, Eye, CheckCircle } from 'lucide-react';
import { getAllSalesOrders, markOrderDelivered } from '../../../services/orderService';
import { getAllDealers } from '../../../services/dealerService';
import { getAllVehicleVariants } from '../../../services/vehicleService';
import { getAllCustomers } from '../../../services/dashboardService';
import SalesOrderStatsCards from './SalesOrderStatsCards';
import SalesOrderDetailsModal from './SalesOrderDetailsModal';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Đăng ký elements
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// --- Helper Functions ---
const formatOrderId = (id) => `#${id?.slice(-6).toUpperCase() || 'N/A'}`;
const formatDate = (isoString) => isoString ? new Date(isoString).toLocaleString('vi-VN') : 'N/A';
const formatCurrency = (amount) => typeof amount === 'number' ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount) : 'N/A';
const getAvatarInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length === 1) return name.substring(0, 1).toUpperCase();
    return (parts[0].substring(0, 1) + parts[parts.length - 1].substring(0, 1)).toUpperCase();
};

// Render Status Badge (Cần điều chỉnh theo status thực tế của Sales Order)
const RenderSalesOrderStatus = ({ status }) => {
    let badgeClass = 'secondary';
    switch (status?.toLowerCase()) {
        case 'pending': badgeClass = 'warning'; break;
        case 'processing': badgeClass = 'info'; break;
        case 'shipped': badgeClass = 'primary'; break;
        case 'delivered': badgeClass = 'success'; break;
        case 'cancelled': badgeClass = 'danger'; break;
    }
    return <span className={`badge rounded-pill bg-label-${badgeClass} d-flex align-items-center p-1 px-2`}><span className={`dot bg-${badgeClass} me-1`}></span> {status || 'N/A'}</span>;
};

export default function SalesOrderManagement() {
    const [orders, setOrders] = useState([]);
    const [customerMap, setCustomerMap] = useState({}); // { customerId: customerName }
    const [dealers, setDealers] = useState([]);
    const [dealerMap, setDealerMap] = useState({});     // { dealerId: dealerName }
    const [variantMap, setVariantMap] = useState({});   // { variantId: variantName }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Pagination & Filter State
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [globalSearch, setGlobalSearch] = useState('');

    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [viewingOrder, setViewingOrder] = useState(null);

    const [openDropdownId, setOpenDropdownId] = useState(null);

    // Fetch Data (Orders, Customers, Dealers, Variants)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');
                // **Lưu ý:** Cần có API getAllCustomers
                const [ordersRes, dealersRes, variantsRes , customersRes ] = await Promise.all([
                    getAllSalesOrders(),
                    getAllDealers(),
                    getAllVehicleVariants(),
                    getAllCustomers(), 
                ]);

                setOrders(ordersRes.data?.data?.items || ordersRes.data?.items || ordersRes.data || []);

                // Map Dealers
                const dealerList = dealersRes.data?.data?.items || [];
                setDealers(dealerList);
                setDealerMap(dealerList.reduce((acc, d) => { acc[d.id] = d.name; return acc; }, {}));

                // Map Variants
                const variantList = variantsRes.data?.data?.items || [];
                setVariantMap(variantList.reduce((acc, v) => { acc[v.id] = v.name; return acc; }, {}));

                // Map Customers (Khi có API)
                const customerList = customersRes.data?.data?.items || [];
                setCustomerMap(customerList.reduce((acc, c) => { acc[c.id] = { name: c.fullName, email: c.email /* avatar? */ }; return acc; }, {}));
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to load sales orders');
                console.error("Fetch Sales Orders Error:", err)
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Auto-hide alerts
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError('');
                setSuccess('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);
    
    // Filter Logic
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const customer = customerMap[order.customerId];
            const customerName = (customer?.name || order.customerId || '').toLowerCase();
            const customerEmail = (customer?.email || '').toLowerCase();
            const dealerName = (dealerMap[order.dealerId] || '').toLowerCase();
            const variantName = (variantMap[order.variantId] || '').toLowerCase();
            const status = (order.status || '').toLowerCase();
            const date = formatDate(order.createdAt || order.updatedAt).toLowerCase();
            const id = formatOrderId(order.id).toLowerCase();
            // const total = formatCurrency(order.totalAmount).toLowerCase(); // Nếu có totalAmount

            // Status filter first
            if (statusFilter && status !== statusFilter.toLowerCase()) return false;

            // Global search
            if (globalSearch) {
                const searchLower = globalSearch.toLowerCase();
                if (
                    !id.includes(searchLower) &&
                    !customerName.includes(searchLower) &&
                    !customerEmail.includes(searchLower) &&
                    !dealerName.includes(searchLower) &&
                    !variantName.includes(searchLower) &&
                    !date.includes(searchLower)
                    // !total.includes(searchLower)
                ) return false;
            }
            return true;
        });
    }, [orders, customerMap, dealerMap, variantMap, statusFilter, globalSearch]);

    // Pagination Logic
    const totalItems = filteredOrders.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredOrders.slice(startIndex, startIndex + pageSize);
    }, [filteredOrders, currentPage, pageSize]);
    const startEntry = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endEntry = Math.min(currentPage * pageSize, totalItems);

    // 5. Logic tính toán dữ liệu cho biểu đồ báo cáo
    const reportChartData = useMemo(() => {
        // Báo cáo theo Dealer
        const salesByDealer = filteredOrders.reduce((acc, order) => {
            const dealerId = order.dealerId;
            const amount = order.totalAmount || 0;
            if (dealerId) {
                acc[dealerId] = (acc[dealerId] || 0) + amount;
            }
            return acc;
        }, {});

        const dealerLabels = Object.keys(salesByDealer).map(id => dealerMap[id] || `ID: ${id.slice(0,5)}..`);
        const dealerDataValues = Object.values(salesByDealer);

        const salesByDealerChart = {
            labels: dealerLabels,
            datasets: [{ label: 'Total Sales (VND)', data: dealerDataValues, backgroundColor: 'rgba(113, 102, 240, 0.8)' }]
        };

        // Báo cáo theo Khu vực (Region)
        const dealerIdToRegionMap = dealers.reduce((acc, dealer) => {
            acc[dealer.id] = dealer.region || 'Unknown Region';
            return acc;
        }, {});

        const salesByRegion = filteredOrders.reduce((acc, order) => {
            const dealerId = order.dealerId;
            const region = dealerId ? dealerIdToRegionMap[dealerId] : 'Unknown Region';
            const amount = order.totalAmount || 0;
            acc[region] = (acc[region] || 0)  + amount;
            return acc;
        }, {});

        const regionLabels = Object.keys(salesByRegion);
        const regionDataValues = Object.values(salesByRegion);

            const salesByRegionChart = {
            labels: regionLabels,
            datasets: [{ label: 'Total Sales (VND)', data: regionDataValues, backgroundColor: 'rgba(40, 208, 148, 0.8)' }] // Màu khác
        };

       return { salesByDealerChart, salesByRegionChart };

   }, [filteredOrders, dealerMap, dealers]); // Phụ thuộc vào orders đã lọc và dealers

   // Cấu hình chung cho Bar Chart
   const barChartOptions = {
       responsive: true,
       maintainAspectRatio: false,
       plugins: { legend: { display: false } },
       scales: { y: { beginAtZero: true, ticks: { callback: (value) => formatCurrency(value) } } } // Format trục Y
   };

    const reloadOrders = async () => {
        try {
            const ordersRes = await getAllSalesOrders();
            setOrders(ordersRes.data?.data?.items || ordersRes.data?.items || ordersRes.data || []);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to reload orders');
        }
   };

    // Handlers
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setCurrentPage(1);
        if (name === 'globalSearch') setGlobalSearch(value);
        if (name === 'statusFilter') setStatusFilter(value);
    };
    const handlePageSizeChange = (e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); };
    const handlePageChange = (newPage) => { if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage); };

    const handleViewDetails = (order) => {
        setViewingOrder(order);
        setShowDetailsModal(true);
    };

    const handleDropdownToggle = (orderId) => {
        setOpenDropdownId(prevId => (prevId === orderId ? null : orderId));
    };

    const handleMarkDelivered = async (orderId, orderNumStr) => {
        if (!window.confirm(`Mark Order ${orderNumStr} as Delivered?`)) return;
        try {
            setSuccess(''); // Xóa thông báo cũ
            setError('');
            const response = await markOrderDelivered(orderId);
            
            if (response.data?.success || response.status === 200 || response.status === 204) {
                setOpenDropdownId(null);
                setSuccess(`Order ${orderNumStr} marked as Delivered.`);
                reloadOrders(); // Tải lại danh sách
            } else {
                throw new Error(response.data?.message || 'Operation failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to mark as delivered');
        }
    };

    if (loading) {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
            </div>
        </div>
        );
    }

    return (
        <>
            {/* Stats Cards */}
            <SalesOrderStatsCards orders={orders} />

            {/* Alert messages */}
            {error && (
                <div className="alert alert-danger alert-dismissible d-flex align-items-center" role="alert">
                    <AlertCircle size={20} className="me-2" />
                        <div className="flex-grow-1">{error}</div>
                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={() => setError('')}
                        ></button>
                </div>
            )}
            {success && ( // Thêm success alert
                <div className="alert alert-success alert-dismissible d-flex align-items-center mb-4" role="alert">
                    <CheckCircle size={20} className="me-2" /><div className="flex-grow-1">{success}</div>
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setSuccess('')}
                    ></button>
                </div>
            )}

            {/* Chart */}
            <div className="row g-4 mb-4">

                {/* Sales by Dealer Chart */}
                <div className="col-lg-6 col-md-12">
                    <div className="card h-100">
                        <div className="card-header"><h5 className="card-title mb-0">Sales by Dealer</h5></div>
                        <div className="card-body" style={{ minHeight: '300px' }}>
                                {filteredOrders.length > 0 ? (
                                    <div style={{ position: 'relative', height: '250px', width: '100%' }}>
                                        <Bar options={barChartOptions} data={reportChartData.salesByDealerChart} />
                                    </div>
                                ) : (
                                    <p className="text-muted text-center mt-4">No sales data to display based on current filters.</p>
                                )}
                        </div>
                    </div>
                </div>

                {/* Sales by Region Chart */}
                <div className="col-lg-6 col-md-12">
                        <div className="card h-100">
                        <div className="card-header"><h5 className="card-title mb-0">Sales by Region</h5></div>
                        <div className="card-body" style={{ minHeight: '300px' }}>
                            {filteredOrders.length > 0 ? (
                                <div style={{ position: 'relative', height: '250px', width: '100%' }}>
                                    <Bar options={barChartOptions} data={reportChartData.salesByRegionChart} />
                                </div>
                            ) : (
                                <p className="text-muted text-center mt-4">No sales data to display based on current filters.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
                
            <div className="card">

                {/* Header: Show, Search, Filter */}
                <div className="card-header border-bottom">
                    <div className="d-flex justify-content-between align-items-center row py-3 gap-3 gap-md-0">

                        {/* Left: Show Entries */}
                        <div className="col-md-auto">
                           <label className="d-flex align-items-center"> 
                                Show&nbsp; 
                                <select 
                                    className="form-select" 
                                    value={pageSize} 
                                    onChange={handlePageSizeChange} 
                                    style={{width:'auto'}}
                                > 
                                    <option>10</option>
                                    <option>25</option>
                                    <option>50</option> 
                                </select> 
                            </label>
                        </div>

                        {/* Right: Search & Status Filter */}
                        <div className="col-md-auto ms-auto d-flex align-items-center gap-3">
                            <input 
                                type="search" 
                                name="globalSearch" 
                                value={globalSearch} 
                                onChange={handleFilterChange} 
                                className="form-control" 
                                placeholder="Search Order..." 
                                style={{width: '200px'}} 
                            />
                            <select 
                                name="statusFilter" 
                                className="form-select" 
                                value={statusFilter} 
                                onChange={handleFilterChange}
                            >
                                <option value="">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="table-responsive text-nowrap">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Dealer</th>
                                <th>Vehicle</th>
                                {/* <th>Total</th> */}
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-border-bottom-0">
                            {paginatedOrders.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-4"> No orders found. </td></tr>
                            ) : (
                                paginatedOrders.map(order => {
                                    const customer = customerMap[order.customerId];
                                    const orderNumStr = formatOrderId(order.id);
                                    const isDeliveredOrCancelled = order.status?.toLowerCase() === 'delivered' || order.status?.toLowerCase() === 'cancelled';
                                    return (
                                        <tr key={order.id}>
                                            <td><span className="fw-semibold text-primary">{formatOrderId(order.id)}</span></td>
                                            <td>{formatDate(order.createdAt || order.updatedAt)}</td>
                                            <td>
                                                {customer ? (
                                                     <div className="d-flex justify-content-start align-items-center">
                                                        <div className="avatar avatar-sm me-3"> <span className="avatar-initial rounded-circle bg-label-secondary">{getAvatarInitials(customer.name)}</span> </div>
                                                        <div className="d-flex flex-column">
                                                            <span className="fw-semibold">{customer.name}</span>
                                                            <small className="text-muted">{customer.email}</small>
                                                        </div>
                                                    </div>
                                                ) : ( order.customerId || 'N/A' )}
                                            </td>
                                            <td>{dealerMap[order.dealerId] || 'N/A'}</td>
                                            <td>{variantMap[order.variantId] || 'N/A'}</td>
                                            {/* <td>{formatCurrency(order.totalAmount)}</td> */}
                                            <td><RenderSalesOrderStatus status={order.status} /></td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    {/* View */}
                                                    <button 
                                                        type="button" 
                                                        className="btn btn-icon btn-text-secondary rounded-pill btn-sm"
                                                        title="View"
                                                        onClick={() => handleViewDetails(order)}
                                                    >
                                                        <i className="bx bx-show" /> 
                                                    </button>

                                                    {/* Menu */}
                                                    <div className="dropdown position-relative">
                                                        <button 
                                                            type="button" 
                                                            className="btn p-0 dropdown-toggle hide-arrow btn-sm" 
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                        >
                                                            <i className="bx bx-dots-vertical-rounded" />
                                                        </button>
                                                        <div className="dropdown-menu dropdown-menu-end">
                                                            {!isDeliveredOrCancelled && (
                                                                <button 
                                                                    type="button" 
                                                                    className="dropdown-item" 
                                                                    onClick={() => handleMarkDelivered(order.id, orderNumStr)}
                                                                >
                                                                    <Truck size={16} className="me-2 text-success"/> Mark Delivered
                                                                </button>
                                                            )}
                                                            {!isDeliveredOrCancelled && (
                                                                <button className="dropdown-menu dropdown-menu-end">
                                                                    <XCircle size={16} className="me-2"/> Cancel Order
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex justify-content-between align-items-center p-3">
                    <small className="text-muted">
                        Showing {startEntry} to {endEntry} of {totalItems} entries
                    </small>
                    <nav>
                        <ul className="pagination pagination-sm mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link" 
                                    onClick={() => setCurrentPage(p => p - 1)}
                                    disabled={currentPage === 1}
                                >
                                    &laquo; Previous
                                </button>
                            </li>
                            <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link" 
                                    onClick={() => setCurrentPage(p => p + 1)}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                >
                                    Next &raquo;
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Modal Details */}
            <SalesOrderDetailsModal
                show={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                order={viewingOrder}
                customerMap={customerMap} // Truyền map để hiển thị tên
                dealerMap={dealerMap}
                variantMap={variantMap}
            />
        </>
    )
}