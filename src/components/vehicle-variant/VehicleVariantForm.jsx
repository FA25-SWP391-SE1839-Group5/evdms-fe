import { useState, useEffect } from "react";
import { X, Save, AlertCircle } from "lucide-react";

const VehicleVariantForm = ({ initialData, models, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    modelId: "",
    name: "",
    basePrice: "",
    specs: {
      batteryCapacity: { value: "", unit: "kWh" },
      range: { value: "", unit: "km" },
      chargingTime: { value: "", unit: "hours" },
      maxSpeed: { value: "", unit: "km/h" },
      acceleration: { value: "", unit: "seconds" },
      weight: { value: "", unit: "kg" },
      dimensions: { value: "", unit: "mm" },
      seatingCapacity: { value: "", unit: "seats" },
      cargoSpace: { value: "", unit: "L" },
      warranty: { value: "", unit: "years" }
    },
    features: {
      safety: [],
      comfort: [],
      technology: [],
      performance: [],
      convenience: []
    }
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (initialData) {
      setFormData({
        modelId: initialData.modelId || "",
        name: initialData.name || "",
        basePrice: initialData.basePrice || "",
        specs: initialData.specs || formData.specs,
        features: initialData.features || formData.features
      });
    }
  }, [initialData]);

  // Available feature types
  const featureOptions = {
    safety: [
      "ABS", "ESC", "Airbags", "BackupCamera", "BlindSpotMonitoring", 
      "LaneDepartureWarning", "AdaptiveCruiseControl", "AutomaticEmergencyBraking"
    ],
    comfort: [
      "HeatedSeats", "LeatherSeats", "Sunroof", "ClimateControl", 
      "PowerWindows", "PowerLocks", "RemoteStart", "KeylessEntry"
    ],
    technology: [
      "NavigationSystem", "Bluetooth", "USBPorts", "WirelessCharging", 
      "AppleCarPlay", "AndroidAuto", "VoiceControl", "Touchscreen", 
      "DigitalInstrumentCluster"
    ],
    performance: [
      "LEDHeadlights", "FogLights", "AllWheelDrive", "SportMode", 
      "EcoMode", "RegenerativeBraking", "FastCharging", "HomeCharging", 
      "PublicCharging"
    ],
    convenience: [
      "MobileApp", "OverTheAirUpdates", "RemoteDiagnostics"
    ]
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleSpecChange = (specKey, field, value) => {
    setFormData(prev => ({
      ...prev,
      specs: {
        ...prev.specs,
        [specKey]: {
          ...prev.specs[specKey],
          [field]: value
        }
      }
    }));
  };

  const handleFeatureChange = (category, feature, checked) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [category]: checked 
          ? [...prev.features[category], feature]
          : prev.features[category].filter(f => f !== feature)
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.modelId) {
      newErrors.modelId = "Please select a vehicle model";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Variant name is required";
    }

    if (!formData.basePrice || formData.basePrice <= 0) {
      newErrors.basePrice = "Base price must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Clean up specs - only include specs with values
      const cleanedSpecs = {};
      Object.entries(formData.specs).forEach(([key, spec]) => {
        if (spec.value && spec.value.trim()) {
          cleanedSpecs[key] = {
            value: spec.value.trim(),
            unit: spec.unit
          };
        }
      });

      // Clean up features - only include categories with features
      const cleanedFeatures = {};
      Object.entries(formData.features).forEach(([category, features]) => {
        if (features.length > 0) {
          cleanedFeatures[category] = features;
        }
      });

      const submitData = {
        modelId: formData.modelId,
        name: formData.name.trim(),
        basePrice: parseFloat(formData.basePrice),
        specs: cleanedSpecs,
        features: cleanedFeatures
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {initialData ? "Edit Vehicle Variant" : "Add New Vehicle Variant"}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Model Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Model *
            </label>
            <select
              value={formData.modelId}
              onChange={(e) => handleInputChange("modelId", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                errors.modelId ? "border-red-300" : "border-gray-300"
              }`}
            >
              <option value="">Select a model</option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            {errors.modelId && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.modelId}
              </p>
            )}
          </div>

          {/* Variant Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Variant Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                errors.name ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="e.g., Standard, Premium, Performance"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.name}
              </p>
            )}
          </div>

          {/* Base Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base Price (VND) *
            </label>
            <input
              type="number"
              value={formData.basePrice}
              onChange={(e) => handleInputChange("basePrice", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                errors.basePrice ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter base price"
              min="0"
              step="1000"
            />
            {errors.basePrice && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.basePrice}
              </p>
            )}
          </div>
        </div>

        {/* Specifications */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(formData.specs).map(([key, spec]) => (
              <div key={key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(key, "value", e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Value"
                  />
                  <input
                    type="text"
                    value={spec.unit}
                    onChange={(e) => handleSpecChange(key, "unit", e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Unit"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Features</h3>
          <div className="space-y-6">
            {Object.entries(featureOptions).map(([category, options]) => (
              <div key={category}>
                <h4 className="text-md font-medium text-gray-700 mb-3">
                  {category.charAt(0).toUpperCase() + category.slice(1)} Features
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {options.map((feature) => (
                    <label key={feature} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.features[category].includes(feature)}
                        onChange={(e) => handleFeatureChange(category, feature, e.target.checked)}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">
                        {feature.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={18} />
            {isSubmitting ? "Saving..." : initialData ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleVariantForm;
