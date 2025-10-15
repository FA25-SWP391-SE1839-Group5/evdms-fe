import React from 'react';

const Navbar = () => {
  const userMenuItems = [
    {
      icon: 'bx-user',
      label: 'My Profile',
      href: '#'
    },
    {
      icon: 'bx-cog',
      label: 'Settings',
      href: '#'
    },
    {
      divider: true
    },
    {
      icon: 'bx-power-off',
      label: 'Log Out',
      href: 'auth-login-basic.html'
    }
  ];

  return (
    <nav
      className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
      id="layout-navbar"
    >
      {/* Mobile Menu Toggle */}
      <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
        <a
          className="nav-item nav-link px-0 me-xl-4"
          href="javascript:void(0)"
        >
          <i className="bx bx-menu bx-sm" />
        </a>
      </div>

      <div
        className="navbar-nav-right d-flex align-items-center"
        id="navbar-collapse"
      >
        {/* Search */}
        <div className="navbar-nav align-items-center">
          <div className="nav-item d-flex align-items-center">
            <i className="bx bx-search fs-4 lh-0" />
            <input
              type="text"
              className="form-control border-0 shadow-none"
              placeholder="Search..."
              aria-label="Search..."
            />
          </div>
        </div>
        {/* /Search */}

        <ul className="navbar-nav flex-row align-items-center ms-auto">
          {/* User Dropdown */}
          <li className="nav-item navbar-dropdown dropdown-user dropdown">
            <a
              className="nav-link dropdown-toggle hide-arrow"
              href="javascript:void(0);"
              data-bs-toggle="dropdown"
            >
              <div className="avatar avatar-online">
                <img
                  src="../assets/img/avatars/1.png"
                  alt="User Avatar"
                  className="w-px-40 h-auto rounded-circle"
                />
              </div>
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              {/* User Info */}
              <li>
                <a className="dropdown-item" href="#">
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <div className="avatar avatar-online">
                        <img
                          src="../assets/img/avatars/1.png"
                          alt="User Avatar"
                          className="w-px-40 h-auto rounded-circle"
                        />
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <span className="fw-semibold d-block">John Doe</span>
                      <small className="text-muted">Admin</small>
                    </div>
                  </div>
                </a>
              </li>

              {/* Menu Items */}
              {userMenuItems.map((item, idx) => {
                if (item.divider) {
                  return <li key={idx}><div className="dropdown-divider" /></li>;
                }
                return (
                  <li key={idx}>
                    <a className="dropdown-item" href={item.href}>
                      <i className={`bx ${item.icon} me-2`} />
                      <span className="align-middle">{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </li>
          {/*/ User Dropdown */}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;