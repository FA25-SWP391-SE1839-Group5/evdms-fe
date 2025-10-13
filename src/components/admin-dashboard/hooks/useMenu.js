// hooks/useMenu.js
import { useEffect } from 'react';

const useMenu = () => {
  useEffect(() => {
    // Initialize menu functionality
    const menuToggle = document.querySelector('.layout-menu-toggle');
    const layoutMenu = document.querySelector('#layout-menu');
    const layoutOverlay = document.querySelector('.layout-overlay');

    const toggleMenu = () => {
      if (layoutMenu) {
        layoutMenu.classList.toggle('layout-menu-expanded');
        document.body.classList.toggle('layout-menu-expanded');
      }
      if (layoutOverlay) {
        layoutOverlay.classList.toggle('active');
      }
    };

    const closeMenu = () => {
      if (layoutMenu) {
        layoutMenu.classList.remove('layout-menu-expanded');
        document.body.classList.remove('layout-menu-expanded');
      }
      if (layoutOverlay) {
        layoutOverlay.classList.remove('active');
      }
    };

    if (menuToggle) {
      menuToggle.addEventListener('click', toggleMenu);
    }

    if (layoutOverlay) {
      layoutOverlay.addEventListener('click', closeMenu);
    }

    // Cleanup
    return () => {
      if (menuToggle) {
        menuToggle.removeEventListener('click', toggleMenu);
      }
      if (layoutOverlay) {
        layoutOverlay.removeEventListener('click', closeMenu);
      }
    };
  }, []);
};

export default useMenu;