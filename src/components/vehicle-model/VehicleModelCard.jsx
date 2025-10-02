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

            {/* Content */}
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {model.modelName}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                    {model.manufacturer} • {model.yearOfManufacture}
                    </p>

                    {/* Specs */}
                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                        <div>
                            <span className="text-gray-500">Battery:</span>
                            <p className="font-semibold text-gray-700">
                            {model.batteryCapacity} kWh
                            </p>
                        </div>
                        <div>
                            <span className="text-gray-500">Range:</span>
                            <p className="font-semibold text-gray-700">{model.range} km</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Power:</span>
                            <p className="font-semibold text-gray-700">{model.motorPower} HP</p>
                        </div>
                        <div>
                            <span className="text-gray-500">Seats:</span>
                            <p className="font-semibold text-gray-700">
                            {model.seatingCapacity}
                            </p>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                        <span className="text-2xl font-bold text-blue-600">
                            {model.price.toLocaleString("vi-VN")} ₫
                        </span>
                    </div>
            </div>
            


        </NeumorphismCard>
    );
};