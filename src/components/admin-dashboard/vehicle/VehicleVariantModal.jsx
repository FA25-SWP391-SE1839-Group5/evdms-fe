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
                style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}>

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
                                            className={`step ${currentStep === 1 ? 'active' : ''}`} data-target="#basic-details-step"
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
