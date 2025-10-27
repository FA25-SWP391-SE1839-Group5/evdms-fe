import React, { useState, useEffect, useMemo } from 'react';
import { AlertCircle, CheckCircle, Plus, Edit, Trash, Percent, Calendar } from 'lucide-react'; 
import { getAllPromotions, deletePromotion } from '../../../services/promotionService';
import PromotionModal from './PromotionModal';

// --- Helper Functions ---
const formatDate = (isoString) => isoString ? new Date(isoString).toLocaleString('en-GB') : 'N/A';
const formatPercent = (percent) => (percent === null || percent === undefined) ? '-' : `${percent}%`;

// Render Status Badge (Active/Expired/Upcoming)
const RenderPromotionStatus = ({ startDate, endDate }) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now > end) return <span className="badge bg-label-secondary">Expired</span>;
    if (now < start) return <span className="badge bg-label-info">Upcoming</span>;
    return <span className="badge bg-label-success">Active</span>;
};

export default function PromotionManagement() {
    return (
        <div>PromotionManagement</div>
    )
}
