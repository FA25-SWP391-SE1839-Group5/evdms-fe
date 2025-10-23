import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Plus, Edit, Trash, Check, X, MoreVertical } from 'lucide-react';
import {
    getAllDealerPayments,
    deleteDealerPayment,
    markPaymentPaid,
    markPaymentFailed,
    getAllDealers,
} from '../../../../services/dealerService';
import DealerPaymentModal from './DealerPaymentModal';
import DealerPaymentStatsCards from './DealerPaymentStatsCards';

// --- Helper Functions ---
const formatPaymentId = (id) => `#${id?.slice(-6).toUpperCase() || 'N/A'}`;
const formatDate = (isoString) => isoString ? new Date(isoString).toLocaleString('en-GB') : 'N/A';
const formatCurrency = (amount) => typeof amount === 'number' ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount) : 'N/A';

const RenderPaymentStatus = ({ status }) => {
    let badgeClass = 'secondary';
    let icon = null; // Optional icon
    switch (status?.toLowerCase()) {
        case 'pending': badgeClass = 'warning'; icon = <Clock size={14} className="me-1"/>; break;
        case 'paid': badgeClass = 'success'; icon = <CheckCircle size={14} className="me-1"/>; break;
        case 'failed': badgeClass = 'danger'; icon = <XCircle size={14} className="me-1"/>; break;
    }
    // Mimic invoice list style
    return <span className={`badge rounded-pill bg-label-${badgeClass} d-flex align-items-center p-1 px-2`}><span className="dot bg-${badgeClass} me-1"></span> {status || 'N/A'}</span>;

    // Original badge style:
    // return <span className={`badge bg-label-${badgeClass}`}>{status || 'N/A'}</span>;
};

export default function DealerPaymentManagement() {
    const [payments, setPayments] = useState([]);
    const [dealers, setDealers] = useState([]);
    const [dealerMap, setDealerMap] = useState({});
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showFormModal, setShowFormModal] = useState(false);
    const [paymentToEdit, setPaymentToEdit] = useState(null);

    // Pagination & Filter State
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState(''); // Filter dropdown
    const [globalSearch, setGlobalSearch] = useState(''); // Search input

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingData(true);
                setError('');
                const [paymentsRes, dealersRes] = await Promise.all([
                    getAllDealerPayments(),
                    getAllDealers(),
                ]);
                setPayments(paymentsRes.data?.data?.items || paymentsRes.data?.items || paymentsRes.data || []);
                const dealerList = dealersRes.data?.data?.items || dealersRes.data?.items || dealersRes.data || [];
                setDealers(dealerList);
                const dMap = dealerList.reduce((acc, d) => { acc[d.id] = d.name; return acc; }, {});
                setDealerMap(dMap);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to load page data');
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
    const filteredPayments = useMemo(() => {
        return payments.filter(p => {
            const dealerName = (dealerMap[p.dealerId] || '').toLowerCase();
            const amount = String(p.amount || '').toLowerCase();
            const method = (p.paymentMethod || '').toLowerCase();
            const status = (p.status || '').toLowerCase();
            const date = formatDate(p.createdAt || p.updatedAt).toLowerCase();
            const id = formatPaymentId(p.id).toLowerCase();

            // Status filter first
            if (statusFilter && status !== statusFilter.toLowerCase()) {
                return false;
            }
            // Global search
            if (globalSearch) {
                const searchLower = globalSearch.toLowerCase();
                if (
                    !id.includes(searchLower) &&
                    !dealerName.includes(searchLower) &&
                    !amount.includes(searchLower) &&
                    !method.includes(searchLower) &&
                    !date.includes(searchLower)
                    // Don't search status text here, use filter dropdown
                ) {
                    return false;
                }
            }
            return true; // Passed filters
        });
    }, [payments, dealerMap, statusFilter, globalSearch]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredPayments.length / pageSize);
    const paginatedPayments = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredPayments.slice(startIndex, startIndex + pageSize);
    }, [filteredPayments, currentPage, pageSize]);
    const startEntry = filteredPayments.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endEntry = Math.min(currentPage * pageSize, filteredPayments.length);

    return (
        <div>

        </div>
    )
}
