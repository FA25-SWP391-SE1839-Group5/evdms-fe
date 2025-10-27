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
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [promotionToEdit, setPromotionToEdit] = useState(null);

    // Pagination & Search
    const [searchTerm, setSearchTerm] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch data
    useEffect(() => {
        fetchPromotions();
    }, []);

    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError('');
                setSuccess('');
        }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    const fetchPromotions = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await getAllPromotions();
            setPromotions(response.data?.data?.items || response.data?.items || response.data || []);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to load promotions');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>PromotionManagement</div>
    )
}
