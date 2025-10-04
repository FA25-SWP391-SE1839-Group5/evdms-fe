export const ROUTES = {
    LOGIN: 'login',
    CATALOG: 'catalog',
    DETAIL: 'detail',
    DASHBOARD: 'dashboard',
    VEHICLE_MODELS: 'vehicle_models'
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
            // ✅ Route dựa theo role
            const user = action.payload;
            
            // ✅ Safety check - nếu không có user data thì về login
            if (!user || !user.role) {
                return {
                    ...state,
                    currentPage: ROUTES.LOGIN,
                    user: null,
                    isAuthenticated: false
                };
            }
            
            let targetPage = ROUTES.CATALOG;
            
            if (user.role === 'evm_staff') {
                targetPage = ROUTES.VEHICLE_MODELS;
            } else if (user.role === 'admin' || user.role === 'dealer_manager' || user.role === 'dealer_staff') {
                targetPage = ROUTES.CATALOG;
            }
            
            return {
                ...state,
                currentPage: targetPage,
                user: user,
                isAuthenticated: true
            };
        }
            
        case 'NAVIGATE_TO_VEHICLE_MODELS':
            return {
                ...state,
                currentPage: ROUTES.VEHICLE_MODELS
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
            
        case 'NAVIGATE_TO_DASHBOARD':
            return {
                ...state,
                currentPage: ROUTES.DASHBOARD
            };
            
        default:
            return state;
    }
};