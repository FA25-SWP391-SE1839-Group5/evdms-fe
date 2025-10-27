import React, { useState, useEffect, useMemo } from 'react';
import { AlertCircle, CheckCircle, Plus, Edit, Trash, Percent, Calendar } from 'lucide-react'; 
import { getAllPromotions, createPromotion, updatePromotion, deletePromotion } from '../../../services/promotionService';
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

    // Filter & Paginate
    const filteredPromotions = useMemo(() => {
        const searchLower = searchTerm.toLowerCase();
        return promotions.filter(p =>
            p.description?.toLowerCase().includes(searchLower)
        );
    }, [promotions, searchTerm]);

    const totalPages = Math.ceil(filteredPromotions.length / pageSize);
    const paginatedPromotions = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredPromotions.slice(startIndex, startIndex + pageSize);
    }, [filteredPromotions, currentPage, pageSize]);
    const startEntry = filteredPromotions.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endEntry = Math.min(currentPage * pageSize, filteredPromotions.length);

    // Handlers
    const handleAdd = () => { setPromotionToEdit(null); setShowModal(true); };
    const handleEdit = (promo) => { setPromotionToEdit(promo); setShowModal(true); };
    const handleDelete = async (promoId, promoDesc) => {
        if (!window.confirm(`Delete promotion "${promoDesc}"?`)) return;
        try {
            await deletePromotion(promoId);
            setSuccess(`Promotion "${promoDesc}" deleted.`);
            fetchPromotions(); // Reload
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete promotion.');
        }
    };
    const handleSaveSuccess = (isEdit) => {
        setShowModal(false);
        setPromotionToEdit(null);
        setSuccess(`Promotion ${isEdit ? 'updated' : 'created'} successfully.`);
        fetchPromotions(); // Reload
    };
    const handlePageSizeChange = (e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); };
    const handleSearchChange = (e) => { setSearchTerm(e.target.value); setCurrentPage(1); };
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (loading) {
         return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
    }
  
    return (
        <>
            <h4 className="fw-bold py-3 mb-4">
              <span className="text-muted fw-light">Financial /</span> Promotions
            </h4>

            {/* Alerts */}
            {error && (
                <div className="alert alert-danger alert-dismissible d-flex align-items-center mb-4" role="alert">
                    <AlertCircle size={20} className="me-2" /><div className="flex-grow-1">{error}</div>
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
            )}
            {success && (
                <div className="alert alert-success alert-dismissible d-flex align-items-center mb-4" role="alert">
                    <CheckCircle size={20} className="me-2" /><div className="flex-grow-1">{success}</div>
                    <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                </div>
            )}

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
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option> 
                            </select> 
                            &nbsp;entries 
                        </label> 
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <input 
                            type="search" 
                            className="form-control" 
                            placeholder="Search Description..." 
                            value={searchTerm} 
                            onChange={handleSearchChange} 
                            style={{width: '250px'}} 
                        />
                        <button 
                            className="btn btn-primary rounded-pill d-flex align-items-center" 
                            type="button" 
                            onClick={handleAdd}
                        > 
                            <Plus size={18} className="me-1"/> Add Promotion 
                        </button>
                     </div>
                </div>

                {/* Table */}
                <div className="table-responsive text-nowrap">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Discount</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="table-border-bottom-0">
                            {paginatedPromotions.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-4">
                                     {filteredPromotions.length === 0 && !searchTerm ? 'No promotions found.' : 'No promotions match your search.'}
                                </td></tr>
                            ) : (
                                paginatedPromotions.map(p => (
                                    <tr key={p.id}>
                                        <td><span className="fw-semibold">{p.description}</span></td>
                                        <td>{formatPercent(p.discountPercent)}</td>
                                        <td>{formatDate(p.startDate)}</td>
                                        <td>{formatDate(p.endDate)}</td>
                                        <td><RenderPromotionStatus startDate={p.startDate} endDate={p.endDate} /></td>
                                        <td>
                                            <div className="d-inline-block text-nowrap">
                                                <button 
                                                    className="btn btn-sm btn-icon" 
                                                    title="Edit" 
                                                    onClick={() => handleEdit(p)}
                                                >
                                                    <i className="bx bx-edit"></i>
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-icon delete-record" 
                                                    title="Delete" 
                                                    onClick={() => handleDelete(p.id, p.description)}
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
                 <div className="d-flex justify-content-between align-items-center p-3 border-top">
                    <small className="text-muted">
                        Showing {startEntry} to {endEntry} of {filteredPromotions.length} entries
                    </small>
                    <nav>
                        <ul className="pagination pagination-sm mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button     
                                    className="page-link" 
                                    onClick={() => handlePageChange(currentPage - 1)} 
                                    disabled={currentPage === 1}
                                >
                                    &laquo;
                                </button>
                            </li>
                            <li className="page-item active">
                                <span className="page-link">{currentPage}</span>
                            </li>
                            <li className="page-item disabled">
                                <span className="page-link text-muted">of {totalPages}</span>
                            </li>
                            <li className={`page-item ${currentPage >= totalPages ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link" 
                                    onClick={() => handlePageChange(currentPage + 1)} 
                                    disabled={currentPage >= totalPages}
                                >
                                    &raquo;
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Modal */}
            <PromotionModal
                show={showModal}
                onClose={() => { setShowModal(false); setPromotionToEdit(null); }}
                onSaveSuccess={handleSaveSuccess}
                promotionToEdit={promotionToEdit}
            />
        </>
    )
}
