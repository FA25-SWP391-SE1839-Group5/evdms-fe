import { getAllVehicleModels } from "../../services/vehicleModelService";
import { getAllVehicleVariants, getVehicleVariantById } from "../../services/vehicleVariantService";
import VehicleVariantSearchFilter from "./vehicle-variants/VehicleVariantSearchFilter";

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

import { useEffect, useRef, useState } from "react";
import VehicleVariantHeader from "./vehicle-variants/VehicleVariantHeader";
import VehicleVariantTable from "./vehicle-variants/VehicleVariantTable";

const VehicleVariantBrowse = () => {
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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400); // 400ms debounce
    return () => clearTimeout(handler);
  }, [searchTerm]);
  // Removed sortBy state. Sorting is now handled locally in the table.

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create', 'edit', 'view'
  const [, setCurrentVariant] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // Multi-step form

  // Form state
  const [formData, setFormData] = useState({
    modelId: "",
    name: "",
    basePrice: 0,
    specs: {},
    features: {},
  });

  // Fetch models on mount
  useEffect(() => {
    fetchModels();
  }, []);

  // Fetch variants when filters change (debounced search)
  useEffect(() => {
    const loadVariants = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllVehicleVariants({
          page,
          pageSize,
          search: debouncedSearchTerm,
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
  }, [page, pageSize, debouncedSearchTerm]);

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

  // Per-step scroll memory
  const modalBodyRef = useRef(null);
  const scrollPositions = useRef({ 1: 0, 2: 0, 3: 0 });

  // Save scroll position before changing step, restore after
  const setStepWithScroll = (getNextStep) => {
    if (modalBodyRef.current) {
      scrollPositions.current[currentStep] = modalBodyRef.current.scrollTop;
    }
    setCurrentStep((prev) => {
      const next = getNextStep(prev);
      setTimeout(() => {
        if (modalBodyRef.current) {
          modalBodyRef.current.scrollTop = scrollPositions.current[next] || 0;
        }
      }, 0);
      return next;
    });
  };

  const nextStep = () => setStepWithScroll((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStepWithScroll((prev) => Math.max(prev - 1, 1));

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
      <VehicleVariantHeader onRefresh={fetchVariants} totalResults={totalResults} />

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
      <VehicleVariantSearchFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        pageSize={pageSize}
        onPageSizeChange={(e) => {
          setPageSize(Number(e.target.value));
          setPage(1);
        }}
      />

      {/* Table */}
      <VehicleVariantTable
        variants={variants}
        getModelName={getModelName}
        formatPrice={formatPrice}
        handleView={handleView}
        loading={loading}
        showModal={showModal}
        page={page}
        pageSize={pageSize}
        totalResults={totalResults}
        totalPages={totalPages}
        setPage={setPage}
      />

      {/* Create/Edit/View Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
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
                      onClick={() => setStepWithScroll(() => 1)}
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
                      onClick={() => setStepWithScroll(() => 2)}
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
                      onClick={() => setStepWithScroll(() => 3)}
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
                <div
                  ref={modalBodyRef}
                  style={{ minHeight: "400px", maxHeight: "60vh", overflowY: "auto" }}
                  onScroll={() => {
                    if (modalBodyRef.current) {
                      scrollPositions.current[currentStep] = modalBodyRef.current.scrollTop;
                    }
                  }}
                >
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
                      <button type="button" className="btn btn-success" disabled={loading}>
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
    </div>
  );
};

export default VehicleVariantBrowse;
