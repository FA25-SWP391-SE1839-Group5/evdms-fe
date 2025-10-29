import { useEffect, useReducer, useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/admin-dashboard/layout/Layout";
import AdminDashboard from "./pages/AdminDashboard";
import CatalogPage from "./pages/CatalogPage";
import DealerManagerDashboard from "./pages/DealerManagerDashboard";
import DealerStaffDashboard from "./pages/DealerStaffDashboard";
import EVDetailPage from "./pages/EVDetailPage";
import EvmStaffDashboard from "./pages/EvmStaffDashboard";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VehicleModelPage from "./pages/VehicleModelPage";
import { initialState, routeReducer } from "./routes";
import { getStoredToken, logout } from "./services/authService";

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

    scripts.forEach((src) => {
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
        const urlParams = new URLSearchParams(window.location.search);
        const resetToken = urlParams.get("token");

        if (resetToken) {
          // User is trying to reset password
          dispatch({ type: "NAVIGATE_TO_RESET_PASSWORD" });
          setIsCheckingAuth(false);
          return;
        }

        // Otherwise, check authentication
        const stored = getStoredToken();
        if (stored && stored.user && stored.user.role) {
          // User is logged in, restore session
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: stored.user,
          });
        } else {
          // Invalid token or insufficient data
          dispatch({ type: "LOGOUT" });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        dispatch({ type: "LOGOUT" });
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthOrReset();
  }, []);

  useEffect(() => {
    const path = window.location.pathname.replace("/", "");

    if (!path) return;

    switch (path) {
      case "users":
        dispatch({ type: "NAVIGATE", payload: "users" });
        break;
      case "dealers":
        dispatch({ type: "NAVIGATE", payload: "dealers" });
        break;
      case "customers":
        dispatch({ type: "NAVIGATE", payload: "customers" });
        break;
      default:
        dispatch({ type: "NAVIGATE", payload: "dashboard" });
        break;
    }
  }, []);

  // Sync logout across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "evdms_auth_token" && !e.newValue) {
        // Token was cleared in another tab
        dispatch({ type: "LOGOUT" });
        setFavorites(new Set());
        setCompareList([]);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ============================================
  // AUTHENTICATION HANDLERS
  // ============================================
  const handleLoginSuccess = (userData) => {
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: userData,
    });
    // Redirect based on role
    if (userData.role && userData.role.toLowerCase() === "admin") {
      window.location.href = "/admin/users";
    }
    // You can add more role-based redirects here if needed
  };

  const handleLogout = async () => {
    await logout();
    dispatch({ type: "LOGOUT" });
    setFavorites(new Set());
    setCompareList([]);
  };

  // ============================================
  // NAVIGATION HANDLERS
  // ============================================
  const navigateToDetail = (vehicle) => {
    dispatch({
      type: "NAVIGATE_TO_DETAIL",
      payload: vehicle,
    });
  };

  const navigateToCatalog = () => {
    dispatch({
      type: "NAVIGATE_TO_CATALOG",
    });
  };

  // ============================================
  // FAVORITES & COMPARE HANDLERS
  // ============================================
  const toggleFavorite = (vehicleId) => {
    setFavorites((prev) => {
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
    setCompareList((prev) => {
      if (prev.includes(vehicleId)) {
        return prev.filter((id) => id !== vehicleId);
      } else if (prev.length < 3) {
        return [...prev, vehicleId];
      } else {
        alert("Only compare to 3 cars");
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
  // RENDER PAGES WITH ROUTER
  // ============================================
  return (
    <Router>
      <div className="font-sans">
        <Routes>
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
          {/* Admin dashboard routes */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <Layout initialPage="users">
                  <AdminDashboard currentPage="users" />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/audit"
            element={
              <ProtectedRoute>
                <Layout initialPage="audit">
                  <AdminDashboard currentPage="audit" />
                </Layout>
              </ProtectedRoute>
            }
          />
          {/* EVM Staff dashboard routes */}
          <Route path="/evmstaff/dashboard" element={<EvmStaffDashboard />} />
          {/* Dealer Manager dashboard routes */}
          <Route path="/dealermanager/dashboard" element={<DealerManagerDashboard />} />
          {/* Dealer Staff dashboard routes */}
          <Route path="/dealerstaff/dashboard" element={<DealerStaffDashboard />} />
          <Route path="/vehicle-models" element={<VehicleModelPage user={routeState.user} onLogout={handleLogout} />} />
          <Route path="/reset_password" element={<ResetPasswordPage />} />
          <Route path="/catalog" element={<CatalogPage onVehicleSelect={navigateToDetail} user={routeState.user} onLogout={handleLogout} />} />
          <Route
            path="/detail"
            element={
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
            }
          />
          {/* Default redirect: if authenticated, go to /admin/users; else, go to /login */}
          <Route path="*" element={getStoredToken() && getStoredToken().user && getStoredToken().user.role ? <Navigate to="/admin/users" replace /> : <Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
