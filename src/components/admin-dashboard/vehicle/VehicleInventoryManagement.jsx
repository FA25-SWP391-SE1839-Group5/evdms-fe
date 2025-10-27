import React, { useState } from 'react';

import VehicleModelList from './models/VehicleModelList';
import VehicleVariantList from './variants/VehicleVariantList';
// import VehicleStockList from './stock/VehicleStockList';

export default function VehicleInventoryManagement() {
    const [activeTab, setActiveTab] = useState('models'); // Bắt đầu với Models

    const renderTabContent = () => {
        switch (activeTab) {
            case 'models':
                return <VehicleModelList />
            case 'variants':
                return <VehicleVariantList />
            case 'stock':
                // return <VehicleStockList />;
                return <div>Vehicle Stock/Inventory Management - Coming Soon...</div>;
            default:
                return <div>Select a tab</div>;
        }
    };
    return (
        <>
            <h4 className="fw-bold py-3 mb-4">
              <span className="text-muted fw-light">Vehicle Management /</span> Vehicle Inventory
            </h4>

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
