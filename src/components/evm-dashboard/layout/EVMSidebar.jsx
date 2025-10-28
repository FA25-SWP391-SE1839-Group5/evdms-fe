import React from 'react';

const EVMSidebar = ({ currentPage, onNavigate }) => {
  // Menu items for EVM Staff - simplified for vehicle model management
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'bx-home-circle',
      page: 'evm-dashboard'
    },
    {
      id: 'vehicle-models',
      label: 'Vehicle Models',
      icon: 'bx-car',
      page: 'vehicle-models'
    },
    {
      id: 'dealers',
      label: 'Dealers',
      icon: 'bx-store',
      page: 'dealers'
    },
    {
      id: 'dealer-contracts',
      label: 'Dealer Contracts',
      icon: 'bx-file',
      page: 'dealer-contracts'
    },
    {
      id: 'oem-inventories',
      label: 'OEM Inventories',
      icon: 'bx-package',
      page: 'oem-inventories'
    },
    {
      id: 'vehicle-variants',
      label: 'Vehicle Variants',
      icon: 'bx-customize',
      page: 'vehicle-variants'
    },
    {
      id: 'specifications',
      label: 'Specifications',
      icon: 'bx-list-ul',
      page: 'specifications'
    }
  ];

  const handleMenuClick = (e, page) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    }
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
  
  return (
    <aside
      id="layout-menu"
      className="layout-menu menu-vertical menu bg-menu-theme"
    >
      {/* Logo */}
      <div className="app-brand demo">
        <a href="#" className="app-brand-link" onClick={(e) => handleMenuClick(e, 'evm-dashboard')}>
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
        {/* Dashboard */}
        {renderMenuItem(menuItems[0])}

        {/* Vehicle Management Section */}
        <li className="menu-header small text-uppercase">
          <span className="menu-header-text">Vehicle Management</span>
        </li>
        {renderMenuItem(menuItems[1])}
        {renderMenuItem(menuItems[5])}
        {renderMenuItem(menuItems[6])}

        {/* Dealer Management Section */}
        <li className="menu-header small text-uppercase">
          <span className="menu-header-text">Dealer Management</span>
        </li>
        {renderMenuItem(menuItems[2])}
        {renderMenuItem(menuItems[3])}

        {/* Inventory Management Section */}
        <li className="menu-header small text-uppercase">
          <span className="menu-header-text">Inventory</span>
        </li>
        {renderMenuItem(menuItems[4])}
      </ul>
    </aside>
  );
};

export default EVMSidebar;
