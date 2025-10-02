import { Edit, Trash2, Image as ImageIcon } from "lucide-react";
import NeumorphismCard from "../ui/NeumorphismCard";

const VehicleModelCard = ({model, onEdit, onDelete }) => {
    return (
        <NeumorphismCard className="p-0 overflow-hidden">
            {/* Images */}
            <div className="h-48 bg-gray-200 relative">
                {model.imageUrl ? (
                    <img
                        src={model.imageUrl}
                        alt={model.modelName}
                        className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-gray-400" />
                    </div>
                )}
            </div>
        </NeumorphismCard>
    );
};