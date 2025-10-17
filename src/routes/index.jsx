export const ROUTES = {
    LOGIN: 'login',
    CATALOG: 'catalog',
    DETAIL: 'detail',
    ADMIN_DASHBOARD: 'admin_dashboard',
    VEHICLE_MODELS: 'vehicle_models',
    RESET_PASSWORD: 'reset_password',
};

// Admin Dashboard sub-pages
const ADMIN_PAGES = {
  DASHBOARD: 'dashboard',
  USERS: 'users',
  DEALERS: 'dealers',
  CUSTOMERS: 'customers',
  INVENTORY: 'inventory',
  QUOTATIONS: 'quotations',
  ORDERS: 'orders',
  TESTDRIVES: 'testdrives',
  PAYMENTS: 'payments',
  PROMOTIONS: 'promotions',
  AUDIT: 'audit',
  FEEDBACK: 'feedback',
};

export const initialState = {
    currentPage: ROUTES.LOGIN,
    selectedVehicle: null,
    user: null,
    isAuthenticated: false
};

export const routeReducer = (state, action) => {
    switch (action.type) {
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
                targetPage = ROUTES.VEHICLE_MODELS;
            }
            
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
                currentPage: ROUTES.LOGIN,
                user: null,
                isAuthenticated: false,
                selectedVehicle: null
            };
            
        case 'NAVIGATE_TO_CATALOG':
            return {
                ...state,
                currentPage: ROUTES.CATALOG,
                selectedVehicle: null
            };
            
        case 'NAVIGATE_TO_DETAIL':
            return {
                ...state,
                currentPage: ROUTES.DETAIL,
                selectedVehicle: action.payload
            };
            
        default:
            return state;
    }
};