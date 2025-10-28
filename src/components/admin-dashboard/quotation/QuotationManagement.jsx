import React, { useState, useEffect, useMemo } from 'react';
import { AlertCircle, Search, Eye, CheckCircle, Download } from 'lucide-react';
import {
    getAllQuotations,
    getAllDealers,
    // getAllVehicleVariants, // Lấy từ vehicleService hoặc service khác
    getAllCustomers
} from '../../../services/dashboardService'; 
import { getAllVehicleVariants } from '../../../services/vehicleService'; 
import QuotationStatsCards from './QuotationStatsCards';
import QuotationDetailsModal from './QuotationDetailsModal';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './print.css';

// --- Helper Functions ---
const formatQuoteId = (id) => `#${id?.slice(-6).toUpperCase() || 'N/A'}`;
const formatDate = (isoString) => isoString ? new Date(isoString).toLocaleString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' }) : 'N/A';
const getAvatarInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length === 1) return name.substring(0, 1).toUpperCase();
    return (parts[0].substring(0, 1) + (parts.length > 1 ? parts[parts.length - 1].substring(0, 1) : '')).toUpperCase();
};

// Render Status (Giả định các status, bạn cần chỉnh lại cho đúng với data API trả về)
const RenderQuotationStatus = ({ status }) => {
    let badgeClass = 'secondary';
    const st = String(status).toLowerCase();
    switch (st) {
        case 'pending': badgeClass = 'warning'; break;
        case 'accepted': badgeClass = 'success'; break; // (Sales Order đã được tạo từ quote này)
        case 'expired': badgeClass = 'danger'; break;
        case 'draft': badgeClass = 'info'; break;
    }
    return <span className={`badge bg-label-${badgeClass}`}>{status || 'N/A'}</span>;
};
// --- End Helper Functions ---

const QuotationManagement = () => {
    const [quotations, setQuotations] = useState([]);
    const [customerMap, setCustomerMap] = useState({});
    const [dealerMap, setDealerMap] = useState({});
    const [variantMap, setVariantMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Pagination & Filter State
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [globalSearch, setGlobalSearch] = useState('');

    // State cho modal (tạm thời)
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [viewingQuoteId, setViewingQuoteId] = useState(null);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');
                // Gọi API
                const [quotesRes, dealersRes, variantsRes, customersRes] = await Promise.all([
                    getAllQuotations(), //
                    getAllDealers(),    //
                    getAllVehicleVariants(), //
                    getAllCustomers(),  //
                ]);

                // Xử lý Quotations (response.data.data.items hoặc .data.items hoặc .data)
                setQuotations(quotesRes.data?.data?.items || quotesRes.data?.items || quotesRes.data || []);
                
                // Xử lý Maps
                const dealerList = dealersRes.data?.data?.items || dealersRes.data?.items || dealersRes.data || [];
                setDealerMap(dealerList.reduce((acc, d) => { acc[d.id] = d.name; return acc; }, {}));

                const variantList = variantsRes.data?.data?.items || variantsRes.data?.items || variantsRes.data || [];
                setVariantMap(variantList.reduce((acc, v) => { acc[v.id] = v.name; return acc; }, {}));

                const customerList = customersRes.data?.data?.items || customersRes.data?.items || customersRes.data || [];
                setCustomerMap(customerList.reduce((acc, c) => { acc[c.id] = { name: c.fullName, email: c.email }; return acc; }, {}));

            } catch (err) {
                 const errMsg = err.response?.data?.message || err.message || 'Failed to load quotations';
                 setError(errMsg);
                 console.error("Fetch Quotations Error:", err)
            } finally {
                setLoading(false);
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
    const filteredQuotations = useMemo(() => {
        return quotations.filter(quote => {
            // Giả định API GET /api/quotations trả về các trường này
            const customer = customerMap[quote.customerId];
            const customerName = (customer?.name || quote.customerId || '').toLowerCase();
            const dealerName = (dealerMap[quote.dealerId] || '').toLowerCase(); // Giả định có dealerId
            const variantName = (variantMap[quote.variantId] || '').toLowerCase();
            const status = (quote.status || '').toLowerCase(); // Giả định có status
            const id = formatQuoteId(quote.id).toLowerCase();

            if (statusFilter && status !== statusFilter.toLowerCase()) return false;
            if (globalSearch) {
                const searchLower = globalSearch.toLowerCase();
                if (
                    !id.includes(searchLower) &&
                    !customerName.includes(searchLower) &&
                    !dealerName.includes(searchLower) &&
                    !variantName.includes(searchLower)
                ) return false;
            }
            return true;
        });
    }, [quotations, customerMap, dealerMap, variantMap, statusFilter, globalSearch]);

    // Pagination Logic
    const totalItems = filteredQuotations.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const paginatedQuotations = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredQuotations.slice(startIndex, startIndex + pageSize);
    }, [filteredQuotations, currentPage, pageSize]);
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
    const handleViewDetails = (quoteId) => {
        setViewingQuoteId(quoteId); // Chỉ set ID
        setShowDetailsModal(true); // Mở modal
    };

    const getExportRows = () => {
        if (filteredQuotations.length === 0) {
            setError('No data to export.');
            return null;
        }
        
        // Dòng header
        const headers = ['Quote #', 'Date', 'Customer Name', 'Customer Email', 'Dealer', 'Vehicle', 'Status'];
        
        // Dòng data
        const dataRows = filteredQuotations.map(quote => {
            const customer = customerMap[quote.customerId] || {};
            return [
                formatQuoteId(quote.id),
                formatDate(quote.createdAt || quote.updatedAt),
                customer.name || 'N/A',
                customer.email || 'N/A',
                dealerMap[quote.dealerId] || 'N/A',
                variantMap[quote.variantId] || 'N/A',
                quote.status || 'N/A'
            ];
        });
        
        return [headers, ...dataRows]; // Trả về 2D array, dòng đầu là header
    };

    // [MỚI] Helper để escape CSV (xử lý dấu phẩy, dấu nháy trong data)
    const escapeCSVValue = (field) => {
        if (field === null || field === undefined) return '';
        let str = String(field);
        if (str.includes(',') || str.includes('\n') || str.includes('"')) {
            str = str.replace(/"/g, '""');
            return `"${str}"`;
        }
        return str;
    };

    // [MỚI] Hàm lấy timestamp cho tên file
    const getFileTimestamp = () => {
        const aMoment = new Date();
        const timestamp = `${aMoment.getFullYear().toString().padStart(4, '0')}${(aMoment.getMonth() + 1).toString().padStart(2, '0')}${aMoment.getDate().toString().padStart(2, '0')}`;
        return timestamp;
    };

    // 1. Logic cho CSV
    const handleExportCSV = () => {
        const rows = getExportRows();
        if (!rows) return;

        const csvString = rows.map(row => row.map(escapeCSVValue).join(',')).join('\n');
        
        // Thêm BOM \uFEFF để Excel đọc UTF-8 (tiếng Việt) cho đúng
        const blob = new Blob(["\uFEFF" + csvString], { type: 'text/csv;charset=utf-8;' });
        
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        const timestamp = getFileTimestamp();
        
        link.setAttribute('href', url);
        link.setAttribute('download', `Quotations_${timestamp}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setSuccess('Exported to CSV successfully.');
    };

    // 2. Logic cho Excel 
    const handleExportExcel = () => {
        const rows = getExportRows();
        if (!rows) return;
        
        const ws = XLSX.utils.aoa_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Quotations");
        
        const timestamp = getFileTimestamp();
        XLSX.writeFile(wb, `Quotations_${timestamp}.xlsx`);
        setSuccess('Exported to Excel successfully.');
    };

    // 3. Logic cho PDF 
    const handleExportPDF = () => {
        const rows = getExportRows();
        if (!rows) return;
        
        const headers = rows[0];
        const data = rows.slice(1);
        
        const doc = new jsPDF();
        doc.autoTable({
            head: [headers],
            body: data,
        });
        
        const timestamp = getFileTimestamp();
        doc.save(`Quotations_${timestamp}.pdf`);
        setSuccess('Exported to PDF successfully.');
    };

    // 4. Logic cho Print
    const handlePrint = () => {
        window.print()
    };

    // 5. Logic cho Copy
    const handleCopy = () => {
        const rows = getExportRows();
        if (!rows) return;

        // Dùng tab-separated values (TSV) để paste vào Excel/Sheets
        const tsvString = rows.map(row => row.join('\t')).join('\n');
        
        navigator.clipboard.writeText(tsvString).then(() => {
            setSuccess('Đã sao chép vào clipboard.');
        }, (err) => {
            setError('Không thể sao chép. Lỗi: ' + err);
        });
    };

    if (loading) {
        return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
    }

    return (
        <>
            {/* Stats Cards */}
            <QuotationStatsCards quotations={quotations} />
            {error && (
                <div className="alert alert-danger alert-dismissible d-flex align-items-center mb-4" role="alert">
                    <AlertCircle size={20} className="me-2" />
                    <div className="flex-grow-1">{error}</div>
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setError('')}
                    ></button>
                </div>
            )}
            {success && (
                <div className="alert alert-success alert-dismissible d-flex align-items-center mb-4" role="alert">
                    <CheckCircle size={20} className="me-2" />
                    <div className="flex-grow-1">{success}</div>
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setSuccess('')}
                    ></button>
                </div>
            )}

            <div className="card">
                {/* Header: Show, Search, Filter */}
                <div className="card-header border-bottom">
                    <div className="d-flex justify-content-between align-items-center row py-3 gap-3 gap-md-0">
                        <div className="col-md-auto">
                           <label className="d-flex align-items-center"> 
                                Show &nbsp; 
                                <select 
                                    className="form-select" 
                                    value={pageSize} 
                                    onChange={handlePageSizeChange} 
                                    style={{width:'auto'}}
                                > 
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option> 
                                </select> 
                            </label>
                        </div>
                        <div className="col-md-auto ms-auto d-flex align-items-center gap-3">
                            <input 
                                type="search" 
                                name="globalSearch" 
                                value={globalSearch} 
                                onChange={handleFilterChange} 
                                className="form-control" 
                                placeholder="Search..." 
                                style={{width: '200px'}} 
                            />
                            <select 
                                name="statusFilter" 
                                className="form-select" 
                                value={statusFilter} 
                                onChange={handleFilterChange}
                            >
                                <option value="">All Status</option>
                                <option value="Draft">Draft</option>
                                <option value="Pending">Pending</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Expired">Expired</option>
                            </select>
                            <button
                                type="button"
                                className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                disabled={loading}
                            >
                                <Download size={16} className="me-1" />
                                Export
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <button 
                                        className="dropdown-item d-flex align-items-center" 
                                        onClick={handlePrint}
                                    >
                                        <i className='bx bx-printer me-2'></i> Print
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        className="dropdown-item d-flex align-items-center" 
                                        onClick={handleExportCSV}
                                    >
                                        <i className='bx bx-file me-2'></i> Csv
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        className="dropdown-item d-flex align-items-center" 
                                        onClick={handleExportExcel}
                                    >
                                       <i className='bx bx-file-blank me-2'></i> Excel
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        className="dropdown-item d-flex align-items-center" 
                                        onClick={handleExportPDF}
                                    >
                                        <i className='bx bxs-file-pdf me-2'></i> Pdf
                                    </button>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button 
                                        className="dropdown-item d-flex align-items-center" 
                                        onClick={handleCopy}
                                    >
                                        <i className='bx bx-copy me-2'></i> Copy
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="table-responsive text-nowrap">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Quote #</th>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Dealer</th>
                                <th>Vehicle</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-border-bottom-0">
                            {paginatedQuotations.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-4">
                                    {totalItems === 0 && !globalSearch && !statusFilter ? 'No quotations found.' : 'No quotations match your filters.'}
                                </td></tr>
                            ) : (
                                paginatedQuotations.map(quote => {
                                    const customer = customerMap[quote.customerId];
                                    return (
                                        <tr key={quote.id}>
                                            <td><span className="fw-semibold text-primary">{formatQuoteId(quote.id)}</span></td>
                                            <td>{formatDate(quote.createdAt || quote.updatedAt)}</td>
                                            <td>
                                                {customer ? (
                                                     <div className="d-flex justify-content-start align-items-center">
                                                        <div className="avatar avatar-sm me-3"> 
                                                            <span className="avatar-initial rounded-circle bg-label-secondary">{getAvatarInitials(customer.name)}</span> 
                                                        </div>
                                                        <div className="d-flex flex-column">
                                                            <span className="fw-semibold">{customer.name}</span>
                                                            <small className="text-muted">{customer.email || 'No Email'}</small>
                                                        </div>
                                                    </div>
                                                ) : ( <span className="text-muted">{quote.customerId || 'N/A'}</span> )}
                                            </td>
                                            <td>{dealerMap[quote.dealerId] || 'N/A'}</td>
                                            <td>{variantMap[quote.variantId] || 'N/A'}</td>
                                            <td><RenderQuotationStatus status={quote.status} /></td>
                                            <td>
                                                 <button
                                                    type="button"
                                                    className="btn btn-sm btn-icon btn-text-secondary rounded-pill"
                                                    title="View Details"
                                                    onClick={() => handleViewDetails(quote.id)}
                                                >
                                                   <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="d-flex justify-content-between align-items-center p-3 border-top">
                    <small className="text-muted">Showing {startEntry} to {endEntry} of {totalItems} entries</small>
                     <nav>
                        <ul className="pagination pagination-sm mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}> 
                                <button 
                                    className="page-link" 
                                    onClick={() => handlePageChange(currentPage - 1)} 
                                    disabled={currentPage === 1}
                                >
                                    &laquo;
                                </button> 
                            </li>
                            <li className="page-item active">
                                <span className="page-link">{currentPage}</span>
                            </li>
                            <li className="page-item disabled">
                                <span className="page-link text-muted">of {totalPages}</span>
                                </li>
                            <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}> 
                                <button 
                                    className="page-link" 
                                    onClick={() => handlePageChange(currentPage + 1)} 
                                    disabled={currentPage >= totalPages}
                                >
                                    &raquo;
                                </button> 
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Render Modal Details */}
            <QuotationDetailsModal
               show={showDetailsModal}
               onClose={() => setShowDetailsModal(false)}
               quoteId={viewingQuoteId} // Truyền ID vào modal
               customerMap={customerMap}
               dealerMap={dealerMap}
               variantMap={variantMap}
           />
        </>
    );
};

export default QuotationManagement;