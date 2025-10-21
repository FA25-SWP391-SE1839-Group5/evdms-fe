import React from 'react';
import { AlertCircle, CheckCircle, Plus, Edit, Trash } from 'lucide-react';
import { getAllDealers, getAllDealerContracts, deleteDealerContract } from '../../../../services/dealerService';

// Hàm helper để render status badge
const RenderContractStatus = ({ startDate, endDate }) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now > end) {
        return <span className="badge bg-label-secondary">Expired</span>;
    }
    if (now < start) {
        return <span className="badge bg-label-info">Pending</span>;
    }
    return <span className="badge bg-label-success">Active</span>;
};

// Hàm helper để format tiền
const formatCurrency = (amount) => {
    if (typeof amount !== 'number') {
        return 'N/A';
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default function DealerContractManagement() {
  return (
    <div>
        
    </div>
  )
}
