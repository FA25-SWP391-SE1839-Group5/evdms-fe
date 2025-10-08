import React, { useReducer, useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import CatalogPage from './pages/CatalogPage';
import EVDetailPage from './pages/EVDetailPage';
import VehicleModelPage from './pages/VehicleModelPage';
import VehicleVariantPage from './pages/VehicleVariantPage';
import { routeReducer, initialState, ROUTES } from './routes';
import { logout, getStoredToken } from './services/authService';

const App = () => {
  const [routeState, dispatch] = useReducer(routeReducer, initialState);
  const [favorites, setFavorites] = useState(new Set());
  const [compareList, setCompareList] = useState([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // ✅ Bỏ qua kiểm tra token, vào thẳng VehicleVariantPage
  useEffect(() => {
    const fakeUser = {
      id: 1,
      name: 'Test User',
      role: 'Admin'
    };

    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: fakeUser
    });

    dispatch({
      type: 'NAVIGATE_TO_VEHICLE_VARIANTS' // ✅ chuyển thẳng vào trang Variant
    });

    setIsCheckingAuth(false);
  }, []);

  // ============================================
  // AUTHENTICATION HANDLERS
  // ============================================
  const handleLoginSuccess = (userData) => {
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: userData
    });
  };

  const handleLogout = async () => {
    await logout();
    dispatch({ type: 'LOGOUT' });
    setFavorites(new Set());
    setCompareList([]);
  };

  // ============================================
  // NAVIGATION HANDLERS
  // ============================================
  const navigateToDetail = (vehicle) => {
    dispatch({
      type: 'NAVIGATE_TO_DETAIL',
      payload: vehicle
    });
  };

  const navigateToCatalog = () => {
    dispatch({
      type: 'NAVIGATE_TO_CATALOG'
    });
  };

  const navigateToVehicleModels = () => {
    dispatch({
      type: 'NAVIGATE_TO_VEHICLE_MODELS'
    });
  };

  const navigateToVehicleVariants = () => {
    dispatch({
      type: 'NAVIGATE_TO_VEHICLE_VARIANTS'
    });
  };

  // ============================================
  // FAVORITES & COMPARE HANDLERS
  // ============================================
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
        alert('Only compare to 3 cars');
        return prev;
      }
    });
  };

  // ============================================
  // RENDER PAGES
  // ============================================
  return (
    <div className="font-sans">
      {/* LOGIN PAGE */}
      {routeState.currentPage === ROUTES.LOGIN && (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}

      {/* VEHICLE MODELS PAGE */}
      {routeState.currentPage === ROUTES.VEHICLE_MODELS && (
        <VehicleModelPage
          user={routeState.user}
          onLogout={handleLogout}
          onNavigateToVariants={navigateToVehicleVariants}
        />
      )}
      
      {/* VEHICLE VARIANTS PAGE */}
      {routeState.currentPage === ROUTES.VEHICLE_VARIANTS && (
        <VehicleVariantPage
          user={routeState.user}
          onLogout={handleLogout}
          onNavigateToModels={navigateToVehicleModels}
        />
      )}
      
      {/* CATALOG PAGE */}
      {routeState.currentPage === ROUTES.CATALOG && (
        <CatalogPage
          onVehicleSelect={navigateToDetail}
          user={routeState.user}
          onLogout={handleLogout}
        />
      )}
      
      {/* DETAIL PAGE */}
      {routeState.currentPage === ROUTES.DETAIL && (
        <EVDetailPage
          vehicle={routeState.selectedVehicle}
          onBack={navigateToCatalog}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          compareList={compareList}
          toggleCompare={toggleCompare}
          user={routeState.user}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;