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

        </div>
}; 