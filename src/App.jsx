import React, { useReducer, useState } from 'react';
import LoginPage from './pages/LoginPage';
import CatalogPage from './pages/CatalogPage';
import EVDetailPage from './pages/EVDetailPage';
import { routeReducer, initialState, ROUTES } from './routes';
import { logout } from './services/authService';

const App = () => {
  const [routeState, dispatch] = useReducer(routeReducer, initialState);
  const [favorites, setFavorites] = useState(new Set());
  const [compareList, setCompareList] = useState([]);

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
        alert('Chỉ có thể so sánh tối đa 3 xe');
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