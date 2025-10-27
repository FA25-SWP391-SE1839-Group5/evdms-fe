import React, { useState, useEffect, useMemo } from 'react'
import { AlertCircle, CheckCircle, Plus, Edit, Trash } from 'lucide-react';
import {
    getAllVehicles,
    deleteVehicle,
    getAllVehicleVariants,          
} from '../../../../services/vehicleService';
import { getAllDealers } from '../../../../services/dealerService';
import VehicleStockModal from './VehicleStockModal';
import VehicleDetailsModal from './VehicleDetailsModal';

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

    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [viewingVehicle, setViewingVehicle] = useState(null);

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

    // Handlers
    const handleAdd = () => { setVehicleToEdit(null); setShowModal(true); };
    const handleEdit = (vehicle) => { setVehicleToEdit(vehicle); setShowModal(true); };
    const handleDelete = async (vehicleId, vehicleVin) => {
        if (!window.confirm(`Delete vehicle with VIN "${vehicleVin}"?`)) return;
        try {
            await deleteVehicle(vehicleId);
            setSuccess(`Vehicle VIN "${vehicleVin}" deleted.`);
            // Refetch vehicles
             const vehiclesRes = await getAllVehicles();
             setVehicles(vehiclesRes.data?.data?.items || vehiclesRes.data?.items || vehiclesRes.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete vehicle.');
        }
    };
    const handleSaveSuccess = async (isEdit) => {
        setShowModal(false);
        setVehicleToEdit(null);
        setSuccess(`Vehicle ${isEdit ? 'updated' : 'added'} successfully.`);
        // Refetch vehicles
         try {
             const vehiclesRes = await getAllVehicles();
             setVehicles(vehiclesRes.data?.data?.items || vehiclesRes.data?.items || vehiclesRes.data || []);
         } catch(err) {
            setError('Failed to reload vehicles after saving.')
         }
    };
    const handlePageSizeChange = (e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); };
    const handleViewDetails = (vehicle) => {
        setViewingVehicle(vehicle);
        setShowDetailsModal(true);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading users from database...</span>
                </div>
            </div>
        );
    }
    
    return (
        <div className="card">
            {/* Header */}
            <div className="card-header border-bottom d-flex justify-content-between align-items-center">
                <div> 
                    <label className="d-flex align-items-center"> 
                        Show&nbsp; 
                        <select 
                            className="form-select" 
                            value={pageSize} 
                            onChange={handlePageSizeChange} 
                            style={{width:'auto'}}
                        > 
                            <option>10</option>
                            <option>25</option>
                            <option>50</option> 
                        </select> 
                        &nbsp;entries 
                    </label> 
                </div>
                <div className="d-flex align-items-center gap-3">
                    <input 
                        type="search" 
                        className="form-control" 
                        placeholder="Search VIN, Color, etc..." 
                        value={searchTerm} 
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
                        style={{width: '250px'}} 
                    />
                    <button 
                        className="btn btn-primary rounded-pill d-flex align-items-center" 
                        type="button" 
                        onClick={handleAdd}
                    > 
                        <Plus size={18} className="me-1"/> Add Vehicle 
                    </button>
                 </div>
            </div>

            {/* Alerts */}
            {error && (
                <div className="alert alert-danger alert-dismissible d-flex align-items-center" role="alert">
                    <AlertCircle size={20} className="me-2" />
                    <div className="flex-grow-1">{error}</div>
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setError('')}
                    ></button>
                </div>
            )}
            {success && (
                <div className="alert alert-success alert-dismissible d-flex align-items-center" role="alert">
                    <CheckCircle size={20} className="me-2" />
                    <div className="flex-grow-1">{success}</div>
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setSuccess('')}
                    ></button>
                </div>
            )}

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
                            <tr><td colSpan="7" className="text-center py-4"> No vehicles in stock found. </td></tr>
                        ) : (
                            paginatedVehicles.map(v => (
                                <tr key={v.id}>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn btn-link p-0 fw-semibold text-primary"
                                            onClick={() => handleViewDetails(v)}
                                            title={`View details for VIN: ${v.vin}`}
                                            style={{ textDecoration: 'none' }} // Bỏ gạch chân
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
                                            {/* Thêm nút View Details nếu cần */}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="d-flex justify-content-between align-items-center p-3">
                <small className="text-muted">
                    Showing {startEntry} to {endEntry} of {filteredVehicles.length} entries
                </small>
                <nav>
                    <ul className="pagination pagination-sm mb-0">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button 
                                className="page-link" 
                                onClick={() => setCurrentPage(p => p - 1)}
                                disabled={currentPage === 1}
                            >
                                &laquo; Previous
                            </button>
                        </li>
                        <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}`}>
                            <button 
                                className="page-link" 
                                onClick={() => setCurrentPage(p => p + 1)}
                                disabled={currentPage === totalPages || totalPages === 0}
                            >
                                Next &raquo;
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Modal */}
            <VehicleStockModal
                show={showModal}
                onClose={() => { setShowModal(false); setVehicleToEdit(null); }}
                onSaveSuccess={handleSaveSuccess}
                vehicleToEdit={vehicleToEdit}
                variants={allVariants} // Truyền danh sách variants
                dealers={allDealers}   // Truyền danh sách dealers
            />

            {/* Modal Details */}
            <VehicleDetailsModal
                show={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                vehicle={viewingVehicle}
                variantsMap={variantsMap} // Truyền map để hiển thị tên variant
                dealersMap={dealersMap}   // Truyền map để hiển thị tên dealer
            />
        </div>
    )
}