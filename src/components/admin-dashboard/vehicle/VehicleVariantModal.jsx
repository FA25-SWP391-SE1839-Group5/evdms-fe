import React, { useState, useEffect } from 'react'
import { AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { createVehicleVariant, updateVehicleVariant, getAllVehicleModels } from '../../../services/vehicleService';

const specCategories = {
    Performance: [
        { key: 'horsepower', label: 'Horsepower', unit: 'hp' },
        { key: 'torque', label: 'Torque', unit: 'Nm' },
        { key: 'acceleration', label: 'Acceleration (0-100km/h)', unit: 's' },
        { key: 'driveType', label: 'Drive Type', unit: null },
        { key: 'motorType', label: 'Motor Type', unit: null },
        { key: 'topSpeed', label: 'Top Speed', unit: 'km/h' },
        { key: 'curbWeight', label: 'Curb Weight', unit: 'kg' },
    ],
    Energy: [
        { key: 'batteryCapacity', label: 'Battery Capacity', unit: 'kWh' },
        { key: 'range', label: 'Range (WLTP)', unit: 'km' },
        { key: 'efficiency', label: 'Efficiency', unit: 'Wh/km' },
        { key: 'batteryChemistry', label: 'Battery Chemistry', unit: null },
        { key: 'batteryVoltageArchitecture', label: 'Voltage Architecture', unit: 'V' },
        { key: 'regenerativeBrakingCapacity', label: 'Regen Braking Capacity', unit: null }, // Đơn vị? kW?
    ],
    Charging: [
        { key: 'maxAcChargingRate', label: 'Max AC Charging', unit: 'kW' },
        { key: 'maxDcFastChargingRate', label: 'Max DC Charging', unit: 'kW' },
        { key: 'dcFastChargingTime', label: 'DC Fast Charging Time (10-80%)', unit: 'min' },
        { key: 'acChargingTime', label: 'AC Charging Time (0-100%)', unit: 'h' },
        { key: 'chargingPortTypes', label: 'Charging Port Types', unit: null },
    ],
    Practicality: [
        { key: 'towingCapacity', label: 'Towing Capacity', unit: 'kg' },
        { key: 'frunkVolume', label: 'Frunk Volume', unit: 'L' },
        { key: 'cargoVolume', label: 'Cargo Volume (Rear Seats Up)', unit: 'L' },
        { key: 'heatPump', label: 'Heat Pump', unit: null }, // Yes/No?
        { key: 'v2lCapability', label: 'V2L Capability', unit: 'kW' },
    ]
};

const featureCategories = {
    Safety: ['AutomaticEmergencyBraking', 'BackupCamera', 'BlindSpotMonitor', 'BrakeAssist', 'LedHeadlights', 'LaneDepartureWarning', 'RearCrossTrafficAlert', 'StabilityControl', 'TractionControl', 'ParkingSensors'],
    Convenience: ['AdaptiveCruiseControl', 'CooledSeats', 'HeatedSeats', 'HeatedSteeringWheel', 'KeylessEntry', 'KeylessStart', 'NavigationSystem', 'PowerLiftgate', 'RainSensingWipers'],
    Entertainment: ['AndroidAuto', 'AppleCarPlay', 'Bluetooth', 'HomeLink', 'PremiumSoundSystem', 'UsbPort', 'WifiHotspot', 'SatelliteRadio', 'AuxInput'],
    Exterior: ['AlloyWheels', 'TowHitch', 'FogLights', 'RoofRails', 'Sunroof', 'PowerMirrors', 'RearSpoiler', 'AutomaticHeadlights', 'DaytimeRunningLights'],
    Seating: ['LeatherSeats', 'MemorySeat', 'PowerDriverSeat', 'PowerPassengerSeat', 'HeatedRearSeats', 'VentilatedSeats', 'SplitFoldingRearSeat', 'AdjustableLumbarSupport', 'BucketSeats', 'ThirdRowSeating']
};

export default function VehicleVariantModal({ show, onClose, onSaveSuccess, variantToEdit }) {
    const isEditMode = Boolean(variantToEdit);
    const modalTitle = isEditMode ? 'Edit Vehicle Variant' : 'Add New Vehicle Variant';

    const [currentStep, setCurrentStep] = useState(1); // 1: Basic, 2: Specs, 3: Features
    const [models, setModels] = useState([]);
    const [loadingModels, setLoadingModels] = useState(false);

    // State cho form data
    const [basicInfo, setBasicInfo] = useState({ modelId: '', name: '', basePrice: '' });
    const [specs, setSpecs] = useState({}); // Lưu dạng { horsepower: { value: '...', unit: 'hp' }, ... }
    const [features, setFeatures] = useState({}); // Lưu dạng { Safety: ['Feature1', 'Feature2'], ... }

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch Vehicle Models khi modal mở lần đầu hoặc khi show=true
    useEffect(() => {
        if (show && models.length === 0) { // Chỉ fetch nếu chưa có models
            const fetchModels = async () => {
                setLoadingModels(true);
                try {
                    const response = await getAllVehicleModels();
                    setModels(response.data?.data?.items || response.data?.items || response.data || []);
                } catch (err) {
                    setError('Failed to load vehicle models. Cannot add/edit variants.');
                } finally {
                    setLoadingModels(false);
                }
            };
            fetchModels();
        }
    }, [show]); // Phụ thuộc vào show

    // Populate form data when editing
    useEffect(() => {
        if (show) {
            setError('');
            setCurrentStep(1); // Luôn bắt đầu từ step 1
            if (isEditMode && variantToEdit) {
                setBasicInfo({
                    modelId: variantToEdit.modelId || '',
                    name: variantToEdit.name || '',
                    basePrice: variantToEdit.basePrice || ''
                });
                setSpecs(variantToEdit.specs || {});
                setFeatures(variantToEdit.features || {});
            } else {
                // Reset form for adding
                setBasicInfo({ modelId: '', name: '', basePrice: '' });
                setSpecs({});
                setFeatures({});
            }
        }
    }, [show, variantToEdit, isEditMode]);

    // --- Handlers cho từng bước ---
    const handleBasicInfoChange = (e) => {
        const { name, value } = e.target;
        setBasicInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSpecChange = (specKey, value) => {
        setSpecs(prev => {
            const newSpecs = { ...prev };
            const specConfig = Object.values(specCategories).flat().find(s => s.key === specKey);
            // Chỉ cập nhật nếu có giá trị, xóa nếu rỗng
            if (value && value.trim() !== '') {
                newSpecs[specKey] = { value: value, ...(specConfig?.unit && { unit: specConfig.unit }) };
            } else {
                delete newSpecs[specKey]; // Xóa spec khỏi object nếu value rỗng
            }
            return newSpecs;
        });
    };

    const handleFeatureChange = (category, feature) => {
        setFeatures(prev => {
            const newFeatures = { ...prev };
            const categoryFeatures = newFeatures[category] || [];
            if (categoryFeatures.includes(feature)) {
                // Remove feature
                newFeatures[category] = categoryFeatures.filter(f => f !== feature);
                // Nếu category rỗng thì xóa luôn category đó
                if (newFeatures[category].length === 0) {
                    delete newFeatures[category];
                }
            } else {
                // Add feature
                newFeatures[category] = [...categoryFeatures, feature];
            }
            return newFeatures;
        });
    };

    // --- Navigation Handlers ---
    const nextStep = () => {
        setError(''); // Clear previous errors
        if (currentStep === 1) { // Validate Basic Info
            if (!basicInfo.modelId || !basicInfo.name || !basicInfo.basePrice || Number(basicInfo.basePrice) <= 0) {
                setError('Please select a Model, enter a valid Name, and a positive Base Price.');
                return;
            }
        }
        // Add validation for other steps if needed before proceeding
        if (currentStep < 4) setCurrentStep(s => s + 1);
    };
    const prevStep = () => {
        setError(''); // Clear errors when navigating back
        if (currentStep > 1) setCurrentStep(s => s - 1);
    };

    // --- Submit Handler ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Basic validation (đã check ở nextStep)
        if (!basicInfo.modelId || !basicInfo.name || !basicInfo.basePrice) {
            setError('Basic information is missing.');
            setCurrentStep(1); // Quay về step 1
            return;
        }

        setLoading(true);
        setError('');

        const dataToSend = {
            modelId: basicInfo.modelId,
            name: basicInfo.name,
            basePrice: Number(basicInfo.basePrice) || 0,
            // Chỉ gửi specs/features nếu object không rỗng
            ...(Object.keys(specs).length > 0 && { specs: specs }),
            ...(Object.keys(features).length > 0 && { features: features }),
        };

        try {
            let response;
            if (isEditMode) {
                response = await updateVehicleVariant(variantToEdit.id, dataToSend);
            } else {
                response = await createVehicleVariant(dataToSend);
            }

            // Kiểm tra response từ backend (giả định có success flag)
             if (response.data?.success === true || (response.status >= 200 && response.status < 300) ) {
                onSaveSuccess(isEditMode);
            } else {
                throw new Error(response.data?.message || 'Failed to save variant');
            }
        } catch (err) {
            console.error("Save Variant Error:", err);
            setError(err.response?.data?.message || err.message || 'Operation failed');
        } finally {
            setLoading(false);
            // Không đóng modal ngay nếu có lỗi
        }
    };

    // --- Render Spec Value Helper ---
    const renderSpecValue = (specKey) => {
        const spec = specs[specKey];
        if (!spec) return <span className="text-muted">N/A</span>;
        return `${spec.value}${spec.unit ? ` ${spec.unit}` : ''}`;
    };

    // --- Render Feature List Helper ---
    const renderFeatureList = (category) => {
        const list = features[category];
        if (!list || list.length === 0) return <span className="text-muted">None</span>;
        return (
            <ul className="list-unstyled mb-0 small">
                {list.map(f => <li key={f}>- {f.replace(/([A-Z])/g, ' $1').trim()}</li>)}
            </ul>
        );
    };

    if (!show) return null;

    return (
        <>
            <div 
                className={`modal fade ${show ? 'show d-block' : ''}`} 
                tabIndex="-1" 
                style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}
            >
                {/* Tăng kích thước modal cho nhiều nội dung */}
                <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable" role="document">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            <div
                                id="wizard-modern-icons" 
                                className="bs-stepper wizard-icons wizard-modern mt-2"
                            >

                                {/* Stepper Header */}
                                <div className="bs-stepper-header border-bottom">

                                    {/* Step 1: Basic */}
                                    <div 
                                        className={`step ${currentStep === 1 ? 'active' : ''}`} 
                                        data-target="#basic-details-step"
                                    >
                                        <button 
                                            type="button" 
                                            className="step-trigger" 
                                            onClick={() => setCurrentStep(1)} 
                                            disabled={loading}
                                        >
                                            <span className="bs-stepper-icon">
                                                <i className="bx bx-info-circle"></i>
                                            </span>
                                            <span className="bs-stepper-label">Basic Details</span>
                                        </button>
                                    </div>
                                    <div className="line">
                                        <i className="bx bx-chevron-right"></i>
                                    </div>

                                    {/* Step 2: Specs */}
                                    <div className={`step ${currentStep === 2 ? 'active' : ''}`} data-target="#specs-step">
                                        <button 
                                            type="button" 
                                            className="step-trigger" 
                                            onClick={() => setCurrentStep(2)} 
                                            disabled={loading}
                                        >
                                            <span className="bs-stepper-icon">
                                                <i className="bx bx-slider-alt"></i>
                                            </span>
                                            <span className="bs-stepper-label">Specifications</span>
                                        </button>
                                    </div>
                                    <div className="line">
                                        <i className="bx bx-chevron-right"></i>
                                    </div>

                                    {/* Step 3: Features */}
                                    <div className={`step ${currentStep === 3 ? 'active' : ''}`} data-target="#features-step">
                                        <button 
                                            type="button" 
                                            className="step-trigger" 
                                            onClick={() => setCurrentStep(3)} 
                                            disabled={loading}
                                        >
                                            <span className="bs-stepper-icon">
                                                <i className="bx bx-list-check"></i>
                                            </span>
                                            <span className="bs-stepper-label">Features</span>
                                        </button>
                                    </div>
                                    <div className="line">
                                        <i className="bx bx-chevron-right"></i>
                                    </div>

                                    {/* Step 4: Review */}
                                    <div className={`step ${currentStep === 4 ? 'active' : ''}`} data-target="#review-step">
                                        <button 
                                            type="button" 
                                            className="step-trigger" 
                                            onClick={() => setCurrentStep(4)} 
                                            disabled={loading}
                                        >
                                            <span className="bs-stepper-icon">
                                                <i className="bx bx-file-find"></i>
                                            </span>
                                            <span className="bs-stepper-label">Review & Submit</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Stepper Content */}
                                <div className="bs-stepper-content mt-1">
                                    {error && (
                                        <div className="alert alert-danger mx-4 d-flex align-items-center" role="alert">
                                            <AlertCircle size={20} className="me-2" />
                                            <div>{error}</div>
                                        </div>
                                    )}

                                    {/* Content Step 1: Basic Info */}
                                    <div 
                                        id="basic-details-step" 
                                        className={`content ${currentStep === 1 ? 'active dstepper-block' : 'dstepper-none'}`}
                                    >
                                        <div className="content-header mb-3">
                                            <h6 className="mb-0">Basic Details</h6>
                                            <small>Enter model, name, and price.</small>
                                        </div>
                                        <div className="row g-3">

                                            {/* Model Select */}
                                            <div className="col-md-6">
                                                <label htmlFor="modelId" className="form-label">Parent Model *</label>
                                                <select 
                                                    id="modelId" 
                                                    name="modelId" 
                                                    className={`form-select ${!basicInfo.modelId && error ? 'is-invalid' : ''}`} value={basicInfo.modelId} 
                                                    onChange={handleBasicInfoChange} 
                                                    disabled={loadingModels || loading || isEditMode} 
                                                    required
                                                >
                                                    <option value="">-- Select Model --</option>
                                                    {models.map(
                                                        model => (
                                                        <option 
                                                            key={model.id} 
                                                            value={model.id}>{model.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {loadingModels && <div className="form-text">Loading models...</div>}
                                            </div>

                                            {/* Variant Name */}
                                            <div className="col-md-6">
                                                <label htmlFor="variantName" className="form-label">Variant Name *</label>
                                                <input 
                                                    type="text" 
                                                    id="variantName" 
                                                    name="name" 
                                                    className={`form-control ${!basicInfo.name && error ? 'is-invalid' : ''}`} value={basicInfo.name} 
                                                    onChange={handleBasicInfoChange} 
                                                    placeholder="e.g., Eco, Plus, Premium" 
                                                    disabled={loading} 
                                                    required 
                                                />
                                            </div>

                                            {/* Base Price */}
                                            <div className="col-md-6">
                                                <label htmlFor="basePrice" className="form-label">Base Price (VND) *</label>
                                                <input 
                                                    type="number" 
                                                    id="basePrice" 
                                                    name="basePrice" 
                                                    className={`form-control ${!basicInfo.basePrice && error ? 'is-invalid' : ''}`} 
                                                    value={basicInfo.basePrice} 
                                                    onChange={handleBasicInfoChange} 
                                                    placeholder="e.g., 900000000" 
                                                    min="0" 
                                                    disabled={loading} 
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Step 2: Specs */}
                                    <div 
                                        id="specs-step" 
                                        className={`content ${currentStep === 2 ? 'active dstepper-block' : 'dstepper-none'}`}
                                    >
                                        <div className="content-header mb-3">
                                            <h6 className="mb-0">Specifications</h6>
                                            <small>Enter technical specifications.</small>
                                        </div>
                                        {Object.entries(specCategories).map(([category, specsInCategory]) => (
                                            <div key={category} className="mb-4">
                                                <h6>{category}</h6>
                                                <div className="row g-3">
                                                    {specsInCategory.map(spec => (
                                                        <div key={spec.key} className="col-md-6">
                                                            <label htmlFor={`spec-${spec.key}`} className="form-label">{spec.label}</label>
                                                            <div className="input-group input-group-sm"> {/* Use input-group-sm */}
                                                                <input type={spec.unit ? 'number' : 'text'} step={spec.unit === 's' || spec.unit === 'kWh' || spec.unit === 'Wh/km' ? '0.1' : '1'} id={`spec-${spec.key}`} name={spec.key} className="form-control" value={specs[spec.key]?.value || ''} onChange={(e) => handleSpecChange(spec.key, e.target.value)} placeholder={spec.unit ? `Enter value` : `e.g., AWD`} disabled={loading} />
                                                                {spec.unit && <span className="input-group-text">{spec.unit}</span>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Content Step 3: Features */}
                                    <div 
                                        id="features-step" 
                                        className={`content ${currentStep === 3 ? 'active dstepper-block' : 'dstepper-none'}`}
                                    >
                                        <div className="content-header mb-3">
                                            <h6 className="mb-0">Features</h6>
                                            <small>Select available features.</small>
                                        </div>
                                        {Object.entries(featureCategories).map(([category, featuresInCategory]) => (
                                            <div key={category} className="mb-4">
                                                <h6>{category}</h6>
                                                <div className="row g-2">
                                                    {featuresInCategory.map(feature => (
                                                        <div key={feature} className="col-md-4 col-sm-6">
                                                            <div className="form-check">
                                                                <input className="form-check-input" type="checkbox" id={`feature-${category}-${feature}`} checked={features[category]?.includes(feature) || false} onChange={() => handleFeatureChange(category, feature)} disabled={loading} />
                                                                <label className="form-check-label" htmlFor={`feature-${category}-${feature}`}>{feature.replace(/([A-Z])/g, ' $1').trim()}</label>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Content Step 4: Review */}
                                    <div 
                                        id="review-step" 
                                        className={`content ${currentStep === 4 ? 'active dstepper-block' : 'dstepper-none'}`}
                                    >
                                        <div className="content-header mb-3">
                                            <h6 className="mb-0">Review & Submit</h6>
                                            <small>Review the details before submitting.</small>
                                        </div>

                                        {/* Basic Info Summary */}
                                        <h6>Basic Details</h6>
                                        <ul className="list-unstyled">
                                            <li><strong>Model:</strong> {models.find(m => m.id === basicInfo.modelId)?.name || 'N/A'}</li>
                                            <li><strong>Variant Name:</strong> {basicInfo.name || 'N/A'}</li>
                                            <li><strong>Base Price:</strong> {basicInfo.basePrice ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(basicInfo.basePrice) : 'N/A'}</li>
                                        </ul>
                                        <hr/>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {show && <div className="modal-backdrop fade show"></div>}
        </>
    )
}
