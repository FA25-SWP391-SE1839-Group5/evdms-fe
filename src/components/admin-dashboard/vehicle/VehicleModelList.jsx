import React, { useState, useEffect, useMemo } from 'react';
import { AlertCircle, CheckCircle, Plus, Edit, Trash } from 'lucide-react';
import {
    getAllVehicleModels,
    deleteVehicleModel
} from '../../../../services/vehicleService';
import VehicleModelModal from './VehicleModelModal';

export default function VehicleModelList() {
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modelToEdit, setModelToEdit] = useState(null);

    // Pagination & Search (Simple)
    const [searchTerm, setSearchTerm] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch data
    useEffect(() => {
        fetchModels();
    }, []);

    // Auto-hide alerts
    useEffect(() => {
        if (error || success) {
          const timer = setTimeout(() => { setError(''); setSuccess(''); }, 5000);
          return () => clearTimeout(timer);
        }
    }, [error, success]);

    const fetchModels = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await getAllVehicleModels();
            // Điều chỉnh dựa trên cấu trúc response API của bạn
            setModels(response.data?.data?.items || response.data?.items || response.data || []);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to load vehicle models');
            setModels([]);
        } finally {
            setLoading(false);
        }
    };

    // Filter & Paginate
    const filteredModels = useMemo(() => {
        return models.filter(model =>
            model.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            model.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [models, searchTerm]);

    const totalPages = Math.ceil(filteredModels.length / pageSize);
    const paginatedModels = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredModels.slice(startIndex, startIndex + pageSize);
    }, [filteredModels, currentPage, pageSize]);
    const startEntry = filteredModels.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endEntry = Math.min(currentPage * pageSize, filteredModels.length);

    // Handlers
    const handleAdd = () => {
        setModelToEdit(null);
        setShowModal(true);
    };

    const handleEdit = (model) => {
        setModelToEdit(model);
        setShowModal(true);
    };

    const handleDelete = async (modelId, modelName) => {
        if (!window.confirm(`Are you sure you want to delete the model "${modelName}"? This might affect related variants and vehicles.`)) return;
        try {
            await deleteVehicleModel(modelId);
            setSuccess(`Model "${modelName}" deleted successfully.`);
            fetchModels(); // Reload list
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to delete model');
        }
    };

    const handleSaveSuccess = (isEdit) => {
        setShowModal(false);
        setModelToEdit(null);
        setSuccess(`Model ${isEdit ? 'updated' : 'created'} successfully.`);
        fetchModels(); // Reload list
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
    };

    if (loading) {
        return <div className="text-center p-4"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
    }

    return (
        <div className="card">

            {/* Header: Search, Entries, Add */}
            <div className="card-header border-bottom d-flex justify-content-between align-items-center">

                {/* Left: Show entries */}
                 <div>
                    <label className="d-flex align-items-center">
                        Show&nbsp;
                        <select 
                            className="form-select form-select-sm" 
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

                {/* Right: Search + Add */}
                 <div className="d-flex align-items-center gap-3">
                    <input
                        type="search"
                        className="form-control"
                        placeholder="Search Models..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        style={{width: '200px'}}
                    />
                    <button className="btn btn-primary rounded-pill d-flex align-items-center" type="button" onClick={handleAdd}>
                        <Plus size={18} className="me-1"/> Add Model
                    </button>
                 </div>
            </div>
        </div>
    )
}
