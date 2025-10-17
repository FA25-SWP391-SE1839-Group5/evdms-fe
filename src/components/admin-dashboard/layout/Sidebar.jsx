import React from 'react';

const Sidebar = ({ currentPage }) => {
  // Main menu items for EVDMS
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'bx-home-circle',
      page: 'dashboard'
    },
    {
      id: 'dealers',
      label: 'Dealers',
      icon: 'bx-store',
      page: 'dealers'
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: 'bx-group',
      page: 'customers'
    }
  ];

  // User Management submenu
  const userManagementMenu = [
    {
      id: 'users-account',
      label: 'User Accounts',
      page: 'users'
    },
    {
      id: 'users-notifications',
      label: 'Add User',
      page: 'users/notifications'
    },
  ];

  const vehicleMenu = [
    {
      id: 'inventory',
      label: 'Vehicle Inventory',
      icon: 'bx-car',
      page: 'inventory'
    },
    {
      id: 'quotations',
      label: 'Quotations',
      icon: 'bx-file',
      page: 'quotations'
    },
    {
      id: 'orders',
      label: 'Sales Orders',
      icon: 'bx-cart',
      page: 'orders'
    },
    {
      id: 'testdrives',
      label: 'Test Drives',
      icon: 'bx-run',
      page: 'testdrives'
    }
  ];

  const financialMenu = [
    {
      id: 'payments',
      label: 'Payments',
      icon: 'bx-dollar',
      page: 'payments'
    },
    {
      id: 'promotions',
      label: 'Promotions',
      icon: 'bx-gift',
      page: 'promotions'
    }
  ];

  const systemMenu = [
    {
      id: 'audit',
      label: 'Audit Logs',
      icon: 'bx-history',
      page: 'audit'
    },
    {
      id: 'feedback',
      label: 'Feedback',
      icon: 'bx-message-dots',
      page: 'feedback'
    }
  ];

  const handleMenuClick = (e, page) => {
    e.preventDefault();
    window.location.href = `/${page}`;
  };

  const renderMenuItem = (item) => {
    const isActive = currentPage === item.page;
    
    return (
      <li key={item.id} className={`menu-item ${isActive ? 'active' : ''}`}>
        <a 
          href={`/${item.page}`} 
          className="menu-link"
          onClick={(e) => handleMenuClick(e, item.page)}
        >
          <i className={`menu-icon tf-icons bx ${item.icon}`} />
          <div data-i18n={item.label}>{item.label}</div>
        </a>
      </li>
    );
  };

  const renderSubmenuItem = (item) => {
    const isActive = currentPage === item.page;
    
    return (
      <li key={item.id} className={`menu-item ${isActive ? 'active' : ''}`}>
        <a 
          href={`/${item.page}`}
          className="menu-link"
          onClick={(e) => handleMenuClick(e, item.page)}
        >
          <div data-i18n={item.label}>{item.label}</div>
        </a>
      </li>
    );
  };
  
  return (
    <aside
      id="layout-menu"
      className="layout-menu menu-vertical menu bg-menu-theme"
    >
      {/* Logo */}
      <div className="app-brand demo">
        <a href="#" className="app-brand-link" onClick={(e) => handleMenuClick(e, 'dashboard')}>
          <span className="app-brand-logo demo">
            <img
              src="/assets/images/elecar_logo.svg"
              alt="EVDMS Logo"
              className="img-fluid"
              style={{ maxHeight: '56px' }}
            />
          </span>
          <span className="app-brand-text demo menu-text fw-bolder ms-2">
            EVDMS
          </span>
        </a>
        <a
          href="javascript:void(0);"
          className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none"
        >
          <i className="bx bx-chevron-left bx-sm align-middle" />
        </a>
      </div>

      <div className="menu-inner-shadow" />

      {/* Menu Items */}
      <ul className="menu-inner py-1">
        {/* Main Menu */}
        {renderMenuItem(menuItems.find(item => item.id === 'dashboard'))}

        {/* User Management with Submenu */}
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-user" />
            <div data-i18n="User Management">User Management</div>
          </a>
          <ul className="menu-sub">
            {userManagementMenu.map(renderSubmenuItem)}
          </ul>
        </li>

        {menuItems
          .filter(item => item.id !== 'dashboard')
          .map(renderMenuItem)}

        {/* Vehicle Management Section */}
        <li className="menu-header small text-uppercase">
          <span className="menu-header-text">Vehicle Management</span>
        </li>
        {vehicleMenu.map(renderMenuItem)}

        {/* Financial Section */}
        <li className="menu-header small text-uppercase">
          <span className="menu-header-text">Financial</span>
        </li>
        {financialMenu.map(renderMenuItem)}

        {/* System Section */}
        <li className="menu-header small text-uppercase">
          <span className="menu-header-text">System</span>
        </li>
        {systemMenu.map(renderMenuItem)}
      </ul>
    </aside>
  );
};

export default Sidebar;