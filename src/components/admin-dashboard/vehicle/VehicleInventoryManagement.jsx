import React, { useState } from 'react';
// Import các component con sẽ tạo sau
// import VehicleModelList from './models/VehicleModelList';
// import VehicleVariantList from './variants/VehicleVariantList';
// import VehicleStockList from './stock/VehicleStockList';

export default function VehicleInventoryManagement() {
    const [activeTab, setActiveTab] = useState('models'); // Bắt đầu với Models

    const renderTabContent = () => {
        switch (activeTab) {
            case 'models':
                // return <VehicleModelList />; // Sẽ thêm component này sau
                return <div>Vehicle Models Management - Coming Soon...</div>;
            case 'variants':
                // return <VehicleVariantList />;
                return <div>Vehicle Variants Management - Coming Soon...</div>;
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
        </>
    )
}
