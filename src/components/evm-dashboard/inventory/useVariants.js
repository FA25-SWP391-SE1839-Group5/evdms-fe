// useVariants.js
// Custom hook for fetching vehicle variants
import { useEffect, useState } from "react";
import { getAllVehicleVariants } from "../../../services/evm/vehicleVariantService";

const useVariants = () => {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVariantsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllVehicleVariants({ page: 1, pageSize: 100 });
        const variantsList = response.data?.data?.items || response.data?.items || response.data || [];
        setVariants(variantsList);
      } catch (err) {
        setError(err + "Error fetching variants");
      } finally {
        setLoading(false);
      }
    };
    fetchVariantsData();
  }, []);

  return { variants, loading, error };
};

export default useVariants;
