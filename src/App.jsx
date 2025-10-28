import React, { useReducer, useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CatalogPage from './pages/CatalogPage';
import EVDetailPage from './pages/EVDetailPage';
import VehicleModelPage from './pages/VehicleModelPage';
import AdminDashboard from './pages/AdminDashboard';
import EVMDashboard from './pages/EVMDashboard';
import Layout from './components/admin-dashboard/layout/Layout';
import EVMLayout from './components/evm-dashboard/layout/EVMLayout';
import { routeReducer, initialState, ROUTES } from './routes';
import { logout, getStoredToken } from './services/authService';

const App = () => {
  const [routeState, dispatch] = useReducer(routeReducer, initialState);
  const [favorites, setFavorites] = useState(new Set());
  const [compareList, setCompareList] = useState([]);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const scripts = [
      "/assets/vendor/js/helpers.js",
      "/assets/js/config.js",
      "/assets/vendor/libs/jquery/jquery.js",
      "/assets/vendor/js/bootstrap.js",
      "/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js",
      "/assets/vendor/js/menu.js",
      "/assets/vendor/libs/apex-charts/apexcharts.js",
      "/assets/js/main.js",
      "/assets/js/dashboards-analytics.js",
    ];

    scripts.forEach(src => {
      const script = document.createElement("script");
      script.src = src;
      script.async = false; // đảm bảo load theo thứ tự
      document.body.appendChild(script);
    });
  }, []);

  useEffect(() => {
    const checkAuthOrReset = () => {
      try {
        // Check if URL has reset token parameter
        const urlParams = new URLSearchParams(globalThis.location.search);
        const resetToken = urlParams.get('token');
        
        if (resetToken) {
          // User is trying to reset password
          dispatch({ type: 'NAVIGATE_TO_RESET_PASSWORD' });
          setIsCheckingAuth(false);
          return;
        }

        // Check URL path first
        const path = globalThis.location.pathname.replace('/', '');
        
        // If user is on /home or root path, show home page (no auth required)
        if (path === 'home' || path === '') {
          dispatch({ type: 'NAVIGATE_TO_HOME' });
          setIsCheckingAuth(false);
          return;
        }

        // If user is on /login, show login page
        if (path === 'login') {
          dispatch({ type: 'NAVIGATE_TO_LOGIN' });
          setIsCheckingAuth(false);
          return;
        }

        // For other paths, check authentication
        const stored = getStoredToken();
        if (stored?.user?.role) {
          // User is logged in, restore session
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: stored.user
          });
          
          // If on catalog page, navigate there
          if (path === 'catalog') {
            dispatch({ type: 'NAVIGATE_TO_CATALOG' });
          }
        } else {
          // Invalid token or insufficient data - redirect to home
          dispatch({ type: 'NAVIGATE_TO_HOME' });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        dispatch({ type: 'NAVIGATE_TO_HOME' });
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthOrReset();
  }, []);

  useEffect(() => {
    const path = globalThis.location.pathname.replace('/', '');

    // Handle URL-based routing
    if (path === 'home') {
      dispatch({ type: 'NAVIGATE_TO_HOME' });
      return;
    }
    
    if (path === 'login') {
      dispatch({ type: 'NAVIGATE_TO_LOGIN' });
      return;
    }

    if (path === 'catalog') {
      dispatch({ type: 'NAVIGATE_TO_CATALOG' });
      return;
    }

    // Admin dashboard sub-pages
    if (['users', 'dealers', 'customers', 'dashboard'].includes(path)) {
      // These are handled by the admin dashboard layout
      return;
    }
  }, []);

  const getInitialAdminPage = () => {
    const path = globalThis.location.pathname.replace('/', '');
    if (!path || path === 'admin_dashboard') return 'dashboard';
    return path;
  };

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

    globalThis.addEventListener('storage', handleStorageChange);
    return () => globalThis.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sync URL with routing state
  useEffect(() => {
    const path = `/${routeState.currentPage}`;
    if (globalThis.location.pathname !== path) {
      globalThis.history.pushState({}, '', path);
    }
  }, [routeState.currentPage]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = globalThis.location.pathname.replace('/', '');
      
      if (path === 'home' || path === '') {
        dispatch({ type: 'NAVIGATE_TO_HOME' });
      } else if (path === 'login') {
        dispatch({ type: 'NAVIGATE_TO_LOGIN' });
      } else if (path === 'catalog') {
        dispatch({ type: 'NAVIGATE_TO_CATALOG' });
      } else if (path === 'admin_dashboard' || path === 'dashboard') {
        dispatch({ type: 'NAVIGATE_TO_ADMIN_DASHBOARD' });
      }
    };

    globalThis.addEventListener('popstate', handlePopState);
    return () => globalThis.removeEventListener('popstate', handlePopState);
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
  const navigateToHome = () => {
    dispatch({
      type: 'NAVIGATE_TO_HOME'
    });
  };

  const navigateToLogin = () => {
    dispatch({
      type: 'NAVIGATE_TO_LOGIN'
    });
  };

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
      {/* HOME PAGE */}
      {routeState.currentPage === ROUTES.HOME && (
        <HomePage 
          onNavigateToCatalog={navigateToCatalog}
          onNavigateToLogin={navigateToLogin}
        />
      )}

      {/* LOGIN PAGE */}
      {routeState.currentPage === ROUTES.LOGIN && (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}

      {/* ADMIN DASHBOARD */}
      {routeState.currentPage === ROUTES.ADMIN_DASHBOARD && (
        <Layout initialPage={getInitialAdminPage()}>
          <AdminDashboard />
        </Layout>
      )}

      {/* EVM DASHBOARD */}
      {routeState.currentPage === ROUTES.EVM_DASHBOARD && (
        <EVMLayout initialPage={getInitialEVMPage()}>
          <EVMDashboard />
        </EVMLayout>
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
          onBackToHome={navigateToHome}
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
          onBackToHome={navigateToHome}
        />
      )}
    </div>
  );
};

export default App;