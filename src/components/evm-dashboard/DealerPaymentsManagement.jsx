import { useEffect, useState } from "react";
import { getAllDealerPayments, markDealerPaymentFailed, markDealerPaymentPaid } from "../../services/dealerOrderService";
import DealerPaymentReviewModal from "./dealer-payment/DealerPaymentReviewModal";

const DealerPaymentsManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // default page 1
  const [pageSize, setPageSize] = useState(10); // default pageSize 10
  const [totalResults, setTotalResults] = useState(0);
  const [statusFilter, setStatusFilter] = useState("Pending"); // default status Pending
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  // Modal handlers
  const handleReview = (payment) => {
    setSelectedPayment(payment);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedPayment(null);
    setModalLoading(false);
  };

  const handlePaid = async () => {
    if (!selectedPayment) return;
    setModalLoading(true);
    try {
      await markDealerPaymentPaid(selectedPayment.id);
      handleModalClose();
      fetchPayments();
    } catch (err) {
      setError("Failed to mark as paid: " + (err.message || "Unknown error"));
      setModalLoading(false);
    }
  };

  const handleFailed = async () => {
    if (!selectedPayment) return;
    setModalLoading(true);
    try {
      await markDealerPaymentFailed(selectedPayment.id);
      handleModalClose();
      fetchPayments();
    } catch (err) {
      setError("Failed to mark as failed: " + (err.message || "Unknown error"));
      setModalLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line
  }, [page, pageSize, statusFilter, sortBy, sortOrder]);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = statusFilter ? JSON.stringify({ status: statusFilter }) : undefined;
      const res = await getAllDealerPayments({ page, pageSize, filters, sortBy, sortOrder });
      const data = res.data || {};
      setPayments(data.items || []);
      setTotalResults(data.totalResults || 0);
    } catch (err) {
      setError("Failed to fetch dealer payments: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalPages = Math.ceil(totalResults / pageSize);

  // Status badge coloring like DealerOrderManagement
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <span className="badge bg-label-warning">Pending</span>;
      case "Paid":
        return <span className="badge bg-label-success">Paid</span>;
      case "Failed":
        return <span className="badge bg-label-danger">Failed</span>;
      default:
        return <span className="badge bg-label-secondary">{status}</span>;
    }
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Dealer Payments</h4>
          <p className="text-muted mb-0">View and manage dealer payments</p>
        </div>
        <div>
          {typeof totalResults === "number" && <span className="badge bg-label-primary me-3">{totalResults} Total</span>}
          <button className="btn btn-primary" onClick={fetchPayments}>
            <i className="bx bx-refresh me-1" />
            Refresh
          </button>
        </div>
      </div>
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bx bx-error me-2" />
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)} />
        </div>
      )}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
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
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
              </select>
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
                {[10, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size} per page
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
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
                      <th style={{ cursor: "pointer" }} onClick={() => handleSort("dealerOrderId")}>
                        Dealer Order ID {sortBy === "dealerOrderId" && (sortOrder === "asc" ? "▲" : "▼")}
                      </th>
                      <th style={{ cursor: "pointer" }} onClick={() => handleSort("amount")}>
                        Amount (USD) {sortBy === "amount" && (sortOrder === "asc" ? "▲" : "▼")}
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
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5 text-muted">
                          <i className="bx bx-file bx-lg mb-2" />
                          <p>No dealer payments found</p>
                        </td>
                      </tr>
                    ) : (
                      payments.map((payment) => (
                        <tr key={payment.id}>
                          <td>{payment.dealerOrderId}</td>
                          <td className="text-primary fw-semibold">{formatCurrency(payment.amount)}</td>
                          <td>{getStatusBadge(payment.status)}</td>
                          <td>{formatDate(payment.createdAt)}</td>
                          <td>{formatDate(payment.updatedAt)}</td>
                          <td>
                            <button className="btn btn-sm btn-primary" onClick={() => handleReview(payment)}>
                              Review
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Review Modal */}
              <DealerPaymentReviewModal open={modalOpen} payment={selectedPayment} onClose={handleModalClose} onPaid={handlePaid} onFailed={handleFailed} loading={modalLoading} />
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
    </div>
  );
};

export default DealerPaymentsManagement;
