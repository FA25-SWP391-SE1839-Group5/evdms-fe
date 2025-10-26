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



    
    return (
        <div>

        </div>
    )
}
