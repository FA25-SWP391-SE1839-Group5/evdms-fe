const Sidebar = ({ currentPage, onNavigate }) => {
  // Only Users and Audit Logs
  const sidebarMenu = [
    {
      id: "users",
      label: "Users",
      icon: "bx-user",
      pageKey: "users",
    },
    {
      id: "audit",
      label: "Audit Logs",
      icon: "bx-history",
      pageKey: "audit",
    },
  ];

  const handleMenuClick = (e, pageKey) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(pageKey); // [SỬA] Gọi onNavigate thay vì reload
    }
  };

  const renderMenuItem = (item) => {
    const isActive = currentPage === item.pageKey;

    return (
      <li key={item.id} className={`menu-item ${isActive ? "active" : ""}`}>
        {/* [SỬA] href có thể để # hoặc gọi handleMenuClick trực tiếp */}
        <a
           href="#" // Hoặc `/${item.pageKey}` nếu vẫn muốn URL thay đổi (cần xử lý thêm ở Layout)
           className="menu-link"
           onClick={(e) => handleMenuClick(e, item.pageKey)} // Truyền pageKey
         >
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
         {/* [SỬA] Logo nên điều hướng về trang mặc định, vd: "users" */}
        <a href="#" className="app-brand-link" onClick={(e) => handleMenuClick(e, "users")}>
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

      {/* Menu Items */}
      <ul className="menu-inner py-1">{sidebarMenu.map(renderMenuItem)}</ul>
    </aside>
  );
};

export default Sidebar;
