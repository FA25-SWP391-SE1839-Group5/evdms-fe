import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  GitCompare, 
  Star, 
  Battery, 
  Zap, 
  Gauge, 
  TrendingUp,
  Palette,
  Car,
  ShoppingCart,
  Calendar,
  Play,
  Shield,
  Award,
  MapPin,
  Phone,
  MessageCircle
} from 'lucide-react';
import { formatPrice, getAvailabilityBadge } from '../services/evService';

const EVDetailPage = ({ vehicle, onBack, favorites, toggleFavorite, compareList, toggleCompare }) => {
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedVariant, setSelectedVariant] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (vehicle) {
            setSelectedColor(vehicle.colors[0]?.name || '');
            setSelectedVariant(vehicle.variants[0]?.name || '');
            setCurrentImageIndex(0);
        }
    }, [vehicle]);

    if (!vehicle) return null;

    const currentVariant = vehicle.variants.find(v => v.name === selectedVariant) || vehicle.variants[0];
    const currentColor = vehicle.colors.find(c => c.name === selectedColor) || vehicle.colors[0];
    const totalPrice = currentVariant.price + (currentColor?.price || 0);
    const { badges, labels } = getAvailabilityBadge(vehicle.availability);

    const renderAvailabilityBadge = (availability) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${badges[availability]}`}>
            {labels[availability]}
        </span>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Quay lại danh mục
                        </button>
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-gray-900">{vehicle.name}</h1>
                            <p className="text-gray-600">{vehicle.brand} • {vehicle.model}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => toggleFavorite(vehicle.id)}
                                className={`p-2 rounded-full transition-colors ${
                                favorites.has(vehicle.id)
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:text-red-500'
                                }`}
                            >
                                <Heart className="w-5 h-5" fill={favorites.has(vehicle.id) ? 'currentColor' : 'none'} />
                            </button>
                            <button
                                onClick={() => toggleCompare(vehicle.id)}
                                className={`p-2 rounded-full transition-colors ${
                                compareList.includes(vehicle.id)
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:text-blue-500'
                                }`}
                            >
                                <GitCompare className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
                <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
                    <img
                        src={vehicle.images[currentImageIndex]}
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                    />
                    <button
                        onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                        disabled={currentImageIndex === 0}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setCurrentImageIndex(Math.min(vehicle.images.length - 1, currentImageIndex + 1))}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                        disabled={currentImageIndex === vehicle.images.length - 1}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {vehicle.images.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${
                                idx === currentImageIndex ? 'bg-white w-8' : 'bg-white/60'
                            }`}
                        />
                    ))}
                </div>
            </div>
                    
    );
};