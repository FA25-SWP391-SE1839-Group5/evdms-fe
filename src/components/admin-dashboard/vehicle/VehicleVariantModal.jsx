import React from 'react'
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
    const title = isEditMode ? 'Edit Vehicle Variant' : 'Add New Vehicle Variant';

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
        // Validate basic info before proceeding from step 1
        if (currentStep === 1 && (!basicInfo.modelId || !basicInfo.name || !basicInfo.basePrice)) {
            setError('Please fill in all basic information fields (Model, Name, Base Price).');
            return;
        }
        setError(''); // Clear error if validation passes
        if (currentStep < 3) setCurrentStep(s => s + 1);
    };
    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(s => s - 1);
    };

    // --- Submit Handler ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Basic validation (đã check ở nextStep)
        if (!basicInfo.modelId || !basicInfo.name || !basicInfo.basePrice) {
            setError('Basic information is missing.');
            setCurrentStep(1); // Quay về step 1
            setLoading(false);
            return;
        }

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

    // --- Render Functions cho từng step ---
    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Basic Info
                return (
                    <>
                        <div className="mb-3">
                            <label htmlFor="modelId" className="form-label">Parent Model *</label>
                            <select
                                id="modelId"
                                name="modelId"
                                className={`form-select ${!basicInfo.modelId && error ? 'is-invalid' : ''}`}
                                value={basicInfo.modelId}
                                onChange={handleBasicInfoChange}
                                disabled={loadingModels || loading || isEditMode} // Không cho đổi model khi edit
                                required
                            >
                                <option value="">-- Select Model --</option>
                                {models.map(model => (
                                    <option key={model.id} value={model.id}>{model.name}</option>
                                ))}
                            </select>
                            {loadingModels && <div className="form-text">Loading models...</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="variantName" className="form-label">Variant Name *</label>
                            <input
                                type="text"
                                id="variantName"
                                name="name"
                                className={`form-control ${!basicInfo.name && error ? 'is-invalid' : ''}`}
                                value={basicInfo.name}
                                onChange={handleBasicInfoChange}
                                placeholder="e.g., Eco, Plus, Premium"
                                disabled={loading}
                                required
                            />
                        </div>
                        <div className="mb-3">
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
                    </>
                );
                case 2: // Specs
                return (
                    <>
                        {Object.entries(specCategories).map(([category, specsInCategory]) => (
                            <div key={category} className="mb-4">
                                <h6>{category}</h6>
                                <div className="row g-3">
                                    {specsInCategory.map(spec => (
                                        <div key={spec.key} className="col-md-6">
                                            <label htmlFor={`spec-${spec.key}`} className="form-label">{spec.label}</label>
                                            <div className="input-group">
                                                <input
                                                    type={spec.unit ? 'number' : 'text'} // Dùng number nếu có đơn vị (thường là số)
                                                    step={spec.unit === 's' || spec.unit === 'kWh' || spec.unit === 'Wh/km' ? '0.1' : '1'} // Bước nhảy cho số thập phân
                                                    id={`spec-${spec.key}`}
                                                    name={spec.key}
                                                    className="form-control"
                                                    value={specs[spec.key]?.value || ''}
                                                    onChange={(e) => handleSpecChange(spec.key, e.target.value)}
                                                    placeholder={spec.unit ? `Enter value` : `e.g., AWD`}
                                                    disabled={loading}
                                                />
                                                {spec.unit && <span className="input-group-text">{spec.unit}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </>
                );
                case 3: // Features
                return (
                     <>
                        {Object.entries(featureCategories).map(([category, featuresInCategory]) => (
                            <div key={category} className="mb-4">
                                <h6>{category}</h6>
                                <div className="row g-2">
                                    {featuresInCategory.map(feature => (
                                        <div key={feature} className="col-md-4 col-sm-6">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`feature-${category}-${feature}`}
                                                    checked={features[category]?.includes(feature) || false}
                                                    onChange={() => handleFeatureChange(category, feature)}
                                                    disabled={loading}
                                                />
                                                <label className="form-check-label" htmlFor={`feature-${category}-${feature}`}>
                                                    {/* Chuyển đổi tên feature thành dạng đọc được */}
                                                    {feature.replace(/([A-Z])/g, ' $1').trim()}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </>
                );
            default: return null;
        }
    };

    if (!show) return null;

    return (
        <>
            <div 
                className={`modal fade ${show ? 'show d-block' : ''}`} 
                tabIndex="-1" 
                style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}>

                    {/* Tăng kích thước modal cho nhiều nội dung */}
                    <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
                        <div className="modal-content">
                            <form onSubmit={handleSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title">{title} - Step {currentStep} of 3</h5>
                                    <button 
                                        type="button" 
                                        className="btn-close" 
                                        onClick={onClose} 
                                        aria-label="Close" 
                                        disabled={loading}
                                    ></button>
                                </div>
                                <div 
                                    className="modal-body" 
                                    style={{ maxHeight: '70vh', overflowY: 'auto' }}
                                > {/* Scroll nếu nội dung dài */}
                                    {error && (
                                        <div className="alert alert-danger d-flex align-items-center" role="alert">
                                            <AlertCircle size={20} className="me-2" />
                                            <div>{error}</div>
                                        </div>
                                    )}
                                    {renderStepContent()}
                                </div>
                                <div className="modal-footer d-flex justify-content-between">
                                    {/* Previous Button */}
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={prevStep}
                                        disabled={loading || currentStep === 1}
                                    >
                                        <ArrowLeft size={16} className="me-1" /> Previous
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
            </div>
        </>
    )
}
