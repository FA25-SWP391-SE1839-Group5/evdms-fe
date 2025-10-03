export const ROUTES = {
    LOGIN: 'login',
    CATALOG: 'catalog',
    DETAIL: 'detail',
    DASHBOARD: 'dashboard',
    VEHICLE_MODELS: 'vehicle_models'
};

export const initialState = {
    currentPage: ROUTES.LOGIN, // BẮT ĐẦU TỪ LOGIN
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
            
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                currentPage: ROUTES.CATALOG, // Sau khi login thành công -> đi vào Catalog
                user: action.payload,
                isAuthenticated: true
            };
            
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