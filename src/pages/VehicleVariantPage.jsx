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


