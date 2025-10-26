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

export default function VehicleVariantModal() {
    return (
        <div>

        </div>
    )
}
