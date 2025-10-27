import React, { useState, useEffect, useMemo } from 'react';
import { AlertCircle, CheckCircle, Plus, Edit, Trash, Filter } from 'lucide-react'; // Added Filter
import {
    getAllVehicles,
    deleteVehicle,
    getAllVehicleVariants,
} from '../../../../services/vehicleService'; // Adjust path if needed
import { getAllDealers } from '../../../../services/dealerService'; 
import VehicleStockModal from './VehicleStockModal';
import VehicleDetailsModal from './VehicleDetailsModal';
import VehicleStockStatsCards from './VehicleStockStatsCards';
// Import filter panel
import VehicleStockFilterPanel from './VehicleStockFilterPanel';

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

const VehicleStockList = () => {
    const [vehicles, setVehicles] = useState([]);
    const [variantsMap, setVariantsMap] = useState({}); // { variantId: variantName }
    const [dealersMap, setDealersMap] = useState({});   // { dealerId: dealerName }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false); // For Add/Edit
    const [vehicleToEdit, setVehicleToEdit] = useState(null);

    // Data lists to pass down to modals
    const [allVariantsData, setAllVariantsData] = useState([]);
    const [allDealers, setAllDealers] = useState([]);

    // Search & Pagination
    const [searchTerm, setSearchTerm] = useState(''); // Global search
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Details Modal State
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [viewingVehicle, setViewingVehicle] = useState(null);

    // Filter Panel State
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [activeFilters, setActiveFilters] = useState({
        variantId: '',
        dealerId: '',
        color: '',
        type: '',
        status: '',
    });

    // Fetch Initial Data (Vehicles, Variants, Dealers)
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

                // Adjust data access based on your API structure
                setVehicles(vehiclesRes.data?.data?.items || vehiclesRes.data?.items || vehiclesRes.data || []);

                const variantList = variantsRes.data?.data?.items || variantsRes.data?.items || variantsRes.data || [];
                setAllVariantsData(variantList);
                const vMap = variantList.reduce((acc, v) => { acc[v.id] = v.name; return acc; }, {});
                setVariantsMap(vMap);

                const dealerList = dealersRes.data?.data?.items || dealersRes.data?.items || dealersRes.data || [];
                setAllDealers(dealerList);
                const dMap = dealerList.reduce((acc, d) => { acc[d.id] = d.name; return acc; }, {});
                setDealersMap(dMap);

            } catch (err) {
                 setError(err.response?.data?.message || err.message || 'Failed to load initial stock data');
                 console.error("Fetch Stock Data Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []); // Run only on mount

    // Auto-hide alerts
    useEffect(() => {
        if (error || success) {
          const timer = setTimeout(() => { setError(''); setSuccess(''); }, 5000);
          return () => clearTimeout(timer);
        }
    }, [error, success]);

    // Filter Logic: Apply panel filters first, then global search
    const filteredVehicles = useMemo(() => {
        const searchLower = searchTerm.toLowerCase();
        const filters = activeFilters;

        return vehicles.filter(v => {
           // Apply panel filters
           if (filters.variantId && v.variantId !== filters.variantId) return false;
           // Handle 'unassigned' for dealer filter
           if (filters.dealerId && filters.dealerId === 'unassigned' && v.dealerId) return false; // Filter for unassigned, but vehicle IS assigned
           if (filters.dealerId && filters.dealerId !== 'unassigned' && v.dealerId !== filters.dealerId) return false; // Filter for specific dealer
           // Case-insensitive color filter
           if (filters.color && !v.color?.toLowerCase().includes(filters.color.toLowerCase())) return false;
           if (filters.type && v.type !== filters.type) return false;
           if (filters.status && v.status !== filters.status) return false;

           // Apply global search if term exists
           if (!searchLower) return true; // Passed panel filters, no search term

           // Search across relevant fields
            return v.vin?.toLowerCase().includes(searchLower) ||
                   (v.color || '').toLowerCase().includes(searchLower) ||
                   (variantsMap[v.variantId] || '').toLowerCase().includes(searchLower) ||
                   (dealersMap[v.dealerId] || '').toLowerCase().includes(searchLower) ||
                   (v.status || '').toLowerCase().includes(searchLower) ||
                   (v.type || '').toLowerCase().includes(searchLower);
        });
    }, [vehicles, variantsMap, dealersMap, searchTerm, activeFilters]); // Include activeFilters

    // Pagination Logic
    const totalItems = filteredVehicles.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const paginatedVehicles = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredVehicles.slice(startIndex, startIndex + pageSize);
    }, [filteredVehicles, currentPage, pageSize]);
    const startEntry = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endEntry = Math.min(currentPage * pageSize, totalItems);

    // --- Handlers ---
    const reloadVehicles = async () => {
        try {
             // Optional: Show loading indicator during reload
             // setLoading(true);
             const vehiclesRes = await getAllVehicles();
             setVehicles(vehiclesRes.data?.data?.items || vehiclesRes.data?.items || vehiclesRes.data || []);
        } catch(err) {
            setError('Failed to reload vehicles.');
            console.error("Reload vehicles error:", err);
        } finally {
            // setLoading(false);
        }
    };
    const handleAdd = () => { setVehicleToEdit(null); setShowModal(true); };
    const handleEdit = (vehicle) => { setVehicleToEdit(vehicle); setShowModal(true); };
    const handleDelete = async (vehicleId, vehicleVin) => {
        if (!window.confirm(`Delete vehicle with VIN "${vehicleVin}"?`)) return;
        try {
            await deleteVehicle(vehicleId);
            setSuccess(`Vehicle VIN "${vehicleVin}" deleted.`);
            reloadVehicles(); // Reload list after delete
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete vehicle.');
        }
    };
    const handleSaveSuccess = (isEdit) => {
        setShowModal(false);
        setVehicleToEdit(null);
        setSuccess(`Vehicle ${isEdit ? 'updated' : 'added'} successfully.`);
        reloadVehicles(); // Reload list after add/edit
    };
    const handlePageSizeChange = (e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); };
    const handleSearchChange = (e) => { setSearchTerm(e.target.value); setCurrentPage(1); };
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
    const handleViewDetails = (vehicle) => {
       const variantDetail = allVariantsData.find(v => v.id === vehicle.variantId);
        setViewingVehicle({
            ...vehicle,
            variantDetails: variantDetail
        });
        setShowDetailsModal(true);
    };
    // Handler to apply filters from panel
    const handleApplyFilters = (newFilters) => {
        setActiveFilters(newFilters);
        setCurrentPage(1); // Reset pagination
    };
    // --- End Handlers ---

    if (loading) {
         return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
    }

    return (
        <>
           {/* Stats Cards */}
           <VehicleStockStatsCards vehicles={vehicles} />

            {/* Alerts */}
            {(error || success) && (
                <div className="mb-4">
                    {error && (
                        <div className="alert alert-danger alert-dismissible d-flex align-items-center" role="alert">
                          <AlertCircle size={20} className="me-2" />
                          <div className="flex-grow-1">{error}</div>
                          <button type="button" className="btn-close" onClick={() => setError('')}></button>
                        </div>
                     )}
                     {success && (
                        <div className="alert alert-success alert-dismissible d-flex align-items-center" role="alert">
                            <CheckCircle size={20} className="me-2" />
                            <div className="flex-grow-1">{success}</div>
                            <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                        </div>
                     )}
                </div>
            )}

            <div className="card">
                {/* Header with Filter Button */}
                <div className="card-header border-bottom">
                   <div className="d-flex justify-content-between align-items-center row py-3 gap-3 gap-md-0">
                        {/* Left Side */}
                        <div className="col-md-auto d-flex align-items-center gap-3">
                            {/* Show entries */}
                            <label className="d-flex align-items-center"> 
                                Show&nbsp; 
                                <select 
                                    className="form-select" 
                                    value={pageSize} 
                                    onChange={handlePageSizeChange} 
                                    style={{width:'auto'}}
                                > 
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option> 
                                </select> 
                                &nbsp;entries 
                            </label>
                            {/* Filter Button */}
                            <button
                                className="btn btn-outline-secondary d-flex align-items-center"
                                type="button"
                                onClick={() => setShowFilterPanel(true)}
                            >
                                <Filter size={16} className="me-1" /> Filter
                            </button>
                        </div>
                        {/* Right Side */}
                        <div className="col-md-auto ms-auto d-flex align-items-center gap-3">
                            {/* Search */}
                            <input 
                                type="search" 
                                className="form-control" 
                                placeholder="Search VIN, Color, etc..." 
                                value={searchTerm} 
                                onChange={handleSearchChange} 
                                style={{width: '250px'}} 
                            />
                            {/* Add Button */}
                            <button 
                                className="btn btn-primary rounded-pill d-flex align-items-center" 
                                type="button" 
                                onClick={handleAdd}
                            > 
                                <Plus size={18} className="me-1"/> Add Vehicle 
                            </button>
                         </div>
                    </div>
                </div>

                {/* Table */}
                <div className="table-responsive text-nowrap">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>VIN</th>
                                <th>Variant</th>
                                <th>Color</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Assigned Dealer</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-border-bottom-0">
                            {paginatedVehicles.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-4">
                                     {totalItems === 0 && !searchTerm && !activeFilters.variantId && !activeFilters.dealerId && !activeFilters.color && !activeFilters.type && !activeFilters.status
                                        ? 'No vehicles in stock found'
                                        : 'No vehicles match your filters'}
                                </td></tr>
                            ) : (
                                paginatedVehicles.map(v => (
                                    <tr key={v.id}>
                                        <td>
                                           <button
                                               type="button"
                                               className="btn btn-link p-0 fw-semibold text-primary"
                                               onClick={() => handleViewDetails(v)}
                                               title={`View details for VIN: ${v.vin}`}
                                               style={{ textDecoration: 'none' }}
                                           >
                                               <code>{v.vin || 'N/A'}</code>
                                           </button>
                                        </td>
                                        <td>{variantsMap[v.variantId] || 'Unknown'}</td>
                                        <td>{v.color}</td>
                                        <td>{v.type}</td>
                                        <td><RenderVehicleStatus status={v.status} /></td>
                                        <td>{dealersMap[v.dealerId] || '-'}</td>
                                        <td>
                                            <div className="d-inline-block text-nowrap">
                                                <button className="btn btn-sm btn-icon" title="Edit" onClick={() => handleEdit(v)}><i className="bx bx-edit"></i></button>
                                                <button className="btn btn-sm btn-icon delete-record" title="Delete" onClick={() => handleDelete(v.id, v.vin)}><i className="bx bx-trash"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="d-flex justify-content-between align-items-center p-3 border-top">
                    <small className="text-muted">Showing {startEntry} to {endEntry} of {totalItems} entries</small>
                    <nav>
                        <ul className="pagination pagination-sm mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&laquo;</button>
                            </li>
                            {/* Optional: Add page number links here */}
                            <li className="page-item active" aria-current="page"><span className="page-link">{currentPage}</span></li>
                             <li className="page-item disabled"><span className="page-link text-muted">of {totalPages}</span></li>
                            <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages}>&raquo;</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Modal Add/Edit */}
            <VehicleStockModal
                show={showModal}
                onClose={() => { setShowModal(false); setVehicleToEdit(null); }}
                onSaveSuccess={handleSaveSuccess}
                vehicleToEdit={vehicleToEdit}
                variants={allVariantsData}
                dealers={allDealers}
            />

            {/* Modal Details */}
           <VehicleDetailsModal
               show={showDetailsModal}
               onClose={() => setShowDetailsModal(false)}
               vehicle={viewingVehicle}
               variant={viewingVehicle?.variantDetails}
               dealersMap={dealersMap}
           />

           {/* Filter Panel */}
           <VehicleStockFilterPanel
               show={showFilterPanel}
               onClose={() => setShowFilterPanel(false)}
               currentFilters={activeFilters}
               onApplyFilters={handleApplyFilters}
               variants={allVariantsData} // Pass variants list
               dealers={allDealers}     // Pass dealers list
           />
        </>
    );
};

export default VehicleStockList;