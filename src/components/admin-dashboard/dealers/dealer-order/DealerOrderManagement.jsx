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
    const [orders, setOrders] = useState([]);
    const [dealers, setDealers] = useState([]);
    const [dealerMap, setDealerMap] = useState({});

    const [variantMap, setVariantMap] = useState({});
    const [loadingData, setLoadingData] = useState(true); // Đổi tên state loading chính

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showFormModal, setShowFormModal] = useState(false);
    const [orderToEdit, setOrderToEdit] = useState(null);

    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterOrderId, setFilterOrderId] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterDealer, setFilterDealer] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [globalSearch, setGlobalSearch] = useState('');

    // fetchData to load 3 API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingData(true); 
                setError(''); 

                // Fetch Orders, Dealers, và Variants
                const [ordersRes, dealersRes, variantsRes] = await Promise.all([
                    getAllDealerOrders(),
                    getAllDealers(),
                    getAllVehicleVariants(), 
                ]);

                // Handle Orders
                setOrders(ordersRes.data?.data?.items || ordersRes.data?.items || ordersRes.data || []);

                // Handle Dealers và Dealer Map
                const dealerList = dealersRes.data?.data?.items || dealersRes.data?.items || dealersRes.data || [];
                setDealers(dealerList);
                const dMap = dealerList.reduce((acc, dealer) => {
                    acc[dealer.id] = dealer.name; return acc;
                }, {});
                setDealerMap(dMap);

                // Handle Variants và Variant Map
                const variantList = variantsRes.data?.data?.items || variantsRes.data?.items || variantsRes.data || [];
                const vMap = variantList.reduce((acc, variant) => {
                    acc[variant.id] = variant.name; return acc;
                }, {});
                setVariantMap(vMap); 

            } catch (err) {
                console.error("Failed to load data:", err);
                const errorMsg = err.response?.data?.message || err.message || 'Failed to load page data';
                if (err.config?.url?.includes('vehicle-variants')) {
                     setError(`Failed to load vehicle variants: ${errorMsg}`);
                } else {
                     setError(errorMsg);
                }
            } finally {
                setLoadingData(false); 
            }
        };
        fetchData();
    }, []);







    return (
        <div>

        </div>
    )
}
