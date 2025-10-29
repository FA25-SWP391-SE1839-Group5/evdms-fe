const Sidebar = ({ currentPage }) => {
  // Only Users and Audit Logs
  const sidebarMenu = [
    {
      id: "users",
      label: "Users",
      icon: "bx-user",
      page: "admin/users",
    },
    {
      id: "audit",
      label: "Audit Logs",
      icon: "bx-history",
      page: "admin/audit",
    },
  ];

  const handleMenuClick = (e, page) => {
    e.preventDefault();
    window.location.href = `/${page}`;
  };

  const renderMenuItem = (item) => {
    const isActive = currentPage === item.page;

    return (
      <li key={item.id} className={`menu-item ${isActive ? "active" : ""}`}>
        <a href={`/${item.page}`} className="menu-link" onClick={(e) => handleMenuClick(e, item.page)}>
          <i className={`menu-icon tf-icons bx ${item.icon}`} />
          <div data-i18n={item.label}>{item.label}</div>
        </a>
      </li>
    );
  };

  // (renderSubmenuItem removed, no longer needed)

  return (
    <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
      {/* Logo */}
      <div className="app-brand demo">
        <a href="#" className="app-brand-link" onClick={(e) => handleMenuClick(e, "admin/users")}>
          <span className="app-brand-logo demo">
            <img src="/assets/images/elecar_logo.svg" alt="EVDMS Logo" className="img-fluid" style={{ maxHeight: "56px" }} />
          </span>
          <span className="app-brand-text demo menu-text fw-bolder ms-2">EVDMS</span>
        </a>
        <a href="javascript:void(0);" className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
          <i className="bx bx-chevron-left bx-sm align-middle" />
        </a>
      </div>

      <div className="menu-inner-shadow" />

      {/* Only Users and Audit Logs */}
      <ul className="menu-inner py-1">{sidebarMenu.map(renderMenuItem)}</ul>
    </aside>
  );
};

export default Sidebar;
