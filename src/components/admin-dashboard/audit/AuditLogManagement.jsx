import React from 'react'
import { AlertCircle, CheckCircle, Download } from 'lucide-react';
import { getAllAuditLogs, exportAuditLogs } from '../../../services/systemService';
import { getUserById } from '../../../services/dashboardService';

// --- Helper Functions ---
const formatDate = (isoString) => isoString ? new Date(isoString).toLocaleString('en-GB') : 'N/A';

export default function AuditLogManagement() {
    const [logs, setLogs] = useState([]);
    const [userMap, setUserMap] = useState({}); // Lưu { userId: userName }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(''); // Cho thông báo export
    const [exporting, setExporting] = useState(false); // Trạng thái đang export

    // Pagination & Filter State 
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');
                const logsRes = await getAllAuditLogs();
                const fetchedLogs = logsRes.data?.data?.items || logsRes.data?.items || logsRes.data || [];
                setLogs(fetchedLogs);

                // Lấy danh sách user IDs duy nhất từ logs
                const userIds = [...new Set(fetchedLogs.map(log => log.userId).filter(Boolean))];

                // Fetch thông tin user tương ứng (có thể tối ưu hóa nếu có API lấy nhiều user)
                const userPromises = userIds.map(id => getUserById(id).catch(err => ({ data: { data: { id, fullName: `User (${id.slice(0, 8)}...)` } } }))); // Xử lý lỗi nếu get user fail
                const userResults = await Promise.all(userPromises);

                const uMap = userResults.reduce((acc, res) => {
                    const user = res.data?.data || res.data; // Điều chỉnh theo cấu trúc API user
                    if (user?.id && user?.fullName) {
                        acc[user.id] = user.fullName;
                    }
                    return acc;
                }, {});
                setUserMap(uMap);

            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to load audit logs');
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
    const filteredLogs = useMemo(() => {
        const searchLower = searchTerm.toLowerCase();
        return logs.filter(log => {
            const userName = (userMap[log.userId] || log.userId || '').toLowerCase();
            const action = (log.action || '').toLowerCase();
            const description = (log.description || '').toLowerCase();
            const date = formatDate(log.createdAt).toLowerCase(); // Giả sử có createdAt

            return userName.includes(searchLower) ||
                   action.includes(searchLower) ||
                   description.includes(searchLower) ||
                   date.includes(searchLower);
        });
    }, [logs, userMap, searchTerm]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredLogs.length / pageSize);
    const paginatedLogs = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredLogs.slice(startIndex, startIndex + pageSize);
    }, [filteredLogs, currentPage, pageSize]);
    const startEntry = filteredLogs.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endEntry = Math.min(currentPage * pageSize, filteredLogs.length);

    // Handlers
    const handlePageSizeChange = (e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); };
    const handleSearchChange = (e) => { setSearchTerm(e.target.value); setCurrentPage(1); };

    // Handle Export
    const handleExport = async (format) => {
        setExporting(true);
        setError('');
        setSuccess('');
        try {
            const result = await exportAuditLogs(format);
            setSuccess(result.message || `Exported logs as ${format.toUpperCase()}.`);
        } catch (err) {
            setError(err.message || `Failed to export logs as ${format.toUpperCase()}.`);
        } finally {
            setExporting(false);
        }
    };

    if (loading) {
        return <div className="text-center p-4"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
    }

    return (
        <>
        <h4 className="fw-bold py-3 mb-4">
            <span className="text-muted fw-light">System /</span> Audit Logs
        </h4>

        {/* Alerts within card-body or above card */}
        {(error || success) && (
            <div className="card-body pb-0">
                {error && (
                    <div className="alert alert-danger alert-dismissible d-flex align-items-center mb-0" role="alert">
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
                    <div className="alert alert-success alert-dismissible d-flex align-items-center mb-0" role="alert">
                        <CheckCircle size={20} className="me-2" />
                        <div className="flex-grow-1">{success}</div>
                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={() => setSuccess('')}
                        ></button>
                    </div>
                )}
            </div>
        )}

        <div className="card">
            {/* Header: Show, Search, Export */}
            <div className="card-header border-bottom d-flex justify-content-between align-items-center">

                {/* Left: Show entries */}
                <div>
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
                            <option>100</option>
                        </select>
                        &nbsp;entries
                    </label>
                </div>

                {/* Right: Search + Export */}
                <div className="d-flex align-items-center gap-3">
                    <input
                        type="search"
                        className="form-control"
                        placeholder="Search logs..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        style={{width: '250px'}}
                    />
                </div>
            </div>
        </div>

        </>
    )
}
