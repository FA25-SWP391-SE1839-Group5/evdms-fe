import { useState, useEffect } from "react";
import VehicleModelSearch from "../components/vehicle-model/VehicleModelSearch";
import VehicleModelList from '../components/vehicle-model/VehilceModelList'
import VehicleModelForm from "../components/vehicle-model/VehicleModelForm";
import { Plus, LogOut } from "lucide-react";
import {
    getAllVehicleModels,
    createVehicleModel,
    updateVehicleModel,
    deleteVehicleModel
} from "../services/vehicleModelService";

const VehicleModelPage = ({ user, onLogout }) => {
    const [models, setModels] = useState([]);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editModel, setEditModel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ Fetch models khi component mount
    useEffect(() => {
        fetchModels();
    }, []);

    const fetchModels = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllVehicleModels();
            if (response.success) {
                setModels(response.data || []);
            }
        } catch (err) {
            console.error('Error fetching models:', err);
            setError(err.response?.data?.message || 'Failed to load vehicle models');
        } finally {
            setLoading(false);
        }
    };

    // Filter
    const filteredModels = models.filter((m) =>
        m.modelName.toLowerCase().includes(search.toLowerCase())
    );

    // CREATE or UPDATE
    const handleSubmit = async (data) => {
        setError(null);
        
        try {
            if (editModel) {
                // UPDATE
                const response = await updateVehicleModel(editModel.id, data);
                if (response.success) {
                    setModels((prev) =>
                        prev.map((m) => (m.id === editModel.id ? response.data : m))
                    );
                    alert('Vehicle model updated successfully!');
                }
            } else {
                // CREATE
                const response = await createVehicleModel(data);
                if (response.success) {
                    setModels((prev) => [...prev, response.data]);
                    alert('Vehicle model created successfully!');
                }
            }
            setShowForm(false);
            setEditModel(null);
        } catch (err) {
            console.error('Error submitting model:', err);
            setError(err.response?.data?.message || 'Failed to save vehicle model');
        }
    };


    // EDIT
    const handleEdit = (model) => {
        setEditModel(model);
        setShowForm(true);
        setError(null);
    };

    // Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this model?")) {
            return;
        }

        setError(null);
        try {
            const response = await deleteVehicleModel(id);
            if (response.success) {
                setModels((prev) => prev.filter((m) => m.id !== id));
                alert('Vehicle model deleted successfully!');
            }
        } catch (err) {
            console.error('Error deleting model:', err);
            setError(err.response?.data?.message || 'Failed to delete vehicle model');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Vehicle Models</h1>
                        {user && (
                            <p className="text-sm text-gray-500 mt-1">
                                Welcome, {user.name || user.email} ({user.role})
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                setShowForm(true);
                                setEditModel(null);
                                setError(null);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
                        >
                            <Plus size={18} />
                            Add Model
                        </button>
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-colors"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                        <p className="font-medium">Error</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {/* Search Bar (only if not showing form) */}
                {!showForm && (
                    <div className="flex justify-between items-center">
                        <VehicleModelSearch value={search} onChange={setSearch} />
                        <p className="text-sm text-gray-500">
                            {filteredModels.length} model(s) found
                        </p>
                    </div>
                )}

                {/* Form or List */}
                {showForm ? (
                    <VehicleModelForm
                        initialData={editModel}
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setShowForm(false);
                            setEditModel(null);
                            setError(null);
                        }}
                    />
                ) : (
                    <VehicleModelList
                        models={filteredModels}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        loading={loading}
                    />
                )}
            </div>
        </div>
  );
};

export default VehicleModelPage;