import { useEffect, useState } from "react";
import { getDealerById } from "../../services/dealerService";
import { deleteVehicle, getAllVehicles, getVehicleById, patchVehicle } from "../../services/vehicleService";
import { getVehicleVariantById } from "../../services/vehicleVariantService";
import { decodeJwt } from "../../utils/jwt";

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [variantNameMap, setVariantNameMap] = useState({});
  const [dealerNameMap, setDealerNameMap] = useState({});
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [showRawJson, setShowRawJson] = useState(false);
  // Compare two vehicles
  const [selectedForCompare, setSelectedForCompare] = useState([]); // array of vehicle ids
  const [compareVehicles, setCompareVehicles] = useState([]); // full vehicle objects
  const [compareVariants, setCompareVariants] = useState([]); // variant objects for compare
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterBy, setFilterBy] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [totalResults, setTotalResults] = useState(0);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, searchTerm, filterBy, filterValue]);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get dealerId from JWT (correct key)
      let dealerId = null;
      try {
        const token = localStorage.getItem("evdms_auth_token");
        if (token) {
          const decoded = decodeJwt(token);
          dealerId = decoded?.dealerId;
        }
      } catch (e) {
        console.debug("Error decoding JWT for dealerId:", e);
      }

      const params = {
        page: currentPage,
        pageSize,
        search: searchTerm || undefined,
      };

      // Always filter by dealerId if present
      if (dealerId) {
        params.filters = JSON.stringify({ ...(filterBy && filterValue ? { [filterBy]: filterValue } : {}), dealerId });
      } else if (filterBy && filterValue) {
        params.filters = JSON.stringify({ [filterBy]: filterValue });
      }

      console.debug("Vehicle list params:", params);
      const resp = await getAllVehicles(params);

      // Normalize response to an items array + totalResults
      const raw = resp?.data ?? resp;
      const maybeData = raw?.data ?? raw;

      let items = [];
      let total = 0;

      if (Array.isArray(maybeData)) {
        items = maybeData;
        total = items.length;
      } else if (maybeData && Array.isArray(maybeData.items)) {
        items = maybeData.items;
        total = maybeData.totalResults ?? maybeData.items.length;
      } else if (raw && Array.isArray(raw.items)) {
        items = raw.items;
        total = raw.totalResults ?? raw.items.length;
      } else {
        // fallback: if maybeData is a single object representing one vehicle, wrap it
        if (maybeData && typeof maybeData === "object" && Object.keys(maybeData).length > 0) {
          // if it looks like a single vehicle (has id or vin), wrap it
          if (maybeData.id || maybeData.vin || maybeData.variantId) {
            items = [maybeData];
            total = 1;
          } else {
            items = [];
            total = 0;
          }
        } else {
          items = [];
          total = 0;
        }
      }

      setVehicles(items);
      // fetch variant and dealer names for display
      try {
        await fetchNamesForItems(items);
      } catch (e) {
        console.debug("Error fetching related names:", e);
      }
      setTotalResults(total);
      setTotalPages(Math.max(1, Math.ceil(total / pageSize)));
    } catch (err) {
      console.error("Error loading vehicles:", err);
      setError("Failed to load vehicles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    if (selectedForCompare.length !== 2) return;
    try {
      setLoading(true);
      // fetch full vehicle objects
      const vPromises = selectedForCompare.map((id) => getVehicleById(id));
      const vResponses = await Promise.all(vPromises);
      const vData = vResponses.map((r) => r?.data?.data ?? r?.data ?? r);
      setCompareVehicles(vData);

      // fetch variants for both
      const variantPromises = vData.map((v) => (v?.variantId ? getVehicleVariantById(v.variantId) : null));
      const variantResponses = await Promise.all(variantPromises);
      const vVariants = variantResponses.map((r) => (r ? r?.data ?? r : null));
      setCompareVariants(vVariants);

      setShowCompareModal(true);
    } catch (err) {
      console.error("Error preparing comparison:", err);
      setError("Failed to prepare comparison.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch variant and dealer names for a list of vehicles to avoid per-row delays
  const fetchNamesForItems = async (items) => {
    if (!items || items.length === 0) return;
    const variantIds = Array.from(new Set(items.map((v) => v.variantId).filter(Boolean)));
    const dealerIds = Array.from(new Set(items.map((v) => v.dealerId).filter(Boolean)));

    const vMap = { ...variantNameMap };
    const dMap = { ...dealerNameMap };

    // fetch variants we don't already have
    const missingVariantIds = variantIds.filter((id) => !vMap[id]);
    if (missingVariantIds.length > 0) {
      try {
        const vPromises = missingVariantIds.map((id) =>
          getVehicleVariantById(id)
            .then((r) => r?.data ?? r)
            .catch(() => null)
        );
        const vResults = await Promise.all(vPromises);
        vResults.forEach((vr, idx) => {
          const id = missingVariantIds[idx];
          if (vr) vMap[id] = vr.name || vr.variantName || vr.title || vr.id || id;
          else vMap[id] = id;
        });
      } catch (e) {
        console.debug("Error fetching variant names", e);
      }
    }

    // fetch dealers we don't already have
    const missingDealerIds = dealerIds.filter((id) => !dMap[id]);
    if (missingDealerIds.length > 0) {
      try {
        const dPromises = missingDealerIds.map((id) =>
          getDealerById(id)
            .then((r) => r?.name || r?.data?.name || r)
            .catch(() => null)
        );
        const dResults = await Promise.all(dPromises);
        dResults.forEach((dr, idx) => {
          const id = missingDealerIds[idx];
          if (dr) dMap[id] = dr.name || dr || id;
          else dMap[id] = id;
        });
      } catch (e) {
        console.debug("Error fetching dealer names", e);
      }
    }

    setVariantNameMap(vMap);
    setDealerNameMap(dMap);
  };

  const handleCloseCompare = () => {
    setShowCompareModal(false);
    setCompareVehicles([]);
    setCompareVariants([]);
    setSelectedForCompare([]);
  };

  const handleViewDetail = async (vehicle) => {
    try {
      const response = await getVehicleById(vehicle.id);
      // normalize different service return shapes (axios response vs raw data)
      const data = response?.data?.data ?? response?.data ?? response;
      console.debug("getVehicleById result:", data);
      if (data) {
        setSelectedVehicle(data);
        // fetch dealer name for detail view
        if (data.dealerId) {
          try {
            const d = await getDealerById(data.dealerId);
            setSelectedDealer(d?.name || d || null);
            setDealerNameMap((m) => ({ ...m, [data.dealerId]: d?.name || d || data.dealerId }));
          } catch (e) {
            console.debug("Error fetching dealer for detail view", e);
          }
        } else {
          setSelectedDealer(null);
        }
        // Fetch variant detail if variantId present
        if (data.variantId) {
          try {
            const variantDetail = await getVehicleVariantById(data.variantId);
            console.debug("getVehicleVariantById result:", variantDetail);
            // normalize variant shape (service may return axios response or raw data)
            const variant = variantDetail?.data ?? variantDetail;
            setSelectedVariant(variant);
          } catch (variantErr) {
            console.error("Error fetching variant detail:", variantErr);
            setSelectedVariant(null);
          }
        } else {
          setSelectedVariant(null);
        }
        setShowDetailModal(true);
      } else {
        setError("Vehicle details not found");
      }
    } catch (err) {
      console.error("Error loading vehicle detail:", err);
      setError("Failed to load vehicle details.");
    }
  };

  const [editType, setEditType] = useState("");

  useEffect(() => {
    if (showDetailModal && selectedVehicle) {
      setEditType(selectedVehicle.type || "");
    }
  }, [showDetailModal, selectedVehicle]);

  const handleUpdateVehicle = async (fields) => {
    try {
      await patchVehicle(selectedVehicle.id, fields);
      setShowDetailModal(false);
      setSelectedVehicle(null);
      setEditType("");
      loadVehicles();

      // Show success message
      const alert = document.createElement("div");
      alert.className = "alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3";
      alert.style.zIndex = "9999";
      alert.innerHTML = `
        <i class="bx bx-check-circle me-2"></i>
        Vehicle updated successfully!
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `;
      document.body.appendChild(alert);
      setTimeout(() => alert.remove(), 3000);
    } catch (err) {
      console.error("Error updating vehicle:", err);
      setError("Failed to update vehicle.");
    }
  };

  const handleDeleteClick = (vehicle) => {
    setVehicleToDelete(vehicle);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteVehicle(vehicleToDelete.id);
      setShowDeleteModal(false);
      setVehicleToDelete(null);
      loadVehicles();

      // Show success message
      const alert = document.createElement("div");
      alert.className = "alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3";
      alert.style.zIndex = "9999";
      alert.innerHTML = `
        <i class="bx bx-check-circle me-2"></i>
        Vehicle deleted successfully!
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `;
      document.body.appendChild(alert);
      setTimeout(() => alert.remove(), 3000);
    } catch (err) {
      console.error("Error deleting vehicle:", err);
      setError("Failed to delete vehicle.");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Available":
        return "bg-label-success";
      case "Sold":
        return "bg-label-danger";
      case "Reserved":
        return "bg-label-warning";
      default:
        return "bg-label-secondary";
    }
  };

  const getColorBadgeClass = (color) => {
    if (!color) return "bg-label-secondary text-dark";
    const c = String(color).toLowerCase();
    if (c.includes("red")) return "bg-label-danger";
    if (c.includes("blue")) return "bg-label-primary";
    if (c.includes("green")) return "bg-label-success";
    if (c.includes("yellow")) return "bg-label-warning text-dark";
    if (c.includes("silver") || c.includes("gray") || c.includes("grey")) return "bg-label-secondary";
    if (c.includes("black")) return "bg-label-secondary text-light";
    if (c.includes("white")) return "bg-label-light text-dark";
    return "bg-label-secondary";
  };

  const getTypeBadgeClass = (type) => {
    if (!type) return "bg-label-secondary";
    const t = String(type).toLowerCase();
    if (t.includes("suv")) return "bg-label-info";
    if (t.includes("sedan")) return "bg-label-primary";
    if (t.includes("hatch")) return "bg-label-success";
    if (t.includes("truck") || t.includes("pickup")) return "bg-label-danger";
    if (t.includes("van") || t.includes("mpv")) return "bg-label-warning text-dark";
    if (t.includes("coupe") || t.includes("convertible")) return "bg-label-secondary";
    if (t.includes("electric") || t.includes("ev")) return "bg-label-success";
    return "bg-label-secondary";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">
            <i className="bx bx-car me-2"></i>
            Vehicle Management
          </h4>
          <p className="text-muted mb-0">View and manage vehicles</p>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              setSelectedForCompare([]);
              setCompareVehicles([]);
              setCompareVariants([]);
              setShowCompareModal(false);
            }}
            disabled={selectedForCompare.length === 0}
          >
            Clear Selection
          </button>
          <button
            className="btn btn-success"
            onClick={async () => {
              await handleCompare();
            }}
            disabled={selectedForCompare.length !== 2}
          >
            <i className="bx bx-compare me-1"></i>
            Compare Selected ({selectedForCompare.length})
          </button>
          <button className="btn btn-primary" onClick={loadVehicles} disabled={loading}>
            <i className="bx bx-refresh me-1"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Controls: search, filter, pageSize */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2 align-items-center">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search VIN/color/type..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="col-md-2">
              <select className="form-select" value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
                <option value="">Filter by</option>
                <option value="variantId">Variant ID</option>
                <option value="dealerId">Dealer ID</option>
                <option value="vin">VIN</option>
                <option value="color">Color</option>
                <option value="type">Type</option>
                <option value="status">Status</option>
              </select>
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="Filter value"
                value={filterValue}
                onChange={(e) => {
                  setFilterValue(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="col-md-1">
              <select
                className="form-select"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="col-md-2 text-end">
              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  setSearchTerm("");
                  setFilterBy("");
                  setFilterValue("");
                  setCurrentPage(1);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bx bx-error me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {/* Vehicles Table */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Vehicles List</h5>
          <span className="badge bg-label-primary">{totalResults} Total</span>
        </div>
        <div className="table-responsive text-nowrap">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading vehicles...</p>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-5">
              <i className="bx bx-car display-1 text-muted"></i>
              <p className="mt-3 text-muted">No vehicles found</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}></th>
                  <th>VIN</th>
                  <th>Variant</th>
                  <th>Color</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="table-border-bottom-0">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`compare-${vehicle.id}`}
                          checked={selectedForCompare.includes(vehicle.id)}
                          onChange={() => {
                            // toggle
                            setSelectedForCompare((prev) => {
                              if (prev.includes(vehicle.id)) return prev.filter((id) => id !== vehicle.id);
                              // allow only up to 2
                              if (prev.length >= 2) return prev;
                              return [...prev, vehicle.id];
                            });
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <small className="text-muted">{vehicle.vin}</small>
                    </td>
                    <td>
                      <small className="text-muted">{variantNameMap[vehicle.variantId] || vehicle.variantId}</small>
                    </td>
                    <td>{vehicle.color ? <span className={`badge ${getColorBadgeClass(vehicle.color)}`}>{vehicle.color}</span> : <small className="text-muted">-</small>}</td>
                    <td>{vehicle.type ? <span className={`badge ${getTypeBadgeClass(vehicle.type)}`}>{vehicle.type}</span> : <small className="text-muted">-</small>}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(vehicle.status)}`}>{vehicle.status}</span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button type="button" className="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                          <i className="bx bx-dots-vertical-rounded"></i>
                        </button>
                        <div className="dropdown-menu">
                          <button className="dropdown-item" onClick={() => handleViewDetail(vehicle)}>
                            <i className="bx bx-show me-2"></i>
                            View Details
                          </button>
                          <button className="dropdown-item text-danger" onClick={() => handleDeleteClick(vehicle)}>
                            <i className="bx bx-trash me-2"></i>
                            Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Compare Modal */}
        {showCompareModal && compareVehicles.length === 2 && (
          <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bx bx-compare me-2"></i>Compare Vehicles
                  </h5>
                  <button type="button" className="btn-close" onClick={handleCloseCompare}></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-6">
                      <h6 className="mb-2">Vehicle A</h6>
                      <div className="mb-2">
                        <strong>VIN:</strong> {compareVehicles[0].vin}
                      </div>
                      <div className="mb-2">
                        <strong>Variant:</strong> {variantNameMap[compareVehicles[0].variantId] || compareVehicles[0].variantId}
                      </div>
                      <div className="mb-2">
                        <strong>Dealer:</strong> {dealerNameMap[compareVehicles[0].dealerId] || compareVehicles[0].dealerId}
                      </div>
                      <div className="mb-2">
                        <strong>Color:</strong>{" "}
                        {compareVehicles[0].color ? <span className={`badge ${getColorBadgeClass(compareVehicles[0].color)}`}>{compareVehicles[0].color}</span> : <span className="text-muted">-</span>}
                      </div>
                      <div className="mb-2">
                        <strong>Type:</strong>{" "}
                        {compareVehicles[0].type ? <span className={`badge ${getTypeBadgeClass(compareVehicles[0].type)}`}>{compareVehicles[0].type}</span> : <span className="text-muted">-</span>}
                      </div>
                      <div className="mb-2">
                        <strong>Status:</strong> {compareVehicles[0].status}
                      </div>
                    </div>
                    <div className="col-6">
                      <h6 className="mb-2">Vehicle B</h6>
                      <div className="mb-2">
                        <strong>VIN:</strong> {compareVehicles[1].vin}
                      </div>
                      <div className="mb-2">
                        <strong>Variant:</strong> {variantNameMap[compareVehicles[1].variantId] || compareVehicles[1].variantId}
                      </div>
                      <div className="mb-2">
                        <strong>Dealer:</strong> {dealerNameMap[compareVehicles[1].dealerId] || compareVehicles[1].dealerId}
                      </div>
                      <div className="mb-2">
                        <strong>Color:</strong>{" "}
                        {compareVehicles[1].color ? <span className={`badge ${getColorBadgeClass(compareVehicles[1].color)}`}>{compareVehicles[1].color}</span> : <span className="text-muted">-</span>}
                      </div>
                      <div className="mb-2">
                        <strong>Type:</strong>{" "}
                        {compareVehicles[1].type ? <span className={`badge ${getTypeBadgeClass(compareVehicles[1].type)}`}>{compareVehicles[1].type}</span> : <span className="text-muted">-</span>}
                      </div>
                      <div className="mb-2">
                        <strong>Status:</strong> {compareVehicles[1].status}
                      </div>
                    </div>
                  </div>

                  <hr />

                  <h6>Variant Specs Comparison</h6>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Spec</th>
                          <th>Vehicle A</th>
                          <th>Vehicle B</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          // build union of spec keys
                          const aSpecs = compareVariants[0]?.specs || {};
                          const bSpecs = compareVariants[1]?.specs || {};
                          const keys = Array.from(new Set([...Object.keys(aSpecs), ...Object.keys(bSpecs)]));
                          return keys.map((k) => (
                            <tr key={k}>
                              <td>{k.replace(/([A-Z])/g, " $1").trim()}</td>
                              <td>{aSpecs[k] ? `${aSpecs[k].value}${aSpecs[k].unit ? ` ${aSpecs[k].unit}` : ""}` : "-"}</td>
                              <td>{bSpecs[k] ? `${bSpecs[k].value}${bSpecs[k].unit ? ` ${bSpecs[k].unit}` : ""}` : "-"}</td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>

                  <h6 className="mt-3">Variant Features Comparison</h6>
                  <div className="row">
                    <div className="col-6">
                      {compareVariants[0] ? (
                        Object.entries(compareVariants[0].features || {}).map(([cat, list]) => (
                          <div key={cat} className="mb-2">
                            <strong>{cat}:</strong> {Array.isArray(list) ? list.join(", ") : String(list)}
                          </div>
                        ))
                      ) : (
                        <div>No variant A features</div>
                      )}
                    </div>
                    <div className="col-6">
                      {compareVariants[1] ? (
                        Object.entries(compareVariants[1].features || {}).map(([cat, list]) => (
                          <div key={cat} className="mb-2">
                            <strong>{cat}:</strong> {Array.isArray(list) ? list.join(", ") : String(list)}
                          </div>
                        ))
                      ) : (
                        <div>No variant B features</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseCompare}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="card-footer">
            <nav>
              <ul className="pagination pagination-sm justify-content-center mb-0">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                    <i className="tf-icon bx bx-chevron-left"></i>
                  </button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                  <li key={index + 1} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                    <i className="tf-icon bx bx-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedVehicle && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bx bx-car me-2"></i>
                  Vehicle Details
                </h5>
                <div>
                  <button type="button" className="btn btn-sm btn-outline-secondary me-2" onClick={() => setShowRawJson((s) => !s)}>
                    {showRawJson ? "Hide JSON" : "Show JSON"}
                  </button>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowDetailModal(false);
                      setSelectedVehicle(null);
                      setSelectedVariant(null);
                      setShowRawJson(false);
                    }}
                  ></button>
                </div>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Vehicle ID</label>
                    <p className="text-muted">{selectedVehicle.id}</p>
                  </div>
                  {showRawJson && (
                    <div className="col-12 mt-2">
                      <label className="form-label fw-semibold">Raw JSON (vehicle / variant)</label>
                      <pre style={{ maxHeight: 240, overflow: "auto" }} className="bg-light p-2 border">
                        {JSON.stringify({ vehicle: selectedVehicle, variant: selectedVariant }, null, 2)}
                      </pre>
                    </div>
                  )}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">VIN</label>
                    <p className="text-muted">{selectedVehicle.vin}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Dealer</label>
                    <p className="text-muted">{selectedDealer || dealerNameMap[selectedVehicle.dealerId] || selectedVehicle.dealerId}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Color</label>
                    <p>{selectedVehicle.color ? <span className={`badge ${getColorBadgeClass(selectedVehicle.color)}`}>{selectedVehicle.color}</span> : <span className="text-muted">-</span>}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Type</label>
                    <div className="input-group">
                      <select className="form-select" value={editType || selectedVehicle.type || ""} onChange={(e) => setEditType(e.target.value)}>
                        <option value="">Select type...</option>
                        <option value="Sale">Sale</option>
                        <option value="Demo">Demo</option>
                        <option value="Display">Display</option>
                      </select>
                      <button type="button" className="btn btn-outline-primary" disabled={!editType || editType === selectedVehicle.type} onClick={() => handleUpdateVehicle({ type: editType })}>
                        Update Type
                      </button>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Current Status</label>
                    <p>
                      <span className={`badge ${getStatusBadgeClass(selectedVehicle.status)}`}>{selectedVehicle.status}</span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Variant ID</label>
                    <p className="text-muted">{selectedVehicle.variantId}</p>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Variant Detail</label>
                    {selectedVariant ? (
                      <div className="alert alert-info mb-0">
                        {selectedVariant.basePrice != null && (
                          <p className="mb-1">
                            <strong>Base Price:</strong> {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(selectedVariant.basePrice)}
                          </p>
                        )}

                        {selectedVariant.specs && typeof selectedVariant.specs === "object" && (
                          <div className="mb-2">
                            <strong>Specs:</strong>
                            <div className="row mt-1">
                              {Object.entries(selectedVariant.specs).map(([key, spec]) => (
                                <div key={key} className="col-md-6 mb-1">
                                  <small className="text-muted">{key.replace(/([A-Z])/g, " $1").trim()}:</small>
                                  <div>
                                    {spec?.value}
                                    {spec?.unit ? ` ${spec.unit}` : ""}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedVariant.features && typeof selectedVariant.features === "object" && (
                          <div>
                            <strong>Features:</strong>
                            <div className="mt-1">
                              {Object.entries(selectedVariant.features).map(([cat, list]) => (
                                <p key={cat} className="mb-1">
                                  <strong>{cat}:</strong> {Array.isArray(list) ? list.join(", ") : String(list)}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="alert alert-warning mb-0">No variant detail found.</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Created At</label>
                    <p className="text-muted">{formatDate(selectedVehicle.createdAt)}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Updated At</label>
                    <p className="text-muted">{formatDate(selectedVehicle.updatedAt)}</p>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Update Status</label>
                    <div className="btn-group w-100" role="group">
                      <button
                        type="button"
                        className={`btn ${selectedVehicle.status === "Available" ? "btn-success" : "btn-outline-success"}`}
                        onClick={() => handleUpdateVehicle({ status: "Available" })}
                        disabled={selectedVehicle.status === "Available"}
                      >
                        Available
                      </button>
                      <button
                        type="button"
                        className={`btn ${selectedVehicle.status === "Sold" ? "btn-danger" : "btn-outline-danger"}`}
                        onClick={() => handleUpdateVehicle({ status: "Sold" })}
                        disabled={selectedVehicle.status === "Sold"}
                      >
                        Sold
                      </button>
                      <button
                        type="button"
                        className={`btn ${selectedVehicle.status === "Reserved" ? "btn-warning" : "btn-outline-warning"}`}
                        onClick={() => handleUpdateVehicle({ status: "Reserved" })}
                        disabled={selectedVehicle.status === "Reserved"}
                      >
                        Reserved
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedVehicle(null);
                    setSelectedVariant(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && vehicleToDelete && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bx bx-trash me-2"></i>
                  Confirm Delete
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this vehicle?</p>
                <div className="alert alert-warning">
                  <strong>Model:</strong> {vehicleToDelete.model}
                  <br />
                  <strong>Variant:</strong> {vehicleToDelete.variant}
                </div>
                <p className="text-danger mb-0">
                  <i className="bx bx-error-circle me-1"></i>
                  This action cannot be undone.
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm}>
                  <i className="bx bx-trash me-1"></i>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
