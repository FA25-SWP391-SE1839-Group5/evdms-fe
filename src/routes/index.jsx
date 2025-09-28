export const ROUTES = {
    CATALOG: 'catalog',
    DETAIL: 'detail'
};

export const initialState = {
    currentPage: ROUTES.CATALOG,
    selectedVehicle: null
};

export const routeReducer = (state, action) => {
    switch (action.type) {
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
