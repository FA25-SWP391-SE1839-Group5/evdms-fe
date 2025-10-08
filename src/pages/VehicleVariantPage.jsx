import { LogOut, Plus, Search, Filter, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import VehicleVariantForm from "../components/vehicle-variant/VehicleVariantForm";
import VehicleVariantList from "../components/vehicle-variant/VehicleVariantList";
import VehicleVariantSearch from "../components/vehicle-variant/VehicleVariantSearch";
import { 
  getAllVehicleVariants, 
  deleteVehicleVariant,
  createVehicleVariant,
  updateVehicleVariant,
  patchVehicleVariant
} from "../services/vehicleVariantService";
import { getAllVehicleModels } from "../services/vehicleModelService";

const VehicleVariantPage = ({ user, onLogout, onNavigateToModels }) => {
  const [variants, setVariants] = useState([]);
  const [models, setModels] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editVariant, setEditVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Fetch variants and models when component mounts
  useEffect(() => {
    fetchVariants();
    fetchModels();
  }, [pagination.page, pagination.pageSize, sortBy, sortOrder, search]);

  const fetchVariants = async () => {
  setLoading(true);
  setError(null);
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      sortBy,
      sortOrder,
      search: search || null
    };

    const response = await getAllVehicleVariants(params);
    console.log("Vehicle variants response:", response);

    // ✅ An toàn cho mọi trường hợp (có thể response.data hoặc response.data.data)
    const data = response.data?.data || response.data || {};
    const items = data.items || [];
    const totalItems = data.totalResults || data.totalItems || items.length;
    const totalPages = data.totalPages || Math.ceil(totalItems / pagination.pageSize);

    if (items.length > 0) {
      setVariants(items);
      setPagination(prev => ({
        ...prev,
        totalItems,
        totalPages
      }));
    } else {
      setVariants([]);
    }
  } catch (err) {
    console.error("Error fetching variants:", err);
    console.log("Error message:", err.message);
console.log("Error response data:", err.response?.data);
console.log("Error status:", err.response?.status);

    setError(err.response?.data?.message || "Failed to load vehicle variants");
  } finally {
    setLoading(false);
  }
};



  const fetchModels = async () => {
    try {
      const response = await getAllVehicleModels();
      const data = Array.isArray(response) ? response : Array.isArray(response.data) ? response.data : [];
      setModels(data);
    } catch (err) {
      console.error("Error fetching models:", err);
    }
  };

  