import React, { useState, useEffect, useMemo } from 'react'
import { AlertCircle, CheckCircle, Plus, Edit, Trash } from 'lucide-react';
import {
    getAllVehicles,
    deleteVehicle,
    getAllVehicleVariants, 
    getAllDealers         
} from '../../../../services/vehicleService';
import VehicleStockModal from './VehicleStockModal';

// Helper Function - Render Status Badge
const RenderVehicleStatus = ({ status }) => {
    let badgeClass = 'secondary';
    switch (status?.toLowerCase()) {
        case 'available': badgeClass = 'success'; break;
        case 'reserved': badgeClass = 'warning'; break;
        case 'sold': badgeClass = 'danger'; break;
        case 'intransit': badgeClass = 'info'; break;
    }
    return <span className={`badge bg-label-${badgeClass}`}>{status || 'N/A'}</span>;
};

export default function VehicleStockList() {
    const [vehicles, setVehicles] = useState([]);
    const [variantsMap, setVariantsMap] = useState({}); // { variantId: variantName }
    const [dealersMap, setDealersMap] = useState({});   // { dealerId: dealerName }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [vehicleToEdit, setVehicleToEdit] = useState(null);

    // Temp state to pass data to modal (can be optimized)
    const [allVariants, setAllVariants] = useState([]);
    const [allDealers, setAllDealers] = useState([]);

    // Pagination & Search
    const [searchTerm, setSearchTerm] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch Data (Vehicles, Variants, Dealers)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');
                const [vehiclesRes, variantsRes, dealersRes] = await Promise.all([
                    getAllVehicles(),
                    getAllVehicleVariants(),
                    getAllDealers()
                ]);

                setVehicles(vehiclesRes.data?.data?.items || vehiclesRes.data?.items || vehiclesRes.data || []);

                const variantList = variantsRes.data?.data?.items || variantsRes.data?.items || variantsRes.data || [];
                setAllVariants(variantList); // Store list for modal
                const vMap = variantList.reduce((acc, v) => { acc[v.id] = v.name; return acc; }, {});
                setVariantsMap(vMap);

                const dealerList = dealersRes.data?.data?.items || dealersRes.data?.items || dealersRes.data || [];
                setAllDealers(dealerList); // Store list for modal
                const dMap = dealerList.reduce((acc, d) => { acc[d.id] = d.name; return acc; }, {});
                setDealersMap(dMap);

            } catch (err) {
                 setError(err.response?.data?.message || err.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Auto-hide alerts
    useEffect(() => {
        if (error || success) {
          const timer = setTimeout(() => {
            setError('');
            setSuccess('');
          }, 5000);
          return () => clearTimeout(timer);
        }
    }, [error, success]);

    // Filter & Paginate
    const filteredVehicles = useMemo(() => {
        const searchLower = searchTerm.toLowerCase();
        return vehicles.filter(v =>
            v.vin?.toLowerCase().includes(searchLower) ||
            v.color?.toLowerCase().includes(searchLower) ||
            v.type?.toLowerCase().includes(searchLower) ||
            v.status?.toLowerCase().includes(searchLower) ||
            variantsMap[v.variantId]?.toLowerCase().includes(searchLower) ||
            dealersMap[v.dealerId]?.toLowerCase().includes(searchLower)
        );
    }, [vehicles, variantsMap, dealersMap, searchTerm]);

    const totalPages = Math.ceil(filteredVehicles.length / pageSize);
    const paginatedVehicles = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredVehicles.slice(startIndex, startIndex + pageSize);
    }, [filteredVehicles, currentPage, pageSize]);
    const startEntry = filteredVehicles.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endEntry = Math.min(currentPage * pageSize, filteredVehicles.length);
    
    return (
        <div>VehicleStockList</div>
    )
}
