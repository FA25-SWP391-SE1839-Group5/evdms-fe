import React from 'react';

const DealerSidebar = ({ currentPage, onNavigate }) => {
  // Define menu items for Dealer Manager
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bx-home-circle', page: 'dealer-dashboard' },
    { id: 'staff', label: 'Staff Management', icon: 'bx-user-plus', page: 'dealer-staff' },
    { id: 'performance', label: 'Staff Performance', icon: 'bx-line-chart', page: 'dealer-performance' },
    { id: 'orders', label: 'Dealer Orders', icon: 'bx-package', page: 'dealer-orders' },
    // Add other relevant sections like Inventory (if managed by dealer), Customer CRM, etc.
  ];

  const handleMenuClick = (e, page) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page); // Pass the page key to the layout
    }
  };

  const renderMenuItem = (item) => {
    const isActive = currentPage === item.page;
    return (
      <li key={item.id} className={`menu-item ${isActive ? 'active' : ''}`}>
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
        <a href="#" className="app-brand-link" onClick={(e) => handleMenuClick(e, 'dealer-dashboard')}>
          <span className="app-brand-logo demo">
             {/* You might want a different logo or color */}
            <img src="/assets/images/elecar_logo.svg" alt="EVDMS Logo" className="img-fluid" style={{ maxHeight: '56px' }} />
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
      <ul className="menu-inner py-1">
        {menuItems.map(renderMenuItem)}
      </ul>
    </aside>
  );
};

export default DealerSidebar;