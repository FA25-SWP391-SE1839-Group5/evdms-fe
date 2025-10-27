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
  return (
    <div>SalesOrderManagement</div>
  )
}
