import React, { useState, useEffect, useMemo } from 'react'
import { AlertCircle, CheckCircle, Plus, Edit, Trash } from 'lucide-react';
import {
    getAllVehicles,
    deleteVehicle,
    getAllVehicleVariants, 
    getAllDealers         
} from '../../../../services/vehicleService';
import VehicleStockModal from './VehicleStockModal';

// Helper Function - Render Status Badge
const RenderVehicleStatus = ({ status }) => {
    let badgeClass = 'secondary';
    switch (status?.toLowerCase()) {
        case 'available': badgeClass = 'success'; break;
        case 'reserved': badgeClass = 'warning'; break;
        case 'sold': badgeClass = 'danger'; break;
        case 'intransit': badgeClass = 'info'; break;
    }
    return <span className={`badge bg-label-${badgeClass}`}>{status || 'N/A'}</span>;
};

export default function VehicleStockList() {
  return (
    <div>VehicleStockList</div>
  )
}
