import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, GitCompare } from 'lucide-react';
import FilterPanel from "../components/ev-catalog/FilterPanel";
import VehicleCard from "../components/ev-catalog/VehicleCard";
import QuickViewModal from "../components/ev-catalog/QuickViewModal";
import CompareModal from "../components/ev-catalog/CompareModal";
import { sampleVehicles, filterVehicles } from '../services/evService';

const CatalogPage = ({ onVehicleSelect }) => {
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [favorites, setFavorites] = useState(new Set());
    const [compareList, setCompareList] = useState([]);
    const [showCompare, setShowCompare] = useState(false);
    const [showQuickView, setShowQuickView] = useState(false);
    const [quickViewVehicle, setQuickViewVehicle] = useState(null);

    // Filter states
    const [filters, setFilters] = useState({
        priceRange: [0, 4000000000],
        range: [0, 600],
        brand: '',
        bodyType: '',
        batteryType: '',
        chargingTime: '',
        seatingCapacity: '',
        availability: 'all'
    });

    useEffect(() => {
        setVehicles(sampleVehicles);
        setFilteredVehicles(sampleVehicles);
    }, [])

    useEffect(() => {
        const filtered = filterVehicles(vehicles, searchTerm, filters);
        setFilteredVehicles(filtered);
    }, [searchTerm, filters, vehicles]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const resetFilters = () => {
        setFilters({
            priceRange: [0, 4000000000],
            range: [0, 600],
            brand: '',
            bodyType: '',
            batteryType: '',
            chargingTime: '',
            seatingCapacity: '',
            availability: 'all'
        });
        setSearchTerm('');
    };

    const toggleFavorite = (vehicleId) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(vehicleId)) {
                newFavorites.delete(vehicleId);
            } else {
                newFavorites.add(vehicleId);
            }
            return newFavorites;
        });
    };

    const toggleCompare = (vehicleId) => {
        setCompareList(prev => {
            if (prev.includes(vehicleId)) {
                return prev.filter(id => id !== vehicleId);
            } else if (prev.length < 3) {
                return [...prev, vehicleId];
            } else {
                alert('Chỉ có thể so sánh tối đa 3 xe');
                return prev;
            }
        });
    };

    const openQuickView = (vehicle) => {
        setQuickViewVehicle(vehicle);
        setShowQuickView(true);
    };

    const openDetailPage = (vehicle) => {
        onVehicleSelect(vehicle);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Hero Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white">
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold mb-4">
                            Tương lai xe điện
                            <span className="block text-3xl font-normal mt-2 text-blue-200">
                                Khám phá bộ sưu tập xe điện hàng đầu Việt Nam
                            </span>
                        </h1>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                            Trải nghiệm công nghệ tiên tiến, thiết kế đẳng cấp và hiệu suất vượt trội
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm xe điện của bạn..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-2xl focus:ring-4 focus:ring-white/30 focus:bg-white transition-all placeholder-gray-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center bg-white rounded-xl overflow-hidden shadow-md border border-gray-200">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-3 ${
                                viewMode === 'grid' 
                                ? 'bg-blue-600 text-white' 
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <Grid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-3 ${
                                viewMode === 'list' 
                                ? 'bg-blue-600 text-white' 
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <List className="w-5 h-5"/>
                        </button>
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 shadow-md transition-all"
                    >
                        <Filter className="w-5 h-5" />
                        Bộ lọc
                        {Object.values(filters).some(v => v !== '' && !Array.isArray(v)) && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                    </button>
                </div>

            <div className="text-gray-600 font-medium">
                Hiển thị 
                <span className="text-blue-600 font-bold">
                    {filteredVehicles.length}
                </span> trong số {vehicles.length} xe
            </div>
        </div>

        <div className="flex gap-8">
            {/* Filters Sidebar */}
            {showFilters && (
                <div className="w-80 flex-shrink-0">
                    <FilterPanel 
                        filters={filters} 
                        handleFilterChange={handleFilterChange} 
                        resetFilters={resetFilters} 
                    />
                </div>
            )}

            {/* Vehicle Grid */}
            <div className="flex-1">
                {filteredVehicles.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredVehicles.map(vehicle => (
                            <VehicleCard 
                                key={vehicle.id} 
                                vehicle={vehicle}
                                favorites={favorites}
                                compareList={compareList}
                                toggleFavorite={toggleFavorite}
                                toggleCompare={toggleCompare}
                                openQuickView={openQuickView}
                                openDetailPage={openDetailPage}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-gray-300 text-8xl mb-6">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy xe phù hợp</h3>
                        <p className="text-gray-600 mb-8 text-lg">Hãy thử điều chỉnh bộ lọc để tìm chiếc xe mơ ước của bạn</p>
                        <button
                            onClick={resetFilters}
                            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                            >
                                Đặt lại bộ lọc
                        </button>
                    </div>
                )}
          </div>
        </div>
      </div>   

        
}; 