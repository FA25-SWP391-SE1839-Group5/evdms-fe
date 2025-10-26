import React from 'react'
import { AlertCircle, CheckCircle, Plus, Edit, Trash } from 'lucide-react';
import { getAllVehicleVariants, deleteVehicleVariant, getAllVehicleModels } from '../../../services/vehicleService';
import VehicleVariantModal from './VehicleVariantModal';

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
    const handleDelete = async (variantId, variantName) => {
        if (!window.confirm(`Delete variant "${variantName}"? This might affect related vehicles and orders.`)) return;
        try {
            await deleteVehicleVariant(variantId);
            setSuccess(`Variant "${variantName}" deleted.`);
            // Refetch variants after delete
            const variantsRes = await getAllVehicleVariants();
            setVariants(variantsRes.data?.data?.items || variantsRes.data?.items || variantsRes.data || []);
        } catch (err) {
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
        <div className="card">
            {/* Header */}
            <div className="card-header border-bottom d-flex justify-content-between align-items-center">
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
        </div>
    )
}
