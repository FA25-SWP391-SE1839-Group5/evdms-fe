import { useEffect, useState } from "react";
import { getAllVehicleModels } from "../../services/vehicleModelService";
import { createVehicleVariant, deleteVehicleVariant, getAllVehicleVariants, getVehicleVariantById, updateVehicleVariant } from "../../services/vehicleVariantService";

// Specs configuration with categories and units
const SPECS_CONFIG = {
  Performance: {
    Horsepower: { unit: "hp", type: "number" },
    Torque: { unit: "Nm", type: "number" },
    Acceleration: { unit: "s", type: "number" },
    DriveType: { unit: null, type: "text" },
    MotorType: { unit: null, type: "text" },
    TopSpeed: { unit: "km/h", type: "number" },
    CurbWeight: { unit: "kg", type: "number" },
  },
  Energy: {
    BatteryCapacity: { unit: "kWh", type: "number" },
    Range: { unit: "km", type: "number" },
    Efficiency: { unit: "Wh/km", type: "number" },
    BatteryChemistry: { unit: null, type: "text" },
    BatteryVoltageArchitecture: { unit: "V", type: "number" },
    RegenerativeBrakingCapacity: { unit: null, type: "text" },
  },
  Charging: {
    MaxAcChargingRate: { unit: "kW", type: "number" },
    MaxDcFastChargingRate: { unit: "kW", type: "number" },
    DcFastChargingTime: { unit: "min", type: "number" },
    AcChargingTime: { unit: "h", type: "number" },
    ChargingPortTypes: { unit: null, type: "text" },
  },
  Practicality: {
    TowingCapacity: { unit: "kg", type: "number" },
    FrunkVolume: { unit: "L", type: "number" },
    CargoVolume: { unit: "L", type: "number" },
    HeatPump: { unit: null, type: "text" },
    V2lCapability: { unit: "kW", type: "number" },
  },
};

// Features configuration
const FEATURES_CONFIG = {
  Safety: [
    "AutomaticEmergencyBraking",
    "BackupCamera",
    "BlindSpotMonitor",
    "BrakeAssist",
    "LedHeadlights",
    "LaneDepartureWarning",
    "RearCrossTrafficAlert",
    "StabilityControl",
    "TractionControl",
    "ParkingSensors",
  ],
  Convenience: ["AdaptiveCruiseControl", "CooledSeats", "HeatedSeats", "HeatedSteeringWheel", "KeylessEntry", "KeylessStart", "NavigationSystem", "PowerLiftgate", "RainSensingWipers"],
  Entertainment: ["AndroidAuto", "AppleCarPlay", "Bluetooth", "HomeLink", "PremiumSoundSystem", "UsbPort", "WifiHotspot", "SatelliteRadio", "AuxInput"],
  Exterior: ["AlloyWheels", "TowHitch", "FogLights", "RoofRails", "Sunroof", "PowerMirrors", "RearSpoiler", "AutomaticHeadlights", "DaytimeRunningLights"],
  Seating: [
    "LeatherSeats",
    "MemorySeat",
    "PowerDriverSeat",
    "PowerPassengerSeat",
    "HeatedRearSeats",
    "VentilatedSeats",
    "SplitFoldingRearSeat",
    "AdjustableLumbarSupport",
    "BucketSeats",
    "ThirdRowSeating",
  ],
};

const VehicleVariantManagement = () => {
  // State management
  const [variants, setVariants] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Pagination & filtering
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create', 'edit', 'view'
  const [currentVariant, setCurrentVariant] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // Multi-step form

  // Form state
  const [formData, setFormData] = useState({
    modelId: "",
    name: "",
    basePrice: 0,
    specs: {},
    features: {},
  });

  // Delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState(null);

  // Fetch models on mount
  useEffect(() => {
    fetchModels();
  }, []);

  // Fetch variants when filters change
  useEffect(() => {
    const loadVariants = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllVehicleVariants({
          page,
          pageSize,
          search: searchTerm,
          sortBy,
          sortOrder: "asc",
        });
        setVariants(data.items);
        setTotalResults(data.totalResults);
      } catch (err) {
        setError("Failed to fetch variants: " + (err.message || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };
    loadVariants();
  }, [page, pageSize, searchTerm, sortBy]);

  const fetchModels = async () => {
    try {
      const data = await getAllVehicleModels({ page: 1, pageSize: 100 });
      setModels(data.items || []);
    } catch (err) {
      console.error("Error fetching models:", err);
    }
  };

  const fetchVariants = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllVehicleVariants({
        page,
        pageSize,
        search: searchTerm,
        sortBy,
        sortOrder: "asc",
      });
      setVariants(data.items);
      setTotalResults(data.totalResults);
    } catch (err) {
      setError("Failed to fetch variants: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  // Open modal for create
  const handleCreate = () => {
    setModalMode("create");
    setFormData({
      modelId: models[0]?.id || "",
      name: "",
      basePrice: 0,
      specs: {},
      features: {},
    });
    setCurrentVariant(null);
    setCurrentStep(1);
    setShowModal(true);
  };

  // Open modal for edit
  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const variant = await getVehicleVariantById(id);
      setCurrentVariant(variant);

      // Normalize specs: API returns PascalCase keys, keep as-is
      const normalizedSpecs = {};
      if (variant.specs) {
        Object.entries(variant.specs).forEach(([key, value]) => {
          normalizedSpecs[key] = value;
        });
      }

      // Normalize features: API returns lowercase categories, convert to PascalCase
      const normalizedFeatures = {};
      if (variant.features) {
        Object.entries(variant.features).forEach(([key, value]) => {
          const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
          normalizedFeatures[pascalKey] = value;
        });
      }

      setFormData({
        modelId: variant.modelId,
        name: variant.name,
        basePrice: variant.basePrice,
        specs: normalizedSpecs,
        features: normalizedFeatures,
      });

      setModalMode("edit");
      setCurrentStep(1);
      setShowModal(true);
    } catch (err) {
      setError("Failed to fetch variant details: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Open modal for view
  const handleView = async (id) => {
    try {
      setLoading(true);
      const variant = await getVehicleVariantById(id);
      setCurrentVariant(variant);

      console.log("🔍 View Modal - Raw variant from API:", variant);

      // Normalize specs: API returns PascalCase keys, we need them as-is for matching SPECS_CONFIG
      const normalizedSpecs = {};
      if (variant.specs) {
        Object.entries(variant.specs).forEach(([key, value]) => {
          // Keep PascalCase key as-is for matching with SPECS_CONFIG
          normalizedSpecs[key] = value;
        });
      }

      console.log("🔍 View Modal - Normalized specs:", normalizedSpecs);

      // Normalize features: API returns lowercase categories, we need PascalCase
      const normalizedFeatures = {};
      if (variant.features) {
        Object.entries(variant.features).forEach(([key, value]) => {
          // Convert lowercase to PascalCase (safety -> Safety)
          const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
          normalizedFeatures[pascalKey] = value;
        });
      }

      console.log("🔍 View Modal - Normalized features:", normalizedFeatures);

      setFormData({
        modelId: variant.modelId,
        name: variant.name,
        basePrice: variant.basePrice,
        specs: normalizedSpecs,
        features: normalizedFeatures,
      });
      setModalMode("view");
      setCurrentStep(1);
      setShowModal(true);
    } catch (err) {
      setError("Failed to fetch variant details: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Handle basic info input
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "basePrice" ? Number(value) : value,
    }));
  };

  // Handle spec input change
  const handleSpecChange = (category, specName, field, value) => {
    setFormData((prev) => ({
      ...prev,
      specs: {
        ...prev.specs,
        [specName]: {
          ...prev.specs[specName],
          [field]: field === "value" && SPECS_CONFIG[category][specName].type === "number" ? Number(value) : value,
        },
      },
    }));
  };

  // Remove empty spec
  const removeSpec = (specName) => {
    setFormData((prev) => {
      const newSpecs = { ...prev.specs };
      delete newSpecs[specName];
      return { ...prev, specs: newSpecs };
    });
  };

  // Handle feature checkbox
  const handleFeatureToggle = (category, feature) => {
    setFormData((prev) => {
      const currentFeatures = prev.features[category] || [];
      const isChecked = currentFeatures.includes(feature);

      return {
        ...prev,
        features: {
          ...prev.features,
          [category]: isChecked ? currentFeatures.filter((f) => f !== feature) : [...currentFeatures, feature],
        },
      };
    });
  };

  // Navigate steps
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const preparePayload = () => {
    const payload = {
      modelId: formData.modelId,
      name: formData.name,
      basePrice: formData.basePrice,
    };

    // Always send all spec keys, with empty arrays if not selected
    const specs = {};
    Object.keys(SPECS_CONFIG).forEach((category) => {
      Object.keys(SPECS_CONFIG[category]).forEach((specName) => {
        const spec = formData.specs[specName];
        const config = SPECS_CONFIG[category][specName];
        if (spec && spec.value !== undefined && spec.value !== "" && spec.value !== null) {
          const camelKey = specName.charAt(0).toLowerCase() + specName.slice(1);
          specs[camelKey] = {
            value: config.unit ? Number(spec.value) : String(spec.value),
            ...(config.unit ? { unit: config.unit } : {}),
          };
        }
      });
    });
    payload.specs = specs;

    // Always send all feature categories, with empty arrays if not selected
    const features = {};
    Object.keys(FEATURES_CONFIG).forEach((category) => {
      const selected = formData.features[category] || [];
      features[category.toLowerCase()] = selected;
    });
    payload.features = features;

    return payload;
  };

  // Handle form submit
  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.modelId || !formData.name || formData.basePrice <= 0) {
      setError("Please fill in all required fields (Model, Name, Base Price)");
      return;
    }

    try {
      setLoading(true);
      const payload = preparePayload();

      if (modalMode === "create") {
        await createVehicleVariant(payload);
        setSuccess("Variant created successfully!");
      } else if (modalMode === "edit") {
        await updateVehicleVariant(currentVariant.id, payload);
        setSuccess("Variant updated successfully!");
      }

      await fetchVariants();
      setTimeout(() => {
        setShowModal(false);
        setSuccess(null);
      });
    } catch (err) {
      setError("Failed to save variant: " + (err.response?.data?.message || err.message || "Unknown error"));
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDeleteClick = (variant) => {
    setVariantToDelete(variant);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!variantToDelete) return;

    try {
      setLoading(true);
      await deleteVehicleVariant(variantToDelete.id);
      setSuccess("Variant deleted successfully!");
      setShowDeleteModal(false);
      setVariantToDelete(null);
      await fetchVariants();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to delete variant: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Get model name by ID
  const getModelName = (modelId) => {
    const model = models.find((m) => m.id === modelId);
    return model ? model.name : "Unknown Model";
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalResults / pageSize);

  // Render step 1: Basic Info
  const renderStep1 = () => {
    if (modalMode === "view") {
      return (
        <div className="step-content">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label text-muted small">Parent Model</label>
              <p className="mb-0 fw-semibold">{getModelName(formData.modelId)}</p>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label text-muted small">Base Price</label>
              <p className="mb-0 fw-semibold text-primary">{formatPrice(formData.basePrice)}</p>
            </div>
            <div className="col-12 mb-3">
              <label className="form-label text-muted small">Variant Name</label>
              <p className="mb-0 fw-semibold">{formData.name}</p>
            </div>
            {currentVariant && (
              <>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted small">Created At</label>
                  <p className="mb-0">{new Date(currentVariant.createdAt).toLocaleString()}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted small">Updated At</label>
                  <p className="mb-0">{new Date(currentVariant.updatedAt).toLocaleString()}</p>
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label text-muted small">Variant ID</label>
                  <p className="mb-0">
                    <code className="text-muted">{currentVariant.id}</code>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="step-content">
        {/* Model Selection */}
        <div className="mb-3">
          <label className="form-label">
            Parent Model <span className="text-danger">*</span>
          </label>
          <select className="form-select" name="modelId" value={formData.modelId} onChange={handleBasicInfoChange} disabled={modalMode === "view"} required>
            <option value="">Select a model...</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        {/* Variant Name */}
        <div className="mb-3">
          <label className="form-label">
            Variant Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleBasicInfoChange}
            disabled={modalMode === "view"}
            placeholder="e.g., Tesla Model Y Long Range AWD"
            required
          />
        </div>

        {/* Base Price */}
        <div className="mb-3">
          <label className="form-label">
            Base Price (USD) <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            className="form-control"
            name="basePrice"
            value={formData.basePrice}
            onChange={handleBasicInfoChange}
            disabled={modalMode === "view"}
            min="0"
            step="1"
            placeholder="46630"
            required
          />
        </div>
      </div>
    );
  };

  // Render step 2: Specs
  const renderStep2 = () => {
    if (modalMode === "view") {
      const hasSpecs = formData.specs && Object.keys(formData.specs).length > 0;

      console.log("🔍 Render Step 2 - formData.specs:", formData.specs);
      console.log("🔍 Render Step 2 - hasSpecs:", hasSpecs);

      if (!hasSpecs) {
        return (
          <div className="step-content">
            <div className="alert alert-info">
              <i className="bx bx-info-circle me-2" />
              No specifications available for this variant.
            </div>
          </div>
        );
      }

      // Mapping for dropdown spec display labels
      const DROPDOWN_SPEC_LABELS = {
        DriveType: {
          FWD: "FWD (Front-Wheel Drive)",
          RWD: "RWD (Rear-Wheel Drive)",
          AWD: "AWD (All-Wheel Drive)",
        },
        MotorType: {
          "Single PMSM": "Single PMSM",
          "Dual PMSM": "Dual PMSM",
          "Induction Motor": "Induction Motor",
        },
        BatteryChemistry: {
          NMC: "NMC (Nickel Manganese Cobalt)",
          NCA: "NCA (Nickel Cobalt Aluminum)",
          LFP: "LFP (Lithium Iron Phosphate)",
        },
        RegenerativeBrakingCapacity: {
          "Standard (1-pedal)": "Standard (1-pedal)",
          "Enhanced (1-pedal)": "Enhanced (1-pedal)",
        },
        ChargingPortTypes: {
          NACS: "NACS (Tesla's North American Charging Standard)",
          CCS: "CCS (Combined Charging System)",
        },
        HeatPump: {
          Standard: "Standard",
          Optional: "Optional",
        },
      };
      const getDisplaySpecValue = (specName, specValue) => {
        if (!specValue) return "N/A";
        let label = specValue.value;
        if (DROPDOWN_SPEC_LABELS[specName] && DROPDOWN_SPEC_LABELS[specName][specValue.value]) {
          label = DROPDOWN_SPEC_LABELS[specName][specValue.value];
        }
        return `${label}${specValue.unit ? ` ${specValue.unit}` : ""}`;
      };
      return (
        <div className="step-content">
          {Object.entries(SPECS_CONFIG).map(([category, specs]) => {
            // Check if this category has any specs
            const categorySpecs = Object.keys(specs).filter((specName) => {
              const specValue = formData.specs[specName];
              return specValue && specValue.value !== undefined && specValue.value !== "";
            });

            if (categorySpecs.length === 0) return null;

            return (
              <div key={category} className="mb-4">
                <h6 className="text-primary mb-3 pb-2 border-bottom">{category}</h6>
                <div className="row g-3">
                  {categorySpecs.map((specName) => {
                    const specValue = formData.specs[specName];
                    return (
                      <div key={specName} className="col-md-6">
                        <div className="card">
                          <div className="card-body p-3">
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="flex-grow-1">
                                <label className="form-label text-muted small mb-1">{specName.replace(/([A-Z])/g, " $1").trim()}</label>
                                <p className="mb-0 fw-semibold fs-5">{getDisplaySpecValue(specName, specValue)}</p>
                              </div>
                              {/* Removed checkmark icon */}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="step-content">
        <h6 className="mb-3">Specifications (Optional)</h6>
        <small className="text-muted d-block mb-3">Fill in the specs you want to include. Leave empty to skip.</small>

        {/* Dropdown options for specific specs */}
        {(() => {
          const DROPDOWN_SPEC_OPTIONS = {
            DriveType: [
              { value: "FWD", label: "FWD (Front-Wheel Drive)" },
              { value: "RWD", label: "RWD (Rear-Wheel Drive)" },
              { value: "AWD", label: "AWD (All-Wheel Drive)" },
            ],
            MotorType: [
              { value: "Single PMSM", label: "Single PMSM" },
              { value: "Dual PMSM", label: "Dual PMSM" },
              { value: "Induction Motor", label: "Induction Motor" },
            ],
            BatteryChemistry: [
              { value: "NMC", label: "NMC (Nickel Manganese Cobalt)" },
              { value: "NCA", label: "NCA (Nickel Cobalt Aluminum)" },
              { value: "LFP", label: "LFP (Lithium Iron Phosphate)" },
            ],
            RegenerativeBrakingCapacity: [
              { value: "Standard (1-pedal)", label: "Standard (1-pedal)" },
              { value: "Enhanced (1-pedal)", label: "Enhanced (1-pedal)" },
            ],
            ChargingPortTypes: [
              { value: "NACS", label: "NACS (Tesla's North American Charging Standard)" },
              { value: "CCS", label: "CCS (Combined Charging System)" },
            ],
            HeatPump: [
              { value: "Standard", label: "Standard" },
              { value: "Optional", label: "Optional" },
            ],
          };
          return Object.entries(SPECS_CONFIG).map(([category, specs]) => (
            <div key={category} className="mb-4">
              <h6 className="text-primary mb-2">{category}</h6>
              <div className="row g-2">
                {Object.entries(specs).map(([specName, config]) => {
                  const specValue = formData.specs[specName];
                  const hasValue = specValue && specValue.value !== undefined && specValue.value !== "";
                  const dropdownOptions = DROPDOWN_SPEC_OPTIONS[specName];
                  return (
                    <div key={specName} className="col-md-6">
                      <div className="card">
                        <div className="card-body p-2">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <label className="form-label mb-0 small">{specName.replace(/([A-Z])/g, " $1").trim()}</label>
                            {hasValue && modalMode !== "view" && (
                              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeSpec(specName)} title="Remove">
                                <i className="bx bx-x" />
                              </button>
                            )}
                          </div>
                          <div className="input-group input-group-sm">
                            {dropdownOptions ? (
                              <select
                                className="form-select"
                                value={specValue?.value || ""}
                                onChange={(e) => handleSpecChange(category, specName, "value", e.target.value)}
                                disabled={modalMode === "view"}
                              >
                                <option value="">Select...</option>
                                {dropdownOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type={config.type}
                                className="form-control"
                                value={specValue?.value || ""}
                                onChange={(e) => handleSpecChange(category, specName, "value", e.target.value)}
                                disabled={modalMode === "view"}
                                placeholder={config.unit ? `Value` : "Enter value"}
                                inputMode={config.type === "number" ? "decimal" : undefined}
                                pattern={config.type === "number" ? "[0-9]*[.,]?[0-9]*" : undefined}
                                step={config.type === "number" ? "any" : undefined}
                                onKeyDown={
                                  config.type === "number"
                                    ? (e) => {
                                        // Allow: backspace, delete, tab, escape, enter, arrows, home, end
                                        if (["Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) {
                                          return;
                                        }
                                        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                                        if ((e.ctrlKey || e.metaKey) && ["a", "c", "v", "x"].includes(e.key.toLowerCase())) {
                                          return;
                                        }
                                        // Allow one dot for decimals
                                        if (e.key === ".") {
                                          if (e.target.value.includes(".")) {
                                            e.preventDefault();
                                          }
                                          return;
                                        }
                                        // Allow digits only
                                        if (!/^[0-9]$/.test(e.key)) {
                                          e.preventDefault();
                                        }
                                      }
                                    : undefined
                                }
                              />
                            )}
                            {config.unit && <span className="input-group-text">{config.unit}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ));
        })()}
      </div>
    );
  };

  // Render step 3: Features
  const renderStep3 = () => {
    if (modalMode === "view") {
      const hasFeatures = formData.features && Object.values(formData.features).some((arr) => arr && arr.length > 0);

      console.log("🔍 Render Step 3 - formData.features:", formData.features);
      console.log("🔍 Render Step 3 - hasFeatures:", hasFeatures);

      if (!hasFeatures) {
        return (
          <div className="step-content">
            <div className="alert alert-info">
              <i className="bx bx-info-circle me-2" />
              No features available for this variant.
            </div>
          </div>
        );
      }

      return (
        <div className="step-content">
          {Object.entries(FEATURES_CONFIG).map(([category]) => {
            const selectedFeatures = formData.features[category] || [];

            console.log(`🔍 Category ${category} - features:`, selectedFeatures);

            if (selectedFeatures.length === 0) return null;

            return (
              <div key={category} className="mb-4">
                <h6 className="text-primary mb-3 pb-2 border-bottom">
                  {category}
                  <span className="badge bg-label-primary ms-2">{selectedFeatures.length}</span>
                </h6>
                <div className="row g-2">
                  {selectedFeatures.map((feature) => (
                    <div key={feature} className="col-md-6">
                      <div className="card bg-light">
                        <div className="card-body p-2 d-flex align-items-center">
                          {/* Removed checkmark icon */}
                          <span className="fw-semibold">{feature.replace(/([A-Z])/g, " $1").trim()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="step-content">
        <h6 className="mb-3">Features (Optional)</h6>
        <small className="text-muted d-block mb-3">Check the features this variant includes.</small>

        {Object.entries(FEATURES_CONFIG).map(([category, features]) => (
          <div key={category} className="mb-4">
            <h6 className="text-primary mb-2">{category}</h6>
            <div className="row g-2">
              {features.map((feature) => {
                const isChecked = formData.features[category]?.includes(feature) || false;

                return (
                  <div key={feature} className="col-md-6">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`feature-${category}-${feature}`}
                        checked={isChecked}
                        onChange={() => handleFeatureToggle(category, feature)}
                        disabled={modalMode === "view"}
                      />
                      <label className="form-check-label" htmlFor={`feature-${category}-${feature}`}>
                        {feature.replace(/([A-Z])/g, " $1").trim()}
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Vehicle Variant Management</h4>
          <p className="text-muted mb-0">Manage vehicle variants with specs and features</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          <i className="bx bx-plus me-1" />
          Add New Variant
        </button>
      </div>

      {/* Alerts (only show in background if modal is not open) */}
      {!showModal && error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bx bx-error me-2" />
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)} />
        </div>
      )}
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bx bx-check-circle me-2" />
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess(null)} />
        </div>
      )}

      {/* Search and Filter */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bx bx-search" />
                </span>
                <input type="text" className="form-control" placeholder="Search variants..." value={searchTerm} onChange={handleSearchChange} />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="">Sort by...</option>
                <option value="name">Name</option>
                <option value="basePrice">Base Price</option>
                <option value="createdAt">Created Date</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-body">
          {loading && !showModal ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Variant Name</th>
                      <th>Parent Model</th>
                      <th>Base Price</th>
                      <th>Specs</th>
                      <th>Features</th>
                      <th style={{ width: "150px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5 text-muted">
                          <i className="bx bx-customize bx-lg mb-2" />
                          <p>No variants found</p>
                        </td>
                      </tr>
                    ) : (
                      variants.map((variant) => {
                        const specsCount = variant.specs ? Object.keys(variant.specs).length : 0;
                        const featuresCount = variant.features ? Object.values(variant.features).reduce((sum, arr) => sum + arr.length, 0) : 0;

                        return (
                          <tr key={variant.id}>
                            <td>
                              <strong>{variant.name}</strong>
                            </td>
                            <td>{getModelName(variant.modelId)}</td>
                            <td className="text-primary fw-semibold">{formatPrice(variant.basePrice)}</td>
                            <td>
                              <span className="badge bg-label-info">{specsCount} specs</span>
                            </td>
                            <td>
                              <span className="badge bg-label-success">{featuresCount} features</span>
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                <button className="btn btn-sm btn-outline-info" onClick={() => handleView(variant.id)} title="View">
                                  <i className="bx bx-show" />
                                </button>
                                <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(variant.id)} title="Edit">
                                  <i className="bx bx-edit" />
                                </button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(variant)} title="Delete">
                                  <i className="bx bx-trash" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div className="text-muted">
                    Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalResults)} of {totalResults} results
                  </div>
                  <nav>
                    <ul className="pagination mb-0">
                      <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => setPage(page - 1)} disabled={page === 1}>
                          Previous
                        </button>
                      </li>
                      {Array.from({ length: totalPages }, (_, i) => {
                        const pageNum = i + 1;
                        if (pageNum === 1 || pageNum === totalPages || (pageNum >= page - 1 && pageNum <= page + 1)) {
                          return (
                            <li key={pageNum} className={`page-item ${page === pageNum ? "active" : ""}`}>
                              <button className="page-link" onClick={() => setPage(pageNum)}>
                                {pageNum}
                              </button>
                            </li>
                          );
                        } else if (pageNum === page - 2 || pageNum === page + 2) {
                          return (
                            <li key={pageNum} className="page-item disabled">
                              <span className="page-link">...</span>
                            </li>
                          );
                        }
                        return null;
                      })}
                      <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create/Edit/View Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalMode === "create" && (
                    <>
                      <i className="bx bx-plus me-2" />
                      Create New Variant
                    </>
                  )}
                  {modalMode === "edit" && (
                    <>
                      <i className="bx bx-edit me-2" />
                      Edit Variant
                    </>
                  )}
                  {modalMode === "view" && (
                    <>
                      <i className="bx bx-show me-2" />
                      View Variant
                    </>
                  )}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setError(null);
                  }}
                  disabled={loading}
                />
              </div>

              <div className="modal-body">
                {/* Error alert inside modal */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bx bx-error me-2" />
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError(null)} />
                  </div>
                )}
                {/* Step Indicator - Clickable */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between">
                    <div
                      className={`flex-fill text-center ${currentStep === 1 ? "text-primary" : "text-muted"}`}
                      style={{ cursor: "pointer", transition: "all 0.3s" }}
                      onClick={() => setCurrentStep(1)}
                      onMouseEnter={(e) => {
                        if (currentStep !== 1) e.currentTarget.style.opacity = "0.7";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "1";
                      }}
                    >
                      <div className={`badge ${currentStep === 1 ? "bg-primary" : "bg-secondary"} mb-2`}>1</div>
                      <div className="small">Basic Info</div>
                    </div>
                    <div
                      className={`flex-fill text-center ${currentStep === 2 ? "text-primary" : "text-muted"}`}
                      style={{ cursor: "pointer", transition: "all 0.3s" }}
                      onClick={() => setCurrentStep(2)}
                      onMouseEnter={(e) => {
                        if (currentStep !== 2) e.currentTarget.style.opacity = "0.7";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "1";
                      }}
                    >
                      <div className={`badge ${currentStep === 2 ? "bg-primary" : "bg-secondary"} mb-2`}>2</div>
                      <div className="small">Specifications</div>
                    </div>
                    <div
                      className={`flex-fill text-center ${currentStep === 3 ? "text-primary" : "text-muted"}`}
                      style={{ cursor: "pointer", transition: "all 0.3s" }}
                      onClick={() => setCurrentStep(3)}
                      onMouseEnter={(e) => {
                        if (currentStep !== 3) e.currentTarget.style.opacity = "0.7";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "1";
                      }}
                    >
                      <div className={`badge ${currentStep === 3 ? "bg-primary" : "bg-secondary"} mb-2`}>3</div>
                      <div className="small">Features</div>
                    </div>
                  </div>
                  <div className="progress mt-2" style={{ height: "3px" }}>
                    <div className="progress-bar" style={{ width: `${(currentStep / 3) * 100}%` }} />
                  </div>
                </div>

                {/* Step Content */}
                <div style={{ minHeight: "400px", maxHeight: "60vh", overflowY: "auto" }}>
                  {currentStep === 1 && renderStep1()}
                  {currentStep === 2 && renderStep2()}
                  {currentStep === 3 && renderStep3()}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={loading}>
                  {modalMode === "view" ? "Close" : "Cancel"}
                </button>

                {modalMode !== "view" && (
                  <>
                    {currentStep > 1 && (
                      <button type="button" className="btn btn-outline-primary" onClick={prevStep} disabled={loading}>
                        <i className="bx bx-chevron-left me-1" />
                        Previous
                      </button>
                    )}

                    {currentStep < 3 ? (
                      <button type="button" className="btn btn-primary" onClick={nextStep} disabled={loading}>
                        Next
                        <i className="bx bx-chevron-right ms-1" />
                      </button>
                    ) : (
                      <button type="button" className="btn btn-success" onClick={handleSubmit} disabled={loading}>
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="bx bx-save me-1" />
                            {modalMode === "create" ? "Create Variant" : "Update Variant"}
                          </>
                        )}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">
                  <i className="bx bx-trash me-2" />
                  Confirm Delete
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowDeleteModal(false)} disabled={loading} />
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this variant?</p>
                {variantToDelete && (
                  <div className="alert alert-warning">
                    <p className="mb-0">
                      <strong>{variantToDelete.name}</strong>
                    </p>
                    <p className="mb-0 text-danger small mt-2">This action cannot be undone.</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)} disabled={loading}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmDelete} disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <i className="bx bx-trash me-1" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleVariantManagement;
