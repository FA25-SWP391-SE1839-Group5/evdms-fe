import { useState } from "react";
import VehicleModelSearch from "../components/vehicle-model/VehicleModelSearch";
import VehicleModelList from '../components/vehicle-model/VehilceModelList'
import VehicleModelForm from "../components/vehicle-model/VehicleModelForm";
import { Plus } from "lucide-react";

const VehicleModelPage = () => {
    const [models, setModels] = useState([
        { id: 1, name: "Tesla Model S", brand: "Tesla", year: 2023, price: 79999, image: null },
        { id: 2, name: "VinFast VF9", brand: "VinFast", year: 2024, price: 55000, image: null },
    ]);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editModel, setEditModel] = useState(null);

    // Filter
    const filteredModels = models.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase())
    );

    // Add or Update
    const handleSubmit = (data) => {
        if (editModel) {
            // update
            setModels((prev) =>
                prev.map((m) => (m.id === editModel.id ? { ...m, ...data } : m))
            );
            } else {
            // add new
            const newModel = { ...data, id: Date.now() };
            setModels((prev) => [...prev, newModel]);
        }
        setShowForm(false);
        setEditModel(null);
    };

    // Edit
    const handleEdit = (model) => {
        setEditModel(model);
        setShowForm(true);
    };

    // Delete
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this model?")) {
            setModels((prev) => prev.filter((m) => m.id !== id));
        }
    };

    return (
    <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Vehicle Models</h1>
            <button
            onClick={() => {
                setShowForm(true);
                setEditModel(null);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
            >
                <Plus size={18} />
                Add Model
            </button>
        </div>

        {/* Search */}
        <VehicleModelSearch value={search} onChange={setSearch} />

        {/* Form or List */}
        {showForm ? (
            <VehicleModelForm
                initialData={editModel}
                onSubmit={handleSubmit}
                onCancel={() => {
                    setShowForm(false);
                    setEditModel(null);
            }}
            />
        ) : (
            <VehicleModelList
                models={filteredModels}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        )}
    </div>
  );
};

export default VehicleModelPage;