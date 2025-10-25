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

    
    return (
        <div>

        </div>
    )
}
