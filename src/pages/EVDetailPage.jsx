// pages/EVDetailPage.jsx
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

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-4 gap-4">
              {vehicle.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                    idx === currentImageIndex ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`${vehicle.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Video Section */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Video giới thiệu</h3>
              <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
                <button className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                  <Play className="w-5 h-5" />
                  Xem video
                </button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Rating & Availability */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-lg">{vehicle.rating}</span>
                  <span className="text-gray-500">({vehicle.reviews} đánh giá)</span>
                </div>
              </div>
              {renderAvailabilityBadge(vehicle.availability)}
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-600 leading-relaxed text-lg">
                {vehicle.description}
              </p>
            </div>

            {/* Key Specs Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Battery className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-900 font-semibold">Phạm vi</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">{currentVariant.range} km</div>
              </div>
                              <div className="bg-green-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-green-600" />
                  <span className="text-green-900 font-semibold">Sạc nhanh</span>
                </div>
                <div className="text-2xl font-bold text-green-900">{vehicle.chargingTime}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Gauge className="w-5 h-5 text-purple-600" />
                  <span className="text-purple-900 font-semibold">Gia tốc</span>
                </div>
                <div className="text-2xl font-bold text-purple-900">{currentVariant.acceleration}</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <span className="text-orange-900 font-semibold">Tốc độ tối đa</span>
                </div>
                <div className="text-2xl font-bold text-orange-900">{currentVariant.topSpeed} km/h</div>
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Chọn màu sắc
              </h3>
              <div className="space-y-3">
                {vehicle.colors.map((color) => (
                  <label
                    key={color.name}
                    className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedColor === color.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="color"
                        value={color.name}
                        checked={selectedColor === color.name}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="sr-only"
                      />
                      <div
                        className="w-8 h-8 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: color.code }}
                      />
                      <span className="font-medium text-gray-900">{color.name}</span>
                    </div>
                    <span className="text-gray-600">
                      {color.price > 0 ? `+${formatPrice(color.price)}` : 'Miễn phí'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Variant Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Car className="w-5 h-5" />
                Chọn phiên bản
              </h3>
              <div className="space-y-3">
                {vehicle.variants.map((variant) => (
                  <label
                    key={variant.name}
                    className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedVariant === variant.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="variant"
                      value={variant.name}
                      checked={selectedVariant === variant.name}
                      onChange={(e) => setSelectedVariant(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">{variant.name}</span>
                      <span className="text-2xl font-bold text-gray-900">{formatPrice(variant.price)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>Phạm vi: {variant.range}km</div>
                      <div>Gia tốc: {variant.acceleration}</div>
                      <div>Tốc độ: {variant.topSpeed}km/h</div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {variant.features.map((feature, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-gray-50 p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tổng kết giá</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phiên bản {currentVariant.name}</span>
                  <span className="font-medium">{formatPrice(currentVariant.price)}</span>
                </div>
                {currentColor && currentColor.price > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Màu {currentColor.name}</span>
                    <span className="font-medium">+{formatPrice(currentColor.price)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Tổng cộng</span>
                    <span className="text-3xl font-bold text-blue-600">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105">
                <ShoppingCart className="w-5 h-5 inline mr-2" />
                {vehicle.availability === 'in-stock' ? 'Mua ngay' : 'Đặt trước'}
              </button>
              <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-lg">
                <Calendar className="w-5 h-5 inline mr-2" />
                Đặt lịch lái thử
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Specifications */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Thông số kỹ thuật
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Dung lượng pin</span>
                <span className="font-semibold">{vehicle.batteryCapacity}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Công suất</span>
                <span className="font-semibold">{vehicle.power}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Trọng lượng</span>
                <span className="font-semibold">{vehicle.weight}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Kích thước</span>
                <span className="font-semibold">{vehicle.dimensions}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Số chỗ ngồi</span>
                <span className="font-semibold">{vehicle.seatingCapacity} chỗ</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Bảo hành</span>
                <span className="font-semibold">{vehicle.warranty}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Award className="w-6 h-6" />
              An toàn & Tiện nghi
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Tính năng an toàn</h3>
                <div className="flex flex-wrap gap-2">
                  {vehicle.safety.map((feature, idx) => (
                    <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Cổng sạc hỗ trợ</h3>
                <div className="flex flex-wrap gap-2">
                  {vehicle.chargingPorts.map((port, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {port}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Tính năng nổi bật</h3>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((feature, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dealer Information */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Đại lý gần bạn</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {vehicle.dealers.map((dealer, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{dealer.name}</h3>
                <div className="space-y-2 text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{dealer.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{dealer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    <span>Cách {dealer.distance}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Gọi ngay
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EVDetailPage;