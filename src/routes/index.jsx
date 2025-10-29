export const ROUTES = {
  LOGIN: "login",
  CATALOG: "catalog",
  DETAIL: "detail",
  ADMIN_DASHBOARD: "admin_dashboard",
  EVM_STAFF_DASHBOARD: "evm_staff_dashboard",
  DEALER_MANAGER_DASHBOARD: "dealer_manager_dashboard",
  DEALER_STAFF_DASHBOARD: "dealer_staff_dashboard",
  VEHICLE_MODELS: "vehicle_models",
  RESET_PASSWORD: "reset_password",
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
