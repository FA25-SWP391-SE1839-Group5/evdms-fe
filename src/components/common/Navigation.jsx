import React from "react";

const Navigation = () => {
    return (
        <nav className="section is nav-blur">
            <div className="container is-nav">
                <div className="grid is--nav">
                    <div className="grid_items is--nav-logo">
                        <a href="/" className="nav_logo w-inline-block w--current">
                            <img src="src/assets/images/elecar_logo.svg" loading="lazy" alt="" className="nav_logo-img"/>
                        </a>
                    </div>
                    <div className="grid_item is--menu">
                        <a href="/prodotto" className="menu_link w_inline-block">
                            <p className="menu_p">PRODUCT</p>
                            <div className="menu_line"></div>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;