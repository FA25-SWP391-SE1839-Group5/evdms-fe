import React from 'react';
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
    return (
        <div>

        </div>
    )
}
