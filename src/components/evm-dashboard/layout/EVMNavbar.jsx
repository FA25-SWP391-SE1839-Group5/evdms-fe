import { useEffect, useState } from "react";
import { getCurrentUser as getCurrentUserFromAuth, logout } from "../../../services/authService";
import { getCurrentUser as getCurrentUserFromAPI } from "../../../services/dashboardService";

const EVMNavbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user data from localStorage first (for immediate display)
    const localUser = getCurrentUserFromAuth();
    if (localUser) {
      setUser(localUser);
    }

    // Then fetch from API for updated data
    const fetchUserData = async () => {
      try {
        const response = await getCurrentUserFromAPI();
        if (response.data?.success) {
          const userData = response.data.data;
          setUser({
            id: userData.id,
            name: userData.fullName || userData.name,
            email: userData.email,
            role: userData.role,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Keep using localStorage data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      // Still navigate to login even if logout API fails
      window.location.href = "/";
    }
  };

  const userMenuItems = [
    {
      icon: "bx-power-off",
      label: "Log Out",
      onClick: handleLogout,
    },
  ];

  // Get role display name
  const getRoleDisplay = (role) => {
    const roleMap = {
      admin: "Admin",
      dealer_manager: "Dealer Manager",
      dealer_staff: "Dealer Staff",
      evm_staff: "EVM Staff",
    };
    return roleMap[role] || "EVM Staff";
  };

  return (
    <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
      {/* Mobile Menu Toggle */}
      <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
        <a className="nav-item nav-link px-0 me-xl-4" href="javascript:void(0)">
          <i className="bx bx-menu bx-sm" />
        </a>
      </div>

      <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
        {/* Page Title - No Search Bar */}
        <div className="navbar-nav align-items-center">
          <div className="nav-item d-flex align-items-center">
            <h4 className="mb-0 text-primary fw-bold">OEM</h4>
          </div>
        </div>

        {/* Right Side - Style Switcher & User Menu */}
        <ul className="navbar-nav flex-row align-items-center ms-auto">
          {/* User Dropdown */}
          <li className="nav-item navbar-dropdown dropdown-user dropdown">
            <a className="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);" data-bs-toggle="dropdown">
              <div className="avatar avatar-online">
                <img src="../assets/img/avatars/1.png" alt="User Avatar" className="w-px-40 h-auto rounded-circle" />
              </div>
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              {/* User Info */}
              <li>
                <a className="dropdown-item" href="#">
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <div className="avatar avatar-online">
                        <img src="../assets/img/avatars/1.png" alt="User Avatar" className="w-px-40 h-auto rounded-circle" />
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      {loading ? (
                        <>
                          <span className="fw-semibold d-block">Loading...</span>
                          <small className="text-muted">...</small>
                        </>
                      ) : user ? (
                        <>
                          <span className="fw-semibold d-block">{user.name}</span>
                          <small className="text-muted">{getRoleDisplay(user.role)}</small>
                        </>
                      ) : (
                        <>
                          <span className="fw-semibold d-block">Guest</span>
                          <small className="text-muted">{getRoleDisplay(user?.role)}</small>
                        </>
                      )}
                    </div>
                  </div>
                </a>
              </li>

              {/* Menu Items */}
              {userMenuItems.map((item, idx) => {
                if (item.divider) {
                  return (
                    <li key={idx}>
                      <div className="dropdown-divider" />
                    </li>
                  );
                }
                return (
                  <li key={idx}>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        item.onClick();
                      }}
                      style={{ cursor: "pointer" }}
                    >
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

export default EVMNavbar;
