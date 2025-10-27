import React, { useState, useEffect } from 'react';

import VehicleModelList from './models/VehicleModelList';
import VehicleVariantList from './variants/VehicleVariantList';
import VehicleStockList from './stock/VehicleStockList';
import { 
    getAllVehicleModels, 
    getAllVehicleVariants, 
    getAllVehicles 
} from '../../../services/vehicleService';

import VehicleInventoryStatsCards from './VehicleInventoryStatsCards';

export default function VehicleInventoryManagement() {
    const [activeTab, setActiveTab] = useState('models'); // Bắt đầu với Models

    // State cho dữ liệu
    const [models, setModels] = useState([]);
    const [variants, setVariants] = useState([]);
    const [vehicles, setVehicles] = useState([]); // Stock
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Hàm fetch dữ liệu tổng hợp
    const fetchAllInventoryData = async () => {
        try {
            setLoading(true);
            setError('');
            const [modelsRes, variantsRes, vehiclesRes] = await Promise.all([
                getAllVehicleModels(),
                getAllVehicleVariants(),
                getAllVehicles()
            ]);

            // Xử lý và set state (điều chỉnh .data... theo API response thực tế)
            setModels(modelsRes.data?.data?.items || modelsRes.data?.items || modelsRes.data || []);
            setVariants(variantsRes.data?.data?.items || variantsRes.data?.items || variantsRes.data || []);
            setVehicles(vehiclesRes.data?.data?.items || vehiclesRes.data?.items || vehiclesRes.data || []);

        } catch (err) {
            console.error("Failed to load inventory data:", err);
            setError(err.response?.data?.message || err.message || 'Failed to load inventory data');
            // Reset state nếu lỗi
            setModels([]);
            setVariants([]);
            setVehicles([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch dữ liệu khi component mount
    useEffect(() => {
        fetchAllInventoryData();
    }, []); // Chỉ chạy 1 lần

    const renderTabContent = () => {
        // Truyền hàm fetch lại data xuống component con để chúng có thể reload khi cần (sau khi Add/Edit/Delete)
        const reloadData = fetchAllInventoryData;

        switch (activeTab) {
            case 'models':
                return <VehicleModelList />
            case 'variants':
                return <VehicleVariantList />
            case 'stock':
                return <VehicleStockList />;
            default:
                return <div>Select a tab</div>;
        }
    };

    return (
        <>

            {/* Thông báo lỗi chung */}
            {error && !loading && (
                <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                    <AlertCircle size={20} className="me-2" />
                    <div>{error}</div>
                </div>
            )}

            {/* Stats Cards */}
            {loading ? (
                <div className="text-center p-4"><p>Loading stats...</p></div>
            ) : (
                <VehicleInventoryStatsCards models={models} variants={variants} vehicles={vehicles} />
            )}

            {/* Charts (Placeholder) */}
            {/* {loading ? (
                 <div className="text-center p-4"><p>Loading charts...</p></div>
            ) : (
                 <VehicleInventoryCharts models={models} variants={variants} vehicles={vehicles} />
            )} */}
             <div className="card mb-4">
                <div className="card-body">Placeholder for Charts</div>
            </div>

            <div className="row">
                <div className="col-md-12">
                    <ul className="nav nav-pills flex-column flex-md-row mb-3">
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeTab === 'models' ? 'active' : ''}`}
                                href="#"
                                onClick={(e) => { e.preventDefault(); setActiveTab('models'); }}
                            >
                                <i className="bx bx-car me-1" /> Models
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeTab === 'variants' ? 'active' : ''}`}
                                href="#"
                                onClick={(e) => { e.preventDefault(); setActiveTab('variants'); }}
                            >
                                <i className="bx bx-slider-alt me-1" /> Variants
                            </a>
                        </li>
                         <li className="nav-item">
                            <a
                                className={`nav-link ${activeTab === 'stock' ? 'active' : ''}`}
                                href="#"
                                onClick={(e) => { e.preventDefault(); setActiveTab('stock'); }}
                            >
                                <i className="bx bx-package me-1" /> Stock
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Display Tabs */}
            <div className="mt-3">
                {renderTabContent()}
            </div>
        </>
    )
}
