const DealerSidebar = ({ currentPage, onNavigate }) => {
  // Get user role from localStorage
  const userStr = localStorage.getItem("evdms_user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userRole = user?.role?.toLowerCase();

  // Define menu items based on role
  const getMenuItems = () => {
    // For Dealer Staff (role: "staff" or "dealer_staff")
    if (userRole === "staff" || userRole === "dealer_staff") {
      return [
        { id: "staff-dashboard", label: "Dashboard", icon: "bx-home-circle", page: "staff-dashboard" },
        { id: "vehicle", label: "Vehicle", icon: "bx-car", page: "vehicle" },
        { id: "customers", label: "Customers", icon: "bx-group", page: "customers" },
        { id: "test-drives", label: "Test Drives", icon: "bx-car", page: "test-drives" },
        { id: "quotations", label: "Quotations", icon: "bx-package", page: "quotations" },
        { id: "sales-orders", label: "Sales Orders", icon: "bx-shopping-bag", page: "sales-orders" },
        { id: "feedbacks", label: "Feedbacks", icon: "bx-message-square-dots", page: "feedbacks" },
      ];
    }

    // For Dealer Manager (role: "dealer_manager")
    return [
      { id: "dashboard", label: "Dashboard", icon: "bx-home-circle", page: "dealer-dashboard" },
      { id: "staff", label: "Staff Management", icon: "bx-user-plus", page: "dealer-staff" },
      { id: "performance", label: "Staff Performance", icon: "bx-line-chart", page: "dealer-performance" },
      { id: "orders", label: "Dealer Orders", icon: "bx-package", page: "dealer-orders" },
      { id: "payments", label: "Dealer Payments", icon: "bx-credit-card", page: "dealer-payments" },
      { id: "promotions", label: "Promotions", icon: "bx-gift", page: "dealer-promotions" },
    ];
  };

  const menuItems = getMenuItems();

  const handleMenuClick = (e, page) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page); // Pass the page key to the layout
    }
  };

  const renderMenuItem = (item) => {
    const isActive = currentPage === item.page;
    return (
      <li key={item.id} className={`menu-item ${isActive ? "active" : ""}`}>
        <a
          href={`/${item.page}`} // Keep href for potential direct navigation/refresh
          className="menu-link"
          onClick={(e) => handleMenuClick(e, item.page)}
        >
          <i className={`menu-icon tf-icons bx ${item.icon}`} />
          <div data-i18n={item.label}>{item.label}</div>
        </a>
      </li>
    );
  };

  return (
    <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
      {/* Logo */}
      <div className="app-brand demo">
        <a href="#" className="app-brand-link" onClick={(e) => handleMenuClick(e, userRole === "staff" || userRole === "dealer_staff" ? "staff-dashboard" : "dealer-dashboard")}>
          <span className="app-brand-logo demo">
            {/* You might want a different logo or color */}
            <img src="/assets/images/elecar_logo.svg" alt="EVDMS Logo" className="img-fluid" style={{ maxHeight: "56px" }} />
          </span>
          <span className="app-brand-text demo menu-text fw-bolder ms-2">EVDMS</span>
        </a>
        {/* Mobile toggle */}
        <a href="#" className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
          <i className="bx bx-chevron-left bx-sm align-middle" />
        </a>
      </div>
      <div className="menu-inner-shadow" />
      {/* Menu */}
      <ul className="menu-inner py-1">{menuItems.map(renderMenuItem)}</ul>
    </aside>
  );
};

export default DealerSidebar;
