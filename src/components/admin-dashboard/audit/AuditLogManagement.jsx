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

    return (
        <div>
            
        </div>
    )
}
