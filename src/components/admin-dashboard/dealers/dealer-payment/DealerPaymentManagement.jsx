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

export default function DealerPaymentManagement() {
    return (
        <div>

        </div>
    )
}
