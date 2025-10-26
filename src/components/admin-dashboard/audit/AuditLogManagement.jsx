import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { AlertCircle, Search, Filter } from 'lucide-react'; 
import { getAllAuditLogs } from '../../../services/systemService';
import { getUserById } from '../../../services/dashboardService';
import AuditLogFilterPanel from './AuditLogFilterPanel';
import AuditLogDetailsModal from './AuditLogDetailsModal';

// --- Helper Functions ---
const formatDateTimestamp = (isoString) => {
    if (!isoString) return 'N/A';
    // Format: 25 Oct 2025, 15:16
    return new Date(isoString).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

const getAvatarInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length === 1) return name.substring(0, 1).toUpperCase();
    return (parts[0].substring(0, 1) + parts[parts.length - 1].substring(0, 1)).toUpperCase();
};

const AuditLogManagement = () => {
    const [logs, setLogs] = useState([]);
    const [userMap, setUserMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [activeFilters, setActiveFilters] = useState({
       timePeriod: 'all',
       roles: [],
       actions: [],
    });

    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [viewingLog, setViewingLog] = useState(null);

    // Thêm state cho việc export
    const [exportStatus, setExportStatus] = useState({
        csv: false,
        excel: false,
        pdf: false,
    });

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');
                const logsRes = await getAllAuditLogs();
                const fetchedLogs = logsRes.data?.data?.items || logsRes.data?.items || logsRes.data || [];
                setLogs(fetchedLogs);

                const userIds = [...new Set(fetchedLogs.map(log => log.userId).filter(Boolean))];
                const userPromises = userIds.map(id =>
                    getUserById(id).catch(err => {
                        console.warn(`Failed to fetch user ${id}:`, err);
                        return { data: { data: { id, fullName: `User (${id.slice(0, 8)}...)` } } };
                    })
                );
                const userResults = await Promise.all(userPromises);
                const uMap = userResults.reduce((acc, res) => {
                    const user = res.data?.data || res.data;
                    if (user?.id && user?.fullName) {
                        acc[user.id] = { name: user.fullName, role: user.role || 'Unknown' };
                    }
                    return acc;
                }, {});
                setUserMap(uMap);

            } catch (err) {
                 console.error("Failed to load audit logs:", err);
                setError(err.response?.data?.message || err.message || 'Failed to load audit logs');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Auto-hide alerts
    useEffect(() => {
        if (error) {
          const timer = setTimeout(() => { setError(''); }, 5000);
          return () => clearTimeout(timer);
        }
    }, [error]);

    // Filter Logic
    const filteredLogs = useMemo(() => {
        const searchLower = searchTerm.toLowerCase();

        return logs.filter(log => {
            const user = userMap[log.userId];
            const userName = (user?.name || log.userId || '').toLowerCase();
            const userRole = user?.role || 'Unknown'; 
            const entityId = (log.id || '').toLowerCase();
            const action = (log.action || '').toLowerCase();
            const description = (log.description || '').toLowerCase();
            const logDate = log.createdAt ? new Date(log.createdAt) : null;
            const formattedDate = logDate ? formatDateTimestamp(log.createdAt).toLowerCase() : '';

            // --- Apply Active Filters from Panel ---
            let matchesTime = true;
            if (logDate && activeFilters.timePeriod !== 'all') {
                const now = new Date();
                const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                if (activeFilters.timePeriod === 'today') {
                    matchesTime = logDate >= todayStart;
                } else if (activeFilters.timePeriod === 'last7days') {
                    const sevenDaysAgo = new Date(todayStart);
                    sevenDaysAgo.setDate(todayStart.getDate() - 7);
                    matchesTime = logDate >= sevenDaysAgo;
                } else if (activeFilters.timePeriod === 'last30days') {
                     const thirtyDaysAgo = new Date(todayStart);
                     thirtyDaysAgo.setDate(todayStart.getDate() - 30);
                     matchesTime = logDate >= thirtyDaysAgo;
                }
            }
            if (!matchesTime) return false;

            if (activeFilters.roles.length > 0 && !activeFilters.roles.includes(userRole)) {
                 return false;
            }

            if (activeFilters.actions.length > 0 && !activeFilters.actions.some(a => action.includes(a.toLowerCase()))) {
                 return false;
            }

            // --- Apply Search Term Filter ---
            if (!searchLower) return true; 

            return userName.includes(searchLower) ||
                   entityId.includes(searchLower) ||
                   action.includes(searchLower) ||
                   description.includes(searchLower) ||
                   formattedDate.includes(searchLower);
        });
    }, [logs, userMap, searchTerm, activeFilters]);

    // Pagination Logic
    const totalItems = filteredLogs.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const paginatedLogs = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredLogs.slice(startIndex, startIndex + pageSize);
    }, [filteredLogs, currentPage, pageSize]);

    // Handlers
    const handlePageSizeChange = (e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); };
    const handleSearchChange = (e) => { setSearchTerm(e.target.value); setCurrentPage(1); };
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
    const handleApplyFilters = (newFilters) => {
       setActiveFilters(newFilters);
       setCurrentPage(1);
    };
    const handleViewDetails = (log) => {
       setViewingLog(log);
       setShowDetailsModal(true);
    };

    // --- Logic xử lý Export ---
    const handleExport = async (format) => {
        // 1. Xử lý trường hợp PRINT (chỉ phía client)
        if (format === 'print') {
            window.print();
            return;
        }

        // 2. Xử lý các trường hợp gọi API (CSV, Excel, PDF)
        setExportStatus(prev => ({ ...prev, [format]: true }));
        setError('');

        try {
            // 3. Chuẩn bị query params (gửi filter lên server)
            const params = new URLSearchParams();
            
            // THÊM THAM SỐ FORMAT (HÃY KIỂM TRA LẠI VỚI BACKEND)
            params.append('format', format); // Ví dụ: 'csv', 'excel', 'pdf'

            // Thêm các filter đang hoạt động
            if (activeFilters.timePeriod !== 'all') {
                params.append('timePeriod', activeFilters.timePeriod);
            }
            if (searchTerm) {
                params.append('search', searchTerm);
            }
            activeFilters.roles.forEach(role => {
                params.append('roles', role); // Gửi nhiều lần
            });
            activeFilters.actions.forEach(action => {
                params.append('actions', action); // Gửi nhiều lần
            });

            // 4. Gọi API bằng Axios (để nhận file)
            // Bạn CẦN thay đổi 'axios.get' bằng service API của bạn nếu có
            const response = await axios.get('/api/audit-logs/export', {
                params: params,
                responseType: 'blob', // Rất quan trọng: để nhận file
            });

            // 5. Xử lý file trả về
            const blob = new Blob([response.data], { type: response.headers['content-type'] });

            // 6. Lấy tên file từ header (nếu backend gửi)
            const contentDisposition = response.headers['content-disposition'];
            let filename = `AuditLogs_${new Date().toISOString().split('T')[0]}.${format}`;
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?(.+?)"?$/);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1];
                }
            }

            // 7. Tạo link và trigger download
            const link = document.createElement('a');
            const url = window.URL.createObjectURL(blob);
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error("Export failed:", err);
            setError(err.response?.data?.message || err.message || "Failed to generate export file.");
        } finally {
            setExportStatus(prev => ({ ...prev, [format]: false }));
        }
    };
    
    if (loading) {
         return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
    }

    return (
        <>
            {/* Bạn nên chuyển cái này vào file CSS chung của dự án */}
            <style>{`
                @media print {
                    body, #__next, .layout-wrapper, .layout-navbar, .layout-menu, .layout-footer, .card-header, .card-footer, .alert {
                        visibility: hidden !important;
                        display: none !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }

                    .layout-page, .content-wrapper, .container-xxl, .card {
                        visibility: visible !important;
                        display: block !important;
                        box-shadow: none !important;
                        border: none !important;
                    }
                    
                    .table-responsive {
                        visibility: visible !important;
                        overflow: visible !important;
                    }

                    .table {
                        visibility: visible !important;
                        width: 100% !important;
                    }

                    /* Ẩn cột 'Actions' khi in */
                    .table th:last-child,
                    .table td:last-child {
                        display: none !important;
                    }
                }
            `}</style>

            {/* Error Alert */}
            {error && (
                <div className="alert alert-danger alert-dismissible d-flex align-items-center mb-4" role="alert">
                  <AlertCircle size={20} className="me-2" />
                  <div className="flex-grow-1">{error}</div>
                  <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
            )}

            <div className="card">
                {/* Filter Bar */}
                <div className="card-header border-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex gap-2">
                            {/* Filter Button */}
                            <button
                                className="btn btn-outline-secondary d-flex align-items-center"
                                type="button"
                                onClick={() => setShowFilterPanel(true)}
                            >
                                <Filter size={16} className="me-1" /> Filter
                            </button>
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

                                    {/* CSV */}
                                    <li><button className="dropdown-item" onClick={() => handleExport('csv')} disabled={exportStatus.csv}>
                                        {exportStatus.csv ? <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> : null}
                                        <i className='bx bx-file me-2'></i> CSV
                                    </button></li>

                                    {/* Excel */}
                                    <li><button className="dropdown-item" onClick={() => handleExport('excel')} disabled={exportStatus.excel}>
                                        {exportStatus.excel ? <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> : null}
                                        <i className='bx bx-file-blank me-2'></i> Excel
                                    </button></li>

                                    {/* PDF */}
                                    <li><button className="dropdown-item" onClick={() => handleExport('pdf')} disabled={exportStatus.pdf}>
                                        {exportStatus.pdf ? <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> : null}
                                        <i className='bx bxs-file-pdf me-2'></i> PDF
                                    </button></li>

                                    {/* Print */}
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><button className="dropdown-item" onClick={() => handleExport('print')}>
                                        <i className='bx bx-printer me-2'></i> Print
                                    </button></li>
                                </ul>
                            </div>
                        </div>
                        
                        {/* Search Bar */}
                        <div className="input-group input-group-merge" style={{ maxWidth: '300px' }}>
                            <span className="input-group-text"><Search size={16} /></span>
                            <input
                                type="search"
                                className="form-control"
                                placeholder="Search logs..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                aria-label="Search logs"
                            />
                        </div>
                   </div>
                </div>

                {/* Table */}
                <div className="table-responsive text-nowrap">
                    {/* CSS for hover effect */}
                    <style>{`
                        .table-hover tbody tr .action-view-detail {
                            visibility: hidden;
                            opacity: 0;
                            transition: opacity 0.2s ease-in-out;
                        }
                        .table-hover tbody tr:hover .action-view-detail {
                            visibility: visible;
                            opacity: 1;
                        }
                    `}</style>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Entity ID</th>
                                <th>Action</th>
                                <th>Description</th>
                                <th>Timestamp</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-border-bottom-0">
                            {paginatedLogs.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-4">
                                    {totalItems === 0 && !searchTerm && activeFilters.timePeriod === 'all' && activeFilters.roles.length === 0 && activeFilters.actions.length === 0
                                        ? 'No logs found'
                                        : 'No logs match your filter'}
                                </td></tr>
                            ) : (
                                paginatedLogs.map(log => {
                                    const user = userMap[log.userId];
                                    return (
                                        <tr key={log.id}>
                                            <td>
                                                <div className="d-flex justify-content-start align-items-center">
                                                    <div className="avatar avatar-sm me-3">
                                                        <span className="avatar-initial rounded-circle bg-label-secondary">
                                                            {getAvatarInitials(user?.name)}
                                                        </span>
                                                    </div>
                                                    <div className="d-flex flex-column">
                                                        <span className="fw-semibold">{user?.name || log.userId || 'System'}</span>
                                                            <small className="text-muted">{user?.role || 'Unknown'}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><code className="text-muted">{log.id ? log.id.slice(0, 8) + '...' : '-'}</code></td>
                                            <td><span className="badge bg-label-primary text-uppercase">{log.action || 'N/A'}</span></td>
                                            <td>{log.description || '-'}</td>
                                            <td>{formatDateTimestamp(log.createdAt)}</td>
                                            <td>
                                               <button
                                                    type="button"
                                                    className="btn btn-icon btn-text-secondary rounded-pill btn-sm"
                                                    onClick={() => handleViewDetails(log)}
                                                    title="View Log Details"
                                                >
                                                   <i className="bx bx-show"></i>
                                                </button>
                                           </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer: Item Count, Pagination, Show Entries */}
                <div className="d-flex justify-content-between align-items-center p-3 border-top">
                     <small className="text-muted">
                        {totalItems} items
                     </small>
                     <nav>
                        <ul className="pagination pagination-sm mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                            </li>
                            <li className="page-item active" aria-current="page"><span className="page-link">{currentPage}</span></li>
                            <li className="page-item disabled"><span className="page-link text-muted">of {totalPages}</span></li>
                            <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages}>Next</button>
                            </li>
                        </ul>
                     </nav>
                     <div>
                        <label className="d-flex align-items-center">
                            Show&nbsp;
                            <select className="form-select form-select-sm" value={pageSize} onChange={handlePageSizeChange} style={{width:'auto'}}>
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </label>
                    </div>
                </div>
            </div>
            

            {/* Filter Panel (Offcanvas) */}
            <AuditLogFilterPanel
                show={showFilterPanel}
                onClose={() => setShowFilterPanel(false)}
                currentFilters={activeFilters}
                onApplyFilters={handleApplyFilters}
            />

            {/* Details Modal */}
            <AuditLogDetailsModal
               show={showDetailsModal}
               onClose={() => setShowDetailsModal(false)}
               log={viewingLog}
               userMap={userMap}
           />
        </>
    );
};

export default AuditLogManagement;