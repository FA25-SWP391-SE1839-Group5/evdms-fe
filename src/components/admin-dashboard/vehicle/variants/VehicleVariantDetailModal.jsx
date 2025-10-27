import React, { useState, useEffect } from 'react';
import { getVehicleVariantById } from '../../../../services/vehicleService';

// Helper format tiền tệ
const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return 'N/A';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Helper render Specs
const renderSpecValue = (spec) => {
    if (!spec) return <span className="text-muted">N/A</span>;
    return `${spec.value}${spec.unit ? ` ${spec.unit}` : ''}`;
};

// Helper render Features
const renderFeatureList = (features, category) => {
    const list = features[category];
    if (!list || list.length === 0) return <span className="text-muted">None</span>;
    return (
        <ul className="list-unstyled mb-0 small row row-cols-md-2">
            {list.map(f => <li key={f} className="col">- {f.replace(/([A-Z])/g, ' $1').trim()}</li>)}
        </ul>
    );
};

export default function VehicleVariantDetailModal({ show, onClose, variantId, modelsMap }) {
    const [variant, setVariant] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Các danh mục này sao chép từ file VehicleVariantModal để render cho đẹp
    const specCategories = {
        Performance: ['horsepower', 'torque', 'acceleration', 'driveType', 'motorType', 'topSpeed', 'curbWeight'],
        Energy: ['batteryCapacity', 'range', 'efficiency', 'batteryChemistry', 'batteryVoltageArchitecture', 'regenerativeBrakingCapacity'],
        Charging: ['maxAcChargingRate', 'maxDcFastChargingRate', 'dcFastChargingTime', 'acChargingTime', 'chargingPortTypes'],
        Practicality: ['towingCapacity', 'frunkVolume', 'cargoVolume', 'heatPump', 'v2lCapability']
    };
    
    const featureCategories = ['Safety', 'Convenience', 'Entertainment', 'Exterior', 'Seating'];

    // Map key của spec sang label cho đẹp
    // Bạn có thể mở rộng map này nếu muốn
    const specLabels = {
        horsepower: 'Horsepower',
        torque: 'Torque',
        acceleration: 'Acceleration (0-100km/h)',
        driveType: 'Drive Type',
        motorType: 'Motor Type',
        topSpeed: 'Top Speed',
        curbWeight: 'Curb Weight',
        batteryCapacity: 'Battery Capacity',
        range: 'Range (WLTP)',
        efficiency: 'Efficiency',
        batteryChemistry: 'Battery Chemistry',
        batteryVoltageArchitecture: 'Voltage Architecture',
        regenerativeBrakingCapacity: 'Regen Braking Capacity',
        maxAcChargingRate: 'Max AC Charging',
        maxDcFastChargingRate: 'Max DC Charging',
        dcFastChargingTime: 'DC Fast Charging Time (10-80%)',
        acChargingTime: 'AC Charging Time (0-100%)',
        chargingPortTypes: 'Charging Port Types',
        towingCapacity: 'Towing Capacity',
        frunkVolume: 'Frunk Volume',
        cargoVolume: 'Cargo Volume (Rear Seats Up)',
        heatPump: 'Heat Pump',
        v2lCapability: 'V2L Capability'
    };

    useEffect(() => {
        if (show && variantId) {
            const fetchVariantDetails = async () => {
                setLoading(true);
                setError('');
                try {
                    const response = await getVehicleVariantById(variantId);
                    setVariant(response.data?.data || response.data);
                } catch (err) {
                    setError('Failed to load vehicle variant details.');
                } finally {
                    setLoading(false);
                }
            };
            fetchVariantDetails();
        }
        if (!show) {
            setVariant(null);
            setError('');
        }
    }, [show, variantId]);

    return (
        <>
            <div 
                className={`modal fade ${show ? 'show d-block' : ''}`} 
                tabIndex="-1" 
                style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}
            >
                <div className="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Vehicle Variant Details</h5>
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={onClose}
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            {loading && (
                                <div className="text-center p-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            )}
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            {variant && !loading && (
                                <div>
                                    {/* Basic Info */}
                                    <h6>Basic Details</h6>
                                    <ul className="list-unstyled">
                                        <li><strong>Model:</strong> {modelsMap[variant.modelId] || 'N/A'}</li>
                                        <li><strong>Variant Name:</strong> {variant.name || 'N/A'}</li>
                                        <li><strong>Base Price:</strong> {formatCurrency(variant.basePrice)}</li>
                                    </ul>
                                    <hr/>

                                    {/* Specs Summary */}
                                    <h6>Specifications</h6>
                                    {Object.entries(specCategories).map(([category, keys]) => (
                                        <div key={category} className="mb-2">
                                            <p className="mb-1"><strong>{category}:</strong></p>
                                            <ul className="list-unstyled row row-cols-md-2">
                                                {keys.map(specKey => (
                                                    <li key={specKey} className="col">
                                                        <small>{specLabels[specKey] || specKey}: {renderSpecValue(variant.specs[specKey])}</small>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                    {(!variant.specs || Object.keys(variant.specs).length === 0) && <p className="text-muted">No specifications entered.</p>}
                                    <hr/>

                                    {/* Features Summary */}
                                    <h6>Features</h6>
                                    {featureCategories.map(category => (
                                         <div key={category} className="mb-2">
                                             <p className="mb-1"><strong>{category}:</strong></p>
                                             {renderFeatureList(variant.features, category)}
                                         </div>
                                    ))}
                                    {(!variant.features || Object.keys(variant.features).length === 0) && <p className="text-muted">No features selected.</p>}
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button 
                                type="button" 
                                className="btn btn-label-secondary" 
                                onClick={onClose}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Backdrop */}
            {show && <div className="modal-backdrop fade show"></div>}
        </>
    );
}