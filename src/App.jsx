import React, { useReducer, useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import CatalogPage from './pages/CatalogPage';
import EVDetailPage from './pages/EVDetailPage';
import VehicleModelPage from './pages/VehicleModelPage';
import AdminDashboard from './pages/AdminDashboard';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { routeReducer, initialState, ROUTES } from './routes';
import { logout, getStoredToken } from './services/authService';

const App = () => {
  const [routeState, dispatch] = useReducer(routeReducer, initialState);
  const [favorites, setFavorites] = useState(new Set());
  const [compareList, setCompareList] = useState([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthOrReset = () => {
      try {
        // Check if URL has reset token parameter
        const urlParams = new URLSearchParams(window.location.search);
        const resetToken = urlParams.get('token');
        
        if (resetToken) {
          // User is trying to reset password
          dispatch({ type: 'NAVIGATE_TO_RESET_PASSWORD' });
          setIsCheckingAuth(false);
          return;
        }

        // Otherwise, check authentication
        const stored = getStoredToken();
        if (stored && stored.user && stored.user.role) {
          // User is logged in, restore session
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: stored.user
          });
        } else {
          // Invalid token or insufficient data
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        dispatch({ type: 'LOGOUT' });
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthOrReset();
  }, []);

  // Sync logout across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'evdms_auth_token' && !e.newValue) {
        // Token was cleared in another tab
        dispatch({ type: 'LOGOUT' });
        setFavorites(new Set());
        setCompareList([]);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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

  // Show loading screen while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER PAGES
  // ============================================
  return (
    <div className="font-sans">
      {/* LOGIN PAGE */}
      {routeState.currentPage === ROUTES.LOGIN && (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}

      {/* ADMIN DASHBOARD */}
      {routeState.currentPage === ROUTES.ADMIN_DASHBOARD && (
        <AdminDashboard
          user={routeState.user}
          onLogout={handleLogout}
        />
      )}

      {/* VEHICLE MODELS PAGE */}
      {routeState.currentPage === ROUTES.VEHICLE_MODELS && (
        <VehicleModelPage
          user={routeState.user}
          onLogout={handleLogout}
        />
      )}

      {/* RESET PASSWORD PAGE */}
      {routeState.currentPage === ROUTES.RESET_PASSWORD && (
        <ResetPasswordPage />
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