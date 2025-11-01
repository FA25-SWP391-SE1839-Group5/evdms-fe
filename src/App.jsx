import React, { useReducer, useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import EVMDashboard from './pages/EVMDashboard';
import DealerManagerDashboard from './pages/DealerManagerDashboard';
import DealerStaffDashboard from './pages/DealerStaffDashboard';
import Layout from './components/admin-dashboard/layout/Layout';
import EVMLayout from './components/evm-dashboard/layout/EVMLayout';
import DealerLayout from './components/dealer-mananger-dashboard/layout/DealerLayout';
import { routeReducer, initialState, ROUTES } from './routes';
import { logout, getStoredToken } from './services/authService';

const App = () => {
  const [routeState, dispatch] = useReducer(routeReducer, initialState);
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
    const checkAuthAndRoute = () => {
      console.log("--- Running Initial Auth Check ---");
      try {
        const stored = getStoredToken();

        // ƯU TIÊN 1: Có token hợp lệ?
        if (stored?.user?.role) {
          console.log("Token found. Dispatching LOGIN_SUCCESS:", stored.user);
          dispatch({ type: "LOGIN_SUCCESS", payload: stored.user });
          // Không set isCheckingAuth = false ở đây vội
          return; // Kết thúc sớm nếu đã đăng nhập
        }

        // ƯU TIÊN 2: Không có token, kiểm tra URL đặc biệt
        console.log("No token found. Checking URL:", window.location.pathname, window.location.search);
        const urlParams = new URLSearchParams(window.location.search);
        const resetToken = urlParams.get("token");
        const path = window.location.pathname.replace("/", "");

        if (resetToken /* && path === 'reset-password' */) {
          // Có thể thêm check path nếu muốn
          console.log("Reset token detected.");
          dispatch({ type: "NAVIGATE_TO_RESET_PASSWORD" });
        } else if (path === "login") {
          console.log("No token, on /login path.");
          dispatch({ type: "NAVIGATE_TO_LOGIN" });
        } else if (path === "catalog") {
          console.log("No token, on /catalog path.");
          dispatch({ type: "NAVIGATE_TO_CATALOG" });
        } else if (path === "" || path === "home") {
          console.log("No token, on root or /home path.");
          dispatch({ type: "NAVIGATE_TO_HOME" });
        } else {
          // Các URL khác mà không có token -> Chuyển về Home (hoặc Login tùy ý)
          console.log(`No token, on protected path /${path}. Redirecting to HOME.`);
          dispatch({ type: "NAVIGATE_TO_HOME" });
        }
      } catch (error) {
        console.error("Initial Auth check failed:", error);
        dispatch({ type: "NAVIGATE_TO_HOME" }); // Lỗi thì về home
      } finally {
        // Luôn tắt loading sau khi kiểm tra xong
        // Dùng setTimeout để đảm bảo dispatch kịp xử lý trước khi tắt loading
        setTimeout(() => {
          console.log("--- Finished Initial Auth Check ---");
          setIsCheckingAuth(false);
        }, 0);
      }
    };

    checkAuthAndRoute();
  }, []); // Hook này chỉ chạy 1 lần khi mount

  const getInitialAdminPage = () => {
    const path = globalThis.location.pathname.replace("/", "");
    if (!path || path === "admin-dashboard") return "dashboard";
    return path;
  };

  const getInitialEVMPage = () => {
    const path = globalThis.location.pathname.replace('/', '');
    // Valid EVM pages
    const validPages = [
      'evm-dashboard',
      'vehicle-models',
      'vehicle-variants',
      'dealers',
      'dealer-contracts',
      'oem-inventories',
      'variant-order-rates',
      'dealer-total-sales',
      'region-total-sales'
    ];
    if (validPages.includes(path)) {
      return path;
    }
    // Default to evm-dashboard for invalid/empty paths
    return 'evm-dashboard';
  };

  const getInitialDealerPage = () => {
    const path = globalThis.location.pathname.replace("/", "");
    // Các trang hợp lệ này được định nghĩa trong DealerLayout và DealerSidebar
    const validPages = ["dealer-dashboard", "dealer-staff", "dealer-performance", "dealer-orders"];
    if (validPages.includes(path)) {
      return path;
    }
    return "dealer-dashboard"; // Trang mặc định
  };

  // Sync URL when route changes
  useEffect(() => {
    // Don't sync URL for login page
    if (routeState.currentPage === ROUTES.LOGIN) {
      return;
    }
    
    const path = `/${routeState.currentPage}`;
    if (globalThis.location.pathname !== path) {
      console.log('Sync URL - Pushing state to:', path);
      globalThis.history.pushState({}, '', path);
    }
  }, [routeState.currentPage]);

  // Sync logout across tabs
  // useEffect(() => {
  //   const handleStorageChange = (e) => {
  //     if (e.key === 'evdms_auth_token' && !e.newValue) {
  //       // Token was cleared in another tab
  //       dispatch({ type: 'LOGOUT' });
  //       setFavorites(new Set());
  //       setCompareList([]);
  //     }
  //   };

  //   globalThis.addEventListener('storage', handleStorageChange);
  //   return () => globalThis.removeEventListener('storage', handleStorageChange);
  // }, []);

  // // Sync URL with routing state
  // useEffect(() => {
  //   // Sub-pages that don't need URL syncing (managed by layout components)
  //   const evmSubPages = ['vehicle-models', 'dealers', 'dealer-contracts', 'oem-inventories', 'vehicle-variants', 'specifications'];
  //   const adminSubPages = ['users', 'dealers', 'customers', 'dashboard'];
  //   const currentPath = globalThis.location.pathname.replace('/', '');

  //   // Don't sync if we're on a sub-page
  //   if (evmSubPages.includes(currentPath) || adminSubPages.includes(currentPath)) {
  //     console.log('Sync URL - Skipping sync for sub-page:', currentPath);
  //     return;
  //   }

  //   const path = `/${routeState.currentPage}`;
  //   console.log('Sync URL - currentPage:', routeState.currentPage);
  //   console.log('Sync URL - target path:', path);
  //   console.log('Sync URL - current location:', globalThis.location.pathname);

  //   if (globalThis.location.pathname !== path) {
  //     console.log('Sync URL - Pushing state to:', path);
  //     globalThis.history.pushState({}, '', path);
  //   }
  // }, [routeState.currentPage]);

  // // Handle browser back/forward buttons
  // useEffect(() => {
  //   const handlePopState = () => {
  //     const path = globalThis.location.pathname.replace('/', '');

  //     if (path === 'home' || path === '') {
  //       dispatch({ type: 'NAVIGATE_TO_HOME' });
  //     } else if (path === 'login') {
  //       dispatch({ type: 'NAVIGATE_TO_LOGIN' });
  //     } else if (path === 'catalog') {
  //       dispatch({ type: 'NAVIGATE_TO_CATALOG' });
  //     } else if (path === 'admin-dashboard' || path === 'dashboard') {
  //       dispatch({ type: 'NAVIGATE_TO_ADMIN_DASHBOARD' });
  //     } else if (path === 'evm-dashboard') {
  //       dispatch({ type: 'NAVIGATE_TO_EVM_DASHBOARD' });
  //     }
  //   };

  //   globalThis.addEventListener('popstate', handlePopState);
  //   return () => globalThis.removeEventListener('popstate', handlePopState);
  // }, []);

  // ============================================
  // AUTHENTICATION HANDLERS
  // ============================================
  const handleLoginSuccess = (userData) => {
    console.log("handleLoginSuccess called with:", userData);
    // Đảm bảo userData có role
    if (userData && userData.role) {
      dispatch({ type: "LOGIN_SUCCESS", payload: userData });
      // Redirect to root after login success
      window.location.href = "/";
    } else {
      console.error("handleLoginSuccess: Invalid userData received", userData);
      // Có thể dispatch về login hoặc hiển thị lỗi
      dispatch({ type: "NAVIGATE_TO_LOGIN" });
    }
  };

  const handleLogout = async () => {
    await logout();
    dispatch({ type: "LOGOUT" });
  };

  // ============================================
  // NAVIGATION HANDLERS
  // ============================================
  const navigateToLogin = () => {
    dispatch({
      type: "NAVIGATE_TO_LOGIN",
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
      {routeState.currentPage === ROUTES.LOGIN && <LoginPage onLoginSuccess={handleLoginSuccess} />}

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

      {/* DEALER MANAGER DASHBOARD */}
      {routeState.currentPage === ROUTES.DEALER_MANAGER_DASHBOARD && (
        <DealerLayout initialPage={getInitialDealerPage()}>
          {/* DealerManagerDashboard là component children */}
          <DealerManagerDashboard />
        </DealerLayout>
      )}

      {/* DEALER STAFF DASHBOARD */}
      {routeState.currentPage === ROUTES.DEALER_STAFF_DASHBOARD && (
        <DealerLayout initialPage="staff-dashboard">
          <DealerStaffDashboard />
        </DealerLayout>
      )}

      {/* RESET PASSWORD PAGE */}
      {routeState.currentPage === ROUTES.RESET_PASSWORD && <ResetPasswordPage />}
    </div>
  );
};

export default App;
