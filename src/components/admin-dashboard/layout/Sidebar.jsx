import React, { useEffect, useState } from "react";
import { 
  Home, 
  Store, 
  User, 
  Car, 
  FileText, 
  ShoppingBag, 
  Calendar, 
  CreditCard, 
  Gift, 
  Users, 
  History, 
  MessageSquare 
} from "lucide-react";

const Sidebar = ({ currentPage, onNavigate }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', key: 'dashboard' },
    { header: 'Management' },
    { icon: Store, label: 'Dealers', key: 'dealers' },
    { icon: User, label: 'Customers', key: 'customers' },
    { icon: Car, label: 'Vehicle Inventory', key: 'inventory' },
    { icon: FileText, label: 'Quotations', key: 'quotations' },
    { icon: ShoppingBag, label: 'Sales Orders', key: 'orders' },
    { icon: Calendar, label: 'Test Drives', key: 'testdrives' },
    { icon: CreditCard, label: 'Payments', key: 'payments' },
    { icon: Gift, label: 'Promotions', key: 'promotions' },
    { header: 'System' },
    { icon: Users, label: 'Users', key: 'users' },
    { icon: History, label: 'Audit Logs', key: 'audit' },
    { icon: MessageSquare, label: 'Feedback', key: 'feedback' }
  ];
  
  useEffect(() => {
    // Khởi tạo menu sau khi component mount
    if (window.Menu) {
      const menu = document.getElementById('layout-menu');
      if (menu) {
        new window.Menu(menu, {
          orientation: 'vertical',
          closeChildren: false
        });
      }
    }

    // Xử lý toggle menu cho mobile
    const menuToggle = document.querySelector('.layout-menu-toggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        const layoutMenu = document.getElementById('layout-menu');
        const body = document.body;
        
        if (layoutMenu && body) {
          layoutMenu.classList.toggle('layout-menu-expanded');
          body.classList.toggle('layout-menu-expanded');
        }
      });
    }

    // Cleanup
    return () => {
      if (menuToggle) {
        menuToggle.removeEventListener('click', () => {});
      }
    };
  }, []);

  const handleMenuClick = (e, key) => {
    e.preventDefault();
    console.log('🔘 Menu clicked:', key);
    
    if (onNavigate) {
      onNavigate(key);
    }
    
    // Close mobile menu after click
    const layoutMenu = document.getElementById('layout-menu');
    const body = document.body;
    if (layoutMenu && body) {
      layoutMenu.classList.remove('layout-menu-expanded');
      body.classList.remove('layout-menu-expanded');
    }
  };

  return (
    <>
      {/* Menu */}
      <aside
        id="layout-menu"
        className="layout-menu menu-vertical menu bg-menu-theme"
      >
        <div className="app-brand demo">
          <a href="#" className="app-brand-link" onClick={(e) => handleMenuClick(e, 'dashboard')}>
            <span className="app-brand-logo demo">
              <img 
                src="public/assets/images/elecar_logo.svg" 
                alt="Logo" 
                style={{ width: '56px', height: '56px', objectFit: 'contain' }}
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
        <ul className="menu-inner py-1">
          {menuItems.map((item, index) => {
            // Render header
            if (item.header) {
              return (
                <li key={index} className="menu-header small text-uppercase">
                  <span className="menu-header-text">{item.header}</span>
                </li>
              );
            }
            
            // Render menu item
            const Icon = item.icon;
            const isActive = currentPage === item.key;
            
            return (
              <li key={item.key} className={`menu-item ${isActive ? 'active' : ''}`}>
                <a 
                  href="#" 
                  className="menu-link"
                  onClick={(e) => handleMenuClick(e, item.key)}
                >
                  <Icon className="menu-icon" size={20} />
                  <div data-i18n={item.label}>{item.label}</div>
                </a>
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;