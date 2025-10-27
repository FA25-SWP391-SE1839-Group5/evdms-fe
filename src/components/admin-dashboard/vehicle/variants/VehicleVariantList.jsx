import React, { useState, useEffect, useMemo } from 'react'
import { AlertCircle, CheckCircle, Plus } from 'lucide-react';
import { getAllVehicleVariants, deleteVehicleVariant, getAllVehicleModels } from '../../../../services/vehicleService';
import VehicleVariantModal from './VehicleVariantModal';
import VehicleVariantDetailsModal from './VehicleVariantDetailsModal';
import VehicleVariantStatsCards from './VehicleVariantStatsCards';

// Helper format tiền tệ
const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default function VehicleVariantList() {
    const [variants, setVariants] = useState([]);
    const [modelsMap, setModelsMap] = useState({}); // Lưu { modelId: modelName }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [variantToEdit, setVariantToEdit] = useState(null);

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [viewVariantId, setViewVariantId] = useState(null);

    // Pagination & Search
    const [searchTerm, setSearchTerm] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch data (Variants và Models)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');
                const [variantsRes, modelsRes] = await Promise.all([
                    getAllVehicleVariants(),
                    getAllVehicleModels()
                ]);

                setVariants(variantsRes.data?.data?.items || variantsRes.data?.items || variantsRes.data || []);

                const models = modelsRes.data?.data?.items || modelsRes.data?.items || modelsRes.data || [];
                const map = models.reduce((acc, model) => {
                    acc[model.id] = model.name;
                    return acc;
                }, {});
                setModelsMap(map);

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
    const filteredVariants = useMemo(() => {
        return variants.filter(variant =>
            variant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            modelsMap[variant.modelId]?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [variants, modelsMap, searchTerm]);

    const totalPages = Math.ceil(filteredVariants.length / pageSize);
    const paginatedVariants = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredVariants.slice(startIndex, startIndex + pageSize);
    }, [filteredVariants, currentPage, pageSize]);
    const startEntry = filteredVariants.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endEntry = Math.min(currentPage * pageSize, filteredVariants.length);

    // Handlers
    const handleAdd = () => { setVariantToEdit(null); setShowModal(true); };
    const handleEdit = (variant) => { setVariantToEdit(variant); setShowModal(true); };
    const handleViewDetails = (variantId) => {
        setViewVariantId(variantId);
        setShowDetailModal(true);
    };
    const handleDelete = async (variantId, variantName) => {
        if (!window.confirm(`Delete variant "${variantName}"? This might affect related vehicles and orders.`)) return;
        try {
            await deleteVehicleVariant(variantId);
            setSuccess(`Variant "${variantName}" deleted.`);
            // Refetch variants after delete
            const variantsRes = await getAllVehicleVariants();
            setVariants(variantsRes.data?.data?.items || variantsRes.data?.items || variantsRes.data || []);
        } catch (err)
        {
            setError(err.response?.data?.message || 'Failed to delete variant.');
        }
    };
    const handleSaveSuccess = async (isEdit) => {
        setShowModal(false);
        setVariantToEdit(null);
        setSuccess(`Variant ${isEdit ? 'updated' : 'created'} successfully.`);
        // Refetch variants after save
        try {
            const variantsRes = await getAllVehicleVariants();
            setVariants(variantsRes.data?.data?.items || variantsRes.data?.items || variantsRes.data || []);
        } catch(err) {
            setError('Failed to reload variants after saving.')
        }
    };
    const handlePageSizeChange = (e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); };

    if (loading) {
        return <div className="text-center p-4"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
    }

    return (
        <>
            <VehicleVariantStatsCards variants={variants} modelsMap={modelsMap} />
        
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
                            placeholder="Search Variants..." 
                            value={searchTerm} 
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
                            style={{width: '200px'}} 
                        />
                        <button 
                            className="btn btn-primary rounded-pill d-flex align-items-center" 
                            type="button" 
                            onClick={handleAdd}
                        >
                            <Plus size={18} className="me-1"/> Add Variant 
                        </button>
                    </div>
                </div>
                
                <div className="card-body pb-0">
                    
                    {/* Alert messages */}
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
                    
                    {/* Table */}
                    <div className="table-responsive text-nowrap">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Model</th>
                                    <th>Variant Name</th>
                                    <th>Base Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-border-bottom-0">
                                {paginatedVariants.length === 0 ? (
                                    <tr><td colSpan="4" className="text-center py-4"> No variants found. </td></tr>
                                ) : (
                                    paginatedVariants.map(variant => (
                                        <tr key={variant.id}>
                                            <td>{modelsMap[variant.modelId] || 'Unknown Model'}</td>
                                            <td>
                                                <span className="fw-semibold">
                                                    {variant.name}
                                                </span>
                                            </td>
                                            <td>{formatCurrency(variant.basePrice)}</td>
                                            <td>
                                                <div className="d-inline-block text-nowrap">
                                                    
                                                    <button 
                                                        className="btn btn-sm btn-icon" 
                                                        title="Edit" 
                                                        onClick={() => handleEdit(variant)}
                                                    >
                                                        <i className="bx bx-edit"></i>
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-icon" 
                                                        title="View Details" 
                                                        onClick={() => handleViewDetails(variant.id)}
                                                    >
                                                        <i className="bx bx-show"></i>
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-icon delete-record" 
                                                        title="Delete" 
                                                        onClick={() => handleDelete(variant.id, variant.name)}
                                                    >
                                                        <i className="bx bx-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}                
                    <div className="d-flex justify-content-between align-items-center p-3">
                        <small className="text-muted">
                            Showing {startEntry} to {endEntry} of {filteredVariants.length} entries
                        </small>
                        <nav>
                            <ul className="pagination pagination-sm mb-0">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => setCurrentPage(p=>p-1)} 
                                        disabled={currentPage === 1}
                                    >
                                        &laquo;
                                    </button>
                                </li>
                                {/* TODO: Thêm logic render nhiều trang nếu muốn */}
                                <li className="page-item active">
                                    <span className="page-link">{currentPage}</span>
                                </li>
                                <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => setCurrentPage(p=>p+1)} 
                                        disabled={currentPage >= totalPages}
                                    >
                                        &raquo;
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                
                {/* Modal Edit */}
                <VehicleVariantModal
                    show={showModal}
                    onClose={() => { setShowModal(false); setVariantToEdit(null); }}
                    onSaveSuccess={handleSaveSuccess}
                    variantToEdit={variantToEdit}
                />

                {/* Modal View */}
                <VehicleVariantDetailsModal
                    show={showDetailModal}
                    onClose={() => setShowDetailModal(false)}
                    variantId={viewVariantId}
                    modelsMap={modelsMap} 
                />
            </div>
        </>
    )
}