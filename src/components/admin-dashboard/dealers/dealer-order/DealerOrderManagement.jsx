import React, { useState, useEffect, useMemo } from 'react';
import { AlertCircle, CheckCircle, Plus, Edit, Trash, FileText } from 'lucide-react';
import { getAllDealerOrders, deleteDealerOrder, getAllDealers, getAllVehicleVariants } from '../../../../services/dealerService';
import DealerOrderModal from './DealerOrderModal';

// --- Helper Functions ---
const formatOrderId = (id) => {
    // Chỉ hiển thị vài ký tự cuối của ID cho gọn
    return `#${id?.slice(-6).toUpperCase() || 'N/A'}`; 
};

const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString('en-GB'); // Format en-GB: DD/MM/YYYY, HH:MM:SS
};

// Render Status Badge based on API status
const RenderOrderStatus = ({ status }) => {
    let badgeClass = 'secondary'; // Default
    switch (status?.toLowerCase()) {
        case 'pending': badgeClass = 'warning'; break;
        case 'processing': badgeClass = 'info'; break;
        case 'shipped': badgeClass = 'primary'; break;
        case 'delivered': badgeClass = 'success'; break;
        case 'cancelled': badgeClass = 'danger'; break;
    }
    return <span className={`badge bg-label-${badgeClass}`}>{status || 'N/A'}</span>;
};

export default function DealerOrderManagement() {
  return (
    <div>

    </div>
  )
}
