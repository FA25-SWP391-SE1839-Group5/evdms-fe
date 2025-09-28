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

}; 