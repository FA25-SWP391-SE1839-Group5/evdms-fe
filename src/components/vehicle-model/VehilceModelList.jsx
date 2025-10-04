import VehicleModelCard from "./VehicleModelCard";
import { Image as ImageIcon } from "lucide-react";

const VehicleModelList = ({ models, onEdit, onDelete, loading }) => {
    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="spinner mx-auto mb-4"></div>
                <p className="text-gray-600">Loading models...</p>
            </div>
        );
    }

    if (!models || models.length === 0) {
        return (
        <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No models found</p>
        </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
            <VehicleModelCard
            key={model.id}
            model={model}
            onEdit={onEdit}
            onDelete={onDelete}
            />
        ))}
        </div>
    );
};

export default VehicleModelList;