// src/components/DealerPayments/DealerPaymentsPage.jsx
import { useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Col, Form, Row, Spinner, Table } from "react-bootstrap";
import { getAllDealerPayments, uploadDealerPaymentDocument } from "../../../services/dealerOrderService";
import { decodeJwt } from "../../../utils/jwt";
import DealerPaymentDetailsModal from "./DealerPaymentDetailsModal";

const DealerPaymentsPage = () => {
  // State
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("");

  // Modal state for details
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detailsError, setDetailsError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  // Handle View Details button
  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
    setDetailsError(null);
    setSelectedFile(null);
  };

  // Handle file select in modal
  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handle upload PDF (stub, replace with real API if needed)
  const handleUpload = async (e) => {
    e.preventDefault();
    setDetailsError(null);
    if (!selectedFile) {
      setDetailsError("Please select a PDF file.");
      return;
    }
    setUploading(true);
    try {
      await uploadDealerPaymentDocument(selectedPayment.id, selectedFile);
      setShowDetailsModal(false);
      setSelectedFile(null);
    } catch (err) {
      setDetailsError(err.message || "Failed to upload PDF.");
    } finally {
      setUploading(false);
    }
  };
  const fetchPayments = async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      // Get dealerId from JWT in localStorage
      const token = localStorage.getItem("evdms_auth_token");
      let dealerId;
      if (token) {
        const payload = decodeJwt(token);
        dealerId = payload?.dealerId;
      }
      const filterObj = {};
      if (dealerId) filterObj.dealerId = dealerId;
      if (statusFilter) filterObj.status = statusFilter;
      const filters = Object.keys(filterObj).length > 0 ? JSON.stringify(filterObj) : undefined;
      const response = await getAllDealerPayments({
        page,
        pageSize,
        sortBy,
        sortOrder,
        filters,
        ...params,
      });
      const data = response?.data || {};
      const items = data.items || [];
      setPayments(Array.isArray(items) ? items : []);
      setTotalResults(data.totalResults || 0);
    } catch (err) {
      setError(err.message);
      setPayments([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, sortBy, sortOrder, statusFilter]);

  // Pagination helpers
  const totalPages = Math.ceil(totalResults / pageSize);
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };
  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };
  const renderSort = (column) => (sortBy === column ? (sortOrder === "asc" ? " ▲" : " ▼") : "");

  // Status badge
  const renderStatusBadge = (status) => {
    let variant = "secondary";
    switch (status?.toLowerCase()) {
      case "pending":
        variant = "warning";
        break;
      case "paid":
        variant = "success";
        break;
      case "failed":
        variant = "danger";
        break;
      default:
        variant = "secondary";
    }
    return <Badge bg={variant}>{status || "Unknown"}</Badge>;
  };

  // Format currency like DealerPaymentsManagement
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">Dealer Payments</h5>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={3} sm={6} xs={12}>
              <Form.Select value={statusFilter} onChange={handleStatusFilter}>
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
              </Form.Select>
            </Col>
            <Col md={3} sm={6} xs={12} className="mt-2 mt-md-0">
              <Form.Label className="me-2">Page Size</Form.Label>
              <Form.Select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                style={{ width: "auto", display: "inline-block" }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("dealerOrderId")}>
                  Order ID{renderSort("dealerOrderId")}
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("amount")}>
                  Amount (USD){renderSort("amount")}
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("createdAt")}>
                  Created Date{renderSort("createdAt")}
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("status")}>
                  Status{renderSort("status")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    <Spinner animation="border" />
                  </td>
                </tr>
              ) : payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.dealerOrderId ? payment.dealerOrderId.substring(0, 8) : "N/A"}...</td>
                    <td className="text-primary fw-semibold">{payment.amount != null ? formatCurrency(payment.amount) : "N/A"}</td>
                    <td>{payment.createdAt ? new Date(payment.createdAt).toLocaleString() : "N/A"}</td>
                    <td>{renderStatusBadge(payment.status)}</td>
                    <td>
                      <Button variant="outline-primary" size="sm" onClick={() => handleViewDetails(payment)}>
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          {/* Pagination Controls */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Page {page} of {totalPages} ({totalResults} results)
            </div>
            <div>
              <Button variant="outline-secondary" size="sm" disabled={page === 1} onClick={() => handlePageChange(page - 1)} className="me-2">
                Prev
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) =>
                Math.abs(p - page) <= 2 || p === 1 || p === totalPages ? (
                  <Button key={p} variant={p === page ? "primary" : "outline-primary"} size="sm" onClick={() => handlePageChange(p)} className="me-1">
                    {p}
                  </Button>
                ) : p === page - 3 || p === page + 3 ? (
                  <span key={p} className="me-1">
                    ...
                  </span>
                ) : null
              )}
              <Button variant="outline-secondary" size="sm" disabled={page === totalPages || totalPages === 0} onClick={() => handlePageChange(page + 1)} className="ms-2">
                Next
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
      {/* Render modal only once, outside the table rows */}
      <DealerPaymentDetailsModal
        show={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        payment={selectedPayment}
        uploading={uploading}
        error={detailsError}
        onFileSelect={handleFileSelect}
        onUpload={handleUpload}
        documentUrl={selectedPayment?.documentUrl}
      />
    </>
  );
};

export default DealerPaymentsPage;
