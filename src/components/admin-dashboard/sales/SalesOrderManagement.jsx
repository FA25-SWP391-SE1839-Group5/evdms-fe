import React, { useState, useEffect, useMemo } from 'react';
import { AlertCircle, Search, MoreVertical, Eye } from 'lucide-react';
import { getAllSalesOrders } from '../../../services/orderService';
import { getAllDealers } from '../../../services/dealerService';
import { getAllVehicleVariants } from '../../../services/vehicleService';
import { getAllCustomers } from '../../../services/dashboardService';
import SalesOrderStatsCards from './SalesOrderStatsCards';

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
    // Style giống Invoice list
    return <span className={`badge rounded-pill bg-label-${badgeClass} d-flex align-items-center p-1 px-2`}><span className={`dot bg-${badgeClass} me-1`}></span> {status || 'N/A'}</span>;
};

export default function SalesOrderManagement() {
    const [orders, setOrders] = useState([]);
    const [customerMap, setCustomerMap] = useState({}); // { customerId: customerName }
    const [dealerMap, setDealerMap] = useState({});     // { dealerId: dealerName }
    const [variantMap, setVariantMap] = useState({});   // { variantId: variantName }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Pagination & Filter State
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [globalSearch, setGlobalSearch] = useState('');

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
        if (error) {
          const timer = setTimeout(() => {
            setError('');
          }, 5000);
          return () => clearTimeout(timer);
        }
    }, [error]);
    
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
        // setViewingOrder(order);
        // setShowDetailsModal(true);
        alert(`View details for Order ${formatOrderId(order.id)} - Modal coming soon!`);
    };
    // Add handler for mark delivered if needed

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
            <h4 className="fw-bold py-3 mb-4">
              <span className="text-muted fw-light">Sales /</span> Sales Orders
            </h4>

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
                                                {/* Actions: View Details */}
                                                 <button
                                                    type="button"
                                                    className="btn btn-sm btn-icon btn-text-secondary rounded-pill"
                                                    title="View Details"
                                                    onClick={() => handleViewDetails(order)}
                                                >
                                                   <Eye size={18} />
                                                </button>
                                                {/* Thêm dropdown nếu cần action khác (Mark Delivered...) */}
                                                {/* <div className="dropdown"> ... </div> */}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
