import { useEffect, useRef, useState } from "react";
import { createDealer, deleteDealer, getAllDealers, getDealerById, updateDealer } from "../../services/dealerService";
import DealerDeleteModal from "./dealer/DealerDeleteModal";
import DealerModal from "./dealer/DealerModal";
import DealerTable from "./dealer/DealerTable";

// Hardcoded regions as per requirement
const REGIONS = ["Ho Chi Minh City", "Hanoi", "Da Nang", "Nha Trang"];

const DealerManagement = () => {
  // State management
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Pagination & filtering
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const searchTimeout = useRef();
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create', 'edit', 'view'
  const [currentDealer, setCurrentDealer] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    address: "",
  });

  // Delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dealerToDelete, setDealerToDelete] = useState(null);

  // Fetch dealers on mount and when filters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllDealers({
          page,
          pageSize,
          search: searchTerm,
          sortBy,
          sortOrder,
        });
        setDealers(data.items);
        setTotalResults(data.totalResults);
      } catch (err) {
        setError("Failed to fetch dealers: " + (err.message || "Unknown error"));
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, pageSize, searchTerm, sortBy, sortOrder]);

  // Fetch dealers
  const fetchDealers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllDealers({
        page,
        pageSize,
        search: searchTerm,
        sortBy,
        sortOrder,
      });
      setDealers(data.items);
      setTotalResults(data.totalResults);
    } catch (err) {
      setError("Failed to fetch dealers: " + (err.message || "Unknown error"));
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle sort click
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  // Handle search input change with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearchTerm(value);
      setPage(1);
    }, 150);
  };

  // Keep searchInput in sync with searchTerm on mount
  useEffect(() => {
    setSearchInput(searchTerm);
    // eslint-disable-next-line
  }, []);

  // Open modal for create
  const handleCreate = () => {
    setModalMode("create");
    setFormData({ name: "", region: REGIONS[0], address: "" });
    setCurrentDealer(null);
    setShowModal(true);
  };

  // Open modal for edit
  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const dealer = await getDealerById(id);
      setCurrentDealer(dealer);
      setFormData({
        name: dealer.name,
        region: dealer.region,
        address: dealer.address,
      });
      setModalMode("edit");
      setShowModal(true);
    } catch (err) {
      setError("Failed to fetch dealer details: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Open modal for view
  const handleView = async (id) => {
    try {
      setLoading(true);
      const dealer = await getDealerById(id);
      setCurrentDealer(dealer);
      setFormData({
        name: dealer.name,
        region: dealer.region,
        address: dealer.address,
      });
      setModalMode("view");
      setShowModal(true);
    } catch (err) {
      setError("Failed to fetch dealer details: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.name.trim()) {
      setError("Dealer name is required");
      return;
    }
    if (!formData.region) {
      setError("Region is required");
      return;
    }
    if (!formData.address.trim()) {
      setError("Address is required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name,
        region: formData.region,
        address: formData.address,
      };

      if (modalMode === "create") {
        await createDealer(payload);
        setSuccess("Dealer created successfully!");
        setShowModal(false); // Close immediately after create
        await fetchDealers();
        setTimeout(() => setSuccess(null), 1500);
      } else if (modalMode === "edit") {
        await updateDealer(currentDealer.id, payload);
        setSuccess("Dealer updated successfully!");
        setShowModal(false); // Close immediately after update
        await fetchDealers();
        setTimeout(() => setSuccess(null), 1500);
      }
    } catch (err) {
      setError("Failed to save dealer: " + (err.response?.data?.message || err.message || "Unknown error"));
      console.error("Save error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDeleteClick = (dealer) => {
    setDealerToDelete(dealer);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!dealerToDelete) return;

    try {
      setLoading(true);
      await deleteDealer(dealerToDelete.id);
      setSuccess("Dealer deleted successfully!");
      setShowDeleteModal(false);
      setDealerToDelete(null);
      await fetchDealers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to delete dealer: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalResults / pageSize);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get region badge color
  const getRegionColor = (region) => {
    const colors = {
      "Ho Chi Minh City": "primary",
      Hanoi: "success",
      "Da Nang": "info",
      "Nha Trang": "warning",
    };
    return colors[region] || "secondary";
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Dealer Management</h4>
          <p className="text-muted mb-0">Manage dealer locations, regions, and contracts</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          <i className="bx bx-plus me-1" />
          Add New Dealer
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bx bx-error me-2" />
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)} />
        </div>
      )}
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bx bx-check-circle me-2" />
          {success}
          <button type="button" className="btn-close" onClick={() => setSuccess(null)} />
        </div>
      )}

      {/* Search and Filter Card */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bx bx-search" />
                </span>
                <input type="text" className="form-control" placeholder="Search by dealer name or region..." value={searchInput} onChange={handleSearchChange} />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="20">20 per page</option>
                <option value="50">50 per page</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="card">
        <div className="card-body">
          {loading && !showModal ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <DealerTable
                dealers={dealers}
                getRegionColor={getRegionColor}
                formatDate={formatDate}
                handleView={handleView}
                handleEdit={handleEdit}
                handleDeleteClick={handleDeleteClick}
                sortBy={sortBy}
                sortOrder={sortOrder}
                handleSort={handleSort}
              />
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div className="text-muted">
                    Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalResults)} of {totalResults} results
                  </div>
                  <nav>
                    <ul className="pagination mb-0">
                      <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => setPage(page - 1)} disabled={page === 1}>
                          Previous
                        </button>
                      </li>
                      {[...new Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        if (pageNum === 1 || pageNum === totalPages || (pageNum >= page - 1 && pageNum <= page + 1)) {
                          return (
                            <li key={pageNum} className={`page-item ${page === pageNum ? "active" : ""}`}>
                              <button className="page-link" onClick={() => setPage(pageNum)}>
                                {pageNum}
                              </button>
                            </li>
                          );
                        } else if (pageNum === page - 2 || pageNum === page + 2) {
                          return (
                            <li key={pageNum} className="page-item disabled">
                              <span className="page-link">...</span>
                            </li>
                          );
                        }
                        return null;
                      })}
                      <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <DealerModal
        showModal={showModal}
        modalMode={modalMode}
        loading={loading}
        formData={formData}
        REGIONS={REGIONS}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        setShowModal={setShowModal}
        currentDealer={
          currentDealer && {
            ...currentDealer,
            createdAt: formatDate(currentDealer.createdAt),
            updatedAt: formatDate(currentDealer.updatedAt),
          }
        }
      />

      {/* Delete Confirmation Modal */}
      <DealerDeleteModal showDeleteModal={showDeleteModal} dealerToDelete={dealerToDelete} loading={loading} setShowDeleteModal={setShowDeleteModal} confirmDelete={confirmDelete} />
    </div>
  );
};

export default DealerManagement;
