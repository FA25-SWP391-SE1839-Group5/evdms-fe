import { useEffect, useState } from "react";
import { createDealerPayment, getAllDealerOrders, markDealerOrderDelivered, patchDealerOrder } from "../../services/dealerOrderService";
import DealerOrderReviewModal from "./dealer-orders/DealerOrderReviewModal";

const ORDER_STATUSES = ["Pending", "Confirmed", "Delivered", "Canceled"];

const DealerOrderManagement = () => {
  // State
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [sortBy, setSortBy] = useState("status");
  const [sortOrder, setSortOrder] = useState("asc");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [page, pageSize, searchTerm, statusFilter, sortBy, sortOrder]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = statusFilter ? JSON.stringify({ status: statusFilter }) : undefined;
      const res = await getAllDealerOrders({
        page,
        pageSize,
        search: searchTerm,
        filters,
        sortBy,
        sortOrder,
      });
      const data = res.data || {};
      setOrders(data.items || []);
      setTotalResults(data.totalResults || 0);
    } catch (err) {
      setError("Failed to fetch dealer orders: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  // Modal handlers
  const handleReview = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedOrder(null);
    setModalLoading(false);
  };

  const handleAccept = async () => {
    if (!selectedOrder) return;
    setModalLoading(true);
    try {
      await createDealerPayment({ dealerOrderId: selectedOrder.id });
      handleModalClose();
      fetchOrders();
    } catch (err) {
      setError("Failed to accept order: " + (err.message || "Unknown error"));
      setModalLoading(false);
    }
  };

  const handleDecline = async () => {
    if (!selectedOrder) return;
    setModalLoading(true);
    try {
      await patchDealerOrder(selectedOrder.id, { status: "Canceled" });
      handleModalClose();
      fetchOrders();
    } catch (err) {
      setError("Failed to decline order: " + (err.message || "Unknown error"));
      setModalLoading(false);
    }
  };

  const handleDeliver = async () => {
    if (!selectedOrder) return;
    setModalLoading(true);
    try {
      await markDealerOrderDelivered(selectedOrder.id);
      handleModalClose();
      fetchOrders();
    } catch (err) {
      setError("Failed to deliver order: " + (err.message || "Unknown error"));
      setModalLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <span className="badge bg-label-warning">Pending</span>;
      case "Confirmed":
        return <span className="badge bg-label-info">Confirmed</span>;
      case "Delivered":
        return <span className="badge bg-label-success">Delivered</span>;
      case "Canceled":
        return <span className="badge bg-label-danger">Canceled</span>;
      default:
        return <span className="badge bg-label-secondary">{status}</span>;
    }
  };

  const totalPages = Math.ceil(totalResults / pageSize);

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Dealer Order Management</h4>
          <p className="text-muted mb-0">View and manage dealer vehicle orders</p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bx bx-error me-2" />
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)} />
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
                <input type="text" className="form-control" placeholder="Search by dealer, variant, color..." value={searchTerm} onChange={handleSearchChange} />
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
            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Statuses</option>
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th style={{ cursor: "pointer" }} onClick={() => handleSort("dealerName")}>
                        Dealer {sortBy === "dealerName" && (sortOrder === "asc" ? "▲" : "▼")}
                      </th>
                      <th style={{ cursor: "pointer" }} onClick={() => handleSort("variantName")}>
                        Variant {sortBy === "variantName" && (sortOrder === "asc" ? "▲" : "▼")}
                      </th>
                      <th style={{ cursor: "pointer" }} onClick={() => handleSort("color")}>
                        Color {sortBy === "color" && (sortOrder === "asc" ? "▲" : "▼")}
                      </th>
                      <th style={{ cursor: "pointer" }} onClick={() => handleSort("quantity")}>
                        Quantity {sortBy === "quantity" && (sortOrder === "asc" ? "▲" : "▼")}
                      </th>
                      <th style={{ cursor: "pointer" }} onClick={() => handleSort("status")}>
                        Status {sortBy === "status" && (sortOrder === "asc" ? "▲" : "▼")}
                      </th>
                      <th style={{ cursor: "pointer" }} onClick={() => handleSort("createdAt")}>
                        Created At {sortBy === "createdAt" && (sortOrder === "asc" ? "▲" : "▼")}
                      </th>
                      <th style={{ cursor: "pointer" }} onClick={() => handleSort("updatedAt")}>
                        Updated At {sortBy === "updatedAt" && (sortOrder === "asc" ? "▲" : "▼")}
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-5 text-muted">
                          <i className="bx bx-file bx-lg mb-2" />
                          <p>No dealer orders found</p>
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id}>
                          <td>{order.dealerName}</td>
                          <td>{order.variantName}</td>
                          <td>{order.color}</td>
                          <td>{order.quantity}</td>
                          <td>{getStatusBadge(order.status)}</td>
                          <td>{formatDate(order.createdAt)}</td>
                          <td>{formatDate(order.updatedAt)}</td>
                          <td>
                            <button className="btn btn-sm btn-primary" onClick={() => handleReview(order)}>
                              Review
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

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
                      {Array.from({ length: totalPages }, (_, i) => {
                        const pageNum = i + 1;
                        if (pageNum === 1 || pageNum === totalPages || (pageNum >= page - 1 && pageNum <= page + 1)) {
                          return (
                            <li key={pageNum} className={`page-item ${page === pageNum ? "active" : ""}`}>
                              <button className="page-link" onClick={() => setPage(pageNum)}>
                                {pageNum}
                              </button>
                            </li>
                          );
                        } else if ((pageNum === page - 2 && page > 3) || (pageNum === page + 2 && page < totalPages - 2)) {
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
      {/* Review Modal */}
      <DealerOrderReviewModal open={modalOpen} order={selectedOrder} onClose={handleModalClose} onAccept={handleAccept} onDecline={handleDecline} onDeliver={handleDeliver} loading={modalLoading} />
    </div>
  );
};

export default DealerOrderManagement;
