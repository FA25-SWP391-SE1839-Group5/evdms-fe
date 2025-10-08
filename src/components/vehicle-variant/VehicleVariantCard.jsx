import { Edit, Trash2, Car, DollarSign, Calendar, Settings } from "lucide-react";
import { formatPrice, formatDate, getSpecDisplayName, getFeatureDisplayName, getFeatureTypeDisplayName } from "../../services/vehicleVariantService";

const VehicleVariantCard = ({ variant, onEdit, onDelete }) => {
  const handleEdit = () => {
    onEdit(variant);
  };

  const handleDelete = () => {
    onDelete(variant.id);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {variant.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Model: {variant.modelName || "Unknown Model"}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <DollarSign size={14} />
                <span className="font-medium text-emerald-600">
                  {formatPrice(variant.basePrice)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{formatDate(variant.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit variant"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete variant"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Specifications */}
        {variant.specs && Object.keys(variant.specs).length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Settings size={16} className="text-gray-600" />
              <h4 className="font-medium text-gray-700">Specifications</h4>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(variant.specs).slice(0, 4).map(([key, spec]) => (
                <div key={key} className="text-sm">
                  <span className="text-gray-600">
                    {getSpecDisplayName(key)}:
                  </span>
                  <span className="ml-1 font-medium">
                    {spec.value} {spec.unit}
                  </span>
                </div>
              ))}
              {Object.keys(variant.specs).length > 4 && (
                <div className="text-sm text-gray-500">
                  +{Object.keys(variant.specs).length - 4} more...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features */}
        {variant.features && Object.keys(variant.features).length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Car size={16} className="text-gray-600" />
              <h4 className="font-medium text-gray-700">Features</h4>
            </div>
            <div className="space-y-2">
              {Object.entries(variant.features).slice(0, 2).map(([category, features]) => (
                <div key={category} className="text-sm">
                  <span className="text-gray-600 font-medium">
                    {getFeatureDisplayName(category)}:
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                      >
                        {getFeatureTypeDisplayName(feature)}
                      </span>
                    ))}
                    {features.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-xs">
                        +{features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {Object.keys(variant.features).length > 2 && (
                <div className="text-sm text-gray-500">
                  +{Object.keys(variant.features).length - 2} more categories...
                </div>
              )}
            </div>
          </div>
        )}

        {/* No specs or features */}
        {(!variant.specs || Object.keys(variant.specs).length === 0) && 
         (!variant.features || Object.keys(variant.features).length === 0) && (
          <div className="text-center py-4 text-gray-500">
            <Car size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No specifications or features added yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleVariantCard;
