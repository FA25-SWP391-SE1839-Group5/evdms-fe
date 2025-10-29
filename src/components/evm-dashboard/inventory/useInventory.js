// useInventory.js
// Custom hook for inventory CRUD and state management
import { useEffect, useState } from "react";
import { adjustInventoryQuantity, createInventory, deleteInventory, getAllInventories, getInventoryById, updateInventory } from "../../../services/evm/inventoryService";

const useInventory = (page, pageSize, searchTerm, sortBy) => {
  const [inventories, setInventories] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInventories();
    // eslint-disable-next-line
  }, [page, pageSize, searchTerm, sortBy]);

  const fetchInventories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllInventories({
        page,
        pageSize,
        search: searchTerm,
        sortBy,
        sortOrder: "asc",
      });
      setInventories(data.items);
      setTotalResults(data.totalResults);
    } catch (err) {
      setError("Failed to fetch inventories: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return {
    inventories,
    totalResults,
    loading,
    error,
    fetchInventories,
    getInventoryById,
    createInventory,
    updateInventory,
    deleteInventory,
    adjustInventoryQuantity,
  };
};

export default useInventory;
