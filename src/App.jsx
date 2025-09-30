import React, { useReducer, useState } from 'react';
import CatalogPage from './pages/CatalogPage';
import EVDetailPage from './pages/EVDetailPage';
import RegisterPage from './pages/RegisterPage'; // Import RegisterPage
import { routeReducer, initialState, ROUTES } from './routes';

const App = () => {
  const [routeState, dispatch] = useReducer(routeReducer, initialState);
  const [favorites, setFavorites] = useState(new Set());
  const [compareList, setCompareList] = useState([]);

  const navigateToDetail = (vehicle) => {
    dispatch({
      type: 'NAVIGATE_TO_DETAIL',
      payload: vehicle
    });
  };

  const navigateToCatalog = () => {
    dispatch({
      type: 'NAVIGATE_TO_CATALOG'
    });
  };

  const navigateToRegister = () => { // Thêm function này
    dispatch({
      type: 'NAVIGATE_TO_REGISTER'
    });
  };

  const toggleFavorite = (vehicleId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(vehicleId)) {
        newFavorites.delete(vehicleId);
      } else {
        newFavorites.add(vehicleId);
      }
      return newFavorites;
    });
  };

  const toggleCompare = (vehicleId) => {
    setCompareList(prev => {
      if (prev.includes(vehicleId)) {
        return prev.filter(id => id !== vehicleId);
      } else if (prev.length < 3) {
        return [...prev, vehicleId];
      } else {
        alert('Chỉ có thể so sánh tối đa 3 xe');
        return prev;
      }
    });
  };

  return (
    <div className="font-sans">
      {routeState.currentPage === ROUTES.CATALOG && (
        <CatalogPage
          onVehicleSelect={navigateToDetail}
          onNavigateToRegister={navigateToRegister} // Pass function để navigate
        />
      )}
      
      {routeState.currentPage === ROUTES.DETAIL && (
        <EVDetailPage
          vehicle={routeState.selectedVehicle}
          onBack={navigateToCatalog}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          compareList={compareList}
          toggleCompare={toggleCompare}
        />
      )}

      {routeState.currentPage === ROUTES.REGISTER && ( // Thêm RegisterPage render
        <RegisterPage
          onBack={navigateToCatalog}
        />
      )}
    </div>

    
  );
};

export default App;