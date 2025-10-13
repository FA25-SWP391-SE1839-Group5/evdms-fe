import { useState, useEffect } from "react";
import { getCurrentUser, logout } from "../../../services/authService";
import { getCurrentUser as getCurrentUserAPI } from "../../../services/dashboardService";

const Navbar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage first
    const localUser = getCurrentUser();
    if (localUser) {
      setUser(localUser);
    }

    // Then fetch latest user data from API
    const fetchUserData = async () => {
      try {
        const response = await getCurrentUserAPI();
        if (response.data?.success) {
          const userData = response.data.data;
          setUser({
            id: userData.id,
            name: userData.fullName,
            email: userData.email,
            role: userData.role
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.dropdown-user')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserMenu]);

  const toggleUserMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowUserMenu(!showUserMenu);
  };

  const handleToggleSidebar = (e) => {
    e.preventDefault();
    document.body.classList.toggle("layout-menu-expanded");
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  };

  return (
    <nav
      className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
      id="layout-navbar"
    >
      {/* Sidebar Toggle (mobile) */}
      <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
        <a
          className="nav-item nav-link px-0 me-xl-4"
          href="#"
          onClick={handleToggleSidebar}
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

        {/* Right section */}
        <ul className="navbar-nav flex-row align-items-center ms-auto">
          {/* User Avatar Dropdown */}
          <li className="nav-item navbar-dropdown dropdown-user dropdown">
            <a
              href="#"
              className="nav-link dropdown-toggle hide-arrow"
              onClick={toggleUserMenu}
              data-bs-toggle="dropdown"
            >
              <div className="avatar avatar-online">
                <img
                  src="/assets/img/avatars/1.png"
                  alt="user avatar"
                  className="w-px-40 h-auto rounded-circle"
                />
              </div>
            </a>
            <ul className={`dropdown-menu dropdown-menu-end ${showUserMenu ? "show" : ""}`}>
              <li>
                <a className="dropdown-item" href="#">
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <div className="avatar avatar-online">
                        <img
                          src="/assets/img/avatars/1.png"
                          alt=""
                          className="w-px-40 h-auto rounded-circle"
                        />
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <span className="fw-semibold d-block">
                        {user?.name || 'Loading...'}
                      </span>
                      <small className="text-muted">
                        {user?.role || 'User'}
                      </small>
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <div className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  <i className="bx bx-user me-2" />
                  <span className="align-middle">My Profile</span>
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  <i className="bx bx-cog me-2" />
                  <span className="align-middle">Settings</span>
                </a>
              </li>
              <li>
                <div className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item" href="#" onClick={handleLogout}>
                  <i className="bx bx-power-off me-2" />
                  <span className="align-middle">Log Out</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;