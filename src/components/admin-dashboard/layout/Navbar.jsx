import { useEffect, useState } from "react";
import { getCurrentUser as getCurrentUserFromAuth, logout } from "../../../services/authService";
import { getCurrentUser as getCurrentUserFromAPI } from "../../../services/userService";

const Navbar = () => {
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
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/login";
    }
  };

  // Get role display name
  const getRoleDisplay = (role) => {
    const roleMap = {
      admin: "Admin",
      dealer_manager: "Dealer Manager",
      dealer_staff: "Dealer Staff",
      evm_staff: "EVM Staff",
    };
    return roleMap[role] || (role ? role : "User");
  };

  return (
    <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
      {/* Mobile Menu Toggle */}
      <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
        <a className="nav-item nav-link px-0 me-xl-4" href="javascript:void(0)">
          <i className="bx bx-menu bx-sm" />
        </a>
      </div>

      {/* Page Title */}
      <div className="navbar-nav align-items-center">
        <div className="nav-item d-flex align-items-center">
          <h4 className="mb-0 text-primary fw-bold">Admin Dashboard</h4>
        </div>
      </div>

      <ul className="navbar-nav flex-row align-items-center ms-auto">
        {/* User Dropdown */}
        <li className="nav-item navbar-dropdown dropdown-user dropdown">
          <a className="nav-link dropdown-toggle hide-arrow" href="#" data-bs-toggle="dropdown">
            <div
              className="avatar avatar-online bg-primary text-white d-flex align-items-center justify-content-center"
              style={{ width: 40, height: 40, borderRadius: "50%", fontWeight: 600, fontSize: 18 }}
            >
              {user && user.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "GU"}
            </div>
          </a>
          <ul className="dropdown-menu dropdown-menu-end">
            {/* User Info */}
            <li>
              <a className="dropdown-item" href="#">
                <div className="d-flex">
                  <div className="flex-shrink-0 me-3">
                    <div
                      className="avatar avatar-online bg-primary text-white d-flex align-items-center justify-content-center"
                      style={{ width: 40, height: 40, borderRadius: "50%", fontWeight: 600, fontSize: 18 }}
                    >
                      {user && user.name
                        ? user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)
                        : "GU"}
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
                        <small className="text-muted">{user ? getRoleDisplay(user.role) : "No role"}</small>
                      </>
                    ) : (
                      <>
                        <span className="fw-semibold d-block">Guest</span>
                        <small className="text-muted">No role</small>
                      </>
                    )}
                  </div>
                </div>
              </a>
            </li>
            {/* Only Log Out button */}
            <li>
              <div className="dropdown-divider" />
            </li>
            <li>
              <a
                className="dropdown-item"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
                style={{ cursor: "pointer" }}
              >
                <i className="bx bx-power-off me-2" />
                <span className="align-middle">Log Out</span>
              </a>
            </li>
          </ul>
        </li>
        {/*/ User Dropdown */}
      </ul>
    </nav>
  );
};

export default Navbar;
