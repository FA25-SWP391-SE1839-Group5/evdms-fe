// hooks/useBootstrap.js
import { useEffect } from 'react';

const useBootstrap = () => {
  useEffect(() => {
    // Initialize Bootstrap dropdowns
    const initializeDropdowns = () => {
      const dropdownElementList = document.querySelectorAll('[data-bs-toggle="dropdown"]');
      
      if (window.bootstrap && dropdownElementList.length > 0) {
        dropdownElementList.forEach((dropdownToggle) => {
          // Check if already initialized
          if (!dropdownToggle.classList.contains('dropdown-initialized')) {
            new window.bootstrap.Dropdown(dropdownToggle);
            dropdownToggle.classList.add('dropdown-initialized');
          }
        });
      }
    };

    // Wait for Bootstrap to load
    const checkBootstrap = setInterval(() => {
      if (window.bootstrap) {
        initializeDropdowns();
        clearInterval(checkBootstrap);
      }
    }, 100);

    // Cleanup
    return () => {
      clearInterval(checkBootstrap);
    };
  }, []);
};

export default useBootstrap;