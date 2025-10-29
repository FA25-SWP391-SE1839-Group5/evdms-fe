export const ROUTES = {
<<<<<<< Updated upstream
  LOGIN: "login",
  CATALOG: "catalog",
  DETAIL: "detail",
  ADMIN_DASHBOARD: "admin_dashboard",
  EVM_STAFF_DASHBOARD: "evm_staff_dashboard",
  DEALER_MANAGER_DASHBOARD: "dealer_manager_dashboard",
  DEALER_STAFF_DASHBOARD: "dealer_staff_dashboard",
  VEHICLE_MODELS: "vehicle_models",
  RESET_PASSWORD: "reset_password",
=======
    HOME: 'home',
    LOGIN: 'login',
    CATALOG: 'catalog',
    DETAIL: 'detail',
    ADMIN_DASHBOARD: 'admin-dashboard',
    EVM_DASHBOARD: 'evm-dashboard',
    VEHICLE_MODELS: 'vehicle-models',
    RESET_PASSWORD: 'reset-password',
>>>>>>> Stashed changes
};

// Admin Dashboard sub-pages
const ADMIN_PAGES = {
  DASHBOARD: "dashboard",
  USERS: "users",
  DEALERS: "dealers",
  CUSTOMERS: "customers",
  INVENTORY: "inventory",
  QUOTATIONS: "quotations",
  ORDERS: "orders",
  TESTDRIVES: "testdrives",
  PAYMENTS: "payments",
  PROMOTIONS: "promotions",
  AUDIT: "audit",
  FEEDBACK: "feedback",
};

export const initialState = {
<<<<<<< Updated upstream
  currentPage: ROUTES.LOGIN,
  selectedVehicle: null,
  user: null,
  isAuthenticated: false,
};

export const routeReducer = (state, action) => {
  switch (action.type) {
    case "NAVIGATE_TO_LOGIN":
      return {
        ...state,
        currentPage: ROUTES.LOGIN,
        user: null,
        isAuthenticated: false,
      };
    case "LOGIN_SUCCESS": {
      // Route based on role
      const user = action.payload;
      if (!user || !user.role) {
        return {
          ...state,
          currentPage: ROUTES.LOGIN,
          user: null,
          isAuthenticated: false,
        };
      }
      let targetPage = ROUTES.CATALOG;
      switch (user.role?.toLowerCase()) {
        case "admin":
          targetPage = ROUTES.ADMIN_DASHBOARD;
          break;
        case "evmstaff":
          targetPage = ROUTES.EVM_STAFF_DASHBOARD;
          break;
        case "dealermanager":
          targetPage = ROUTES.DEALER_MANAGER_DASHBOARD;
          break;
        case "dealerstaff":
          targetPage = ROUTES.DEALER_STAFF_DASHBOARD;
          break;
=======
    currentPage: ROUTES.HOME,
    selectedVehicle: null,
    user: null,
    isAuthenticated: false
};

export const routeReducer = (state, action) => {
    switch (action.type) {
        case 'NAVIGATE_TO_HOME':
            return {
                ...state,
                currentPage: ROUTES.HOME,
                selectedVehicle: null
            };
            
        case 'NAVIGATE_TO_LOGIN':
            return {
                ...state,
                currentPage: ROUTES.LOGIN,
                user: null,
                isAuthenticated: false
            };
            
        case 'LOGIN_SUCCESS': {
            // Route dựa theo role
            const user = action.payload;
            
            console.log('LOGIN_SUCCESS - Full action:', action);
            console.log('LOGIN_SUCCESS - User data:', user);
            console.log('LOGIN_SUCCESS - User role:', user?.role);
            console.log('LOGIN_SUCCESS - User keys:', user ? Object.keys(user) : 'no user');
            
            // Safety check - nếu không có user data thì về login
            if (!user || !user.role) {
                return {
                    ...state,
                    currentPage: ROUTES.LOGIN,
                    user: null,
                    isAuthenticated: false
                };
            }
            
            let targetPage = ROUTES.CATALOG;
            
            // Route based on role
            if (user.role === 'admin') {
                targetPage = ROUTES.ADMIN_DASHBOARD;
            } else if (user.role === 'dealer_manager') {
                targetPage = ROUTES.ADMIN_DASHBOARD;
            } else if (user.role === 'dealer_staff') {
                targetPage = ROUTES.ADMIN_DASHBOARD;
            } else if (user.role === 'evm_staff') {
                targetPage = ROUTES.EVM_DASHBOARD;
            }
            
            console.log('LOGIN_SUCCESS - Target page:', targetPage);
            
            return {
                ...state,
                currentPage: targetPage,
                user: user,
                isAuthenticated: true
            };
        }
        
        case 'NAVIGATE_TO_ADMIN_DASHBOARD':
            return {
                ...state,
                currentPage: ROUTES.ADMIN_DASHBOARD
            };
        
        case 'NAVIGATE_TO_EVM_DASHBOARD':
            return {
                ...state,
                currentPage: ROUTES.EVM_DASHBOARD,
                user: action.payload?.user || state.user,
                isAuthenticated: true
            };
        
        case 'NAVIGATE_TO_VEHICLE_MODELS':
            return {
                ...state,
                currentPage: ROUTES.VEHICLE_MODELS
            };
            
        case 'NAVIGATE_TO_RESET_PASSWORD':
            return {
                ...state,
                currentPage: ROUTES.RESET_PASSWORD,
        };
    
        case 'LOGOUT':
            return {
                ...state,
                currentPage: ROUTES.HOME,
                user: null,
                isAuthenticated: false,
                selectedVehicle: null
            };
            
        case 'NAVIGATE_TO_CATALOG':
            return {
                ...state,
                currentPage: ROUTES.CATALOG,
                selectedVehicle: null,
                user: action.payload?.user || state.user,
                isAuthenticated: state.user ? true : false
            };
            
        case 'NAVIGATE_TO_DETAIL':
            return {
                ...state,
                currentPage: ROUTES.DETAIL,
                selectedVehicle: action.payload
            };
            
>>>>>>> Stashed changes
        default:
          targetPage = ROUTES.CATALOG;
      }
      return {
        ...state,
        currentPage: targetPage,
        user: user,
        isAuthenticated: true,
      };
    }

    case "NAVIGATE_TO_ADMIN_DASHBOARD":
      return {
        ...state,
        currentPage: ROUTES.ADMIN_DASHBOARD,
      };

    case "NAVIGATE_TO_VEHICLE_MODELS":
      return {
        ...state,
        currentPage: ROUTES.VEHICLE_MODELS,
      };

    case "NAVIGATE_TO_RESET_PASSWORD":
      return {
        ...state,
        currentPage: ROUTES.RESET_PASSWORD,
      };

    case "LOGOUT":
      return {
        ...state,
        currentPage: ROUTES.LOGIN,
        user: null,
        isAuthenticated: false,
        selectedVehicle: null,
      };

    case "NAVIGATE_TO_CATALOG":
      return {
        ...state,
        currentPage: ROUTES.CATALOG,
        selectedVehicle: null,
      };

    case "NAVIGATE_TO_DETAIL":
      return {
        ...state,
        currentPage: ROUTES.DETAIL,
        selectedVehicle: action.payload,
      };

    default:
      return state;
  }
};
