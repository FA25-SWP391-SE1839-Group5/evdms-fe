export const ROUTES = {
    HOME: 'home',
    CATALOG: 'catalog',
    DETAIL: 'detail',
    REGISTER: 'register'
};

export const initialState = {
    currentPage: ROUTES.HOME,
    selectedVehicle: null
};

export const routeReducer = (state, action) => {
    switch (action.type) {
        case 'NAVIGATE_TO_HOME':
            return {
                ...state,
                currentPage: ROUTES.HOME,
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
