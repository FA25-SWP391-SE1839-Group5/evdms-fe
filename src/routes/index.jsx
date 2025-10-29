export const ROUTES = {
    HOME: 'home',
    LOGIN: 'login',
    CATALOG: 'catalog',
    DETAIL: 'detail',
    ADMIN_DASHBOARD: 'admin-dashboard',
    EVM_DASHBOARD: 'evm-dashboard',
    DEALER_MANAGER_DASHBOARD: 'dealer-dashboard',
    VEHICLE_MODELS: 'vehicle-models',
    RESET_PASSWORD: 'reset-password',
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
                targetPage = ROUTES.DEALER_MANAGER_DASHBOARD;
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
        
        case 'NAVIGATE_TO_DEALER_DASHBOARD':
            if (state.isAuthenticated && state.user?.role === 'dealer_manager') {
                // DÙNG return thay vì gán biến và break
                return { ...state, currentPage: ROUTES.DEALER_MANAGER_DASHBOARD };
            } else {
                // DÙNG return thay vì gán biến và break
                return {...initialState, currentPage: ROUTES.LOGIN };
            }
            
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
            
        default:
            return state;
    }
};