import { useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Col, Dropdown, Form, Modal, Row, Spinner, Table } from "react-bootstrap";
// Đảm bảo các đường dẫn service này là chính xác
import { createDealerOrder, getAllDealerOrders } from "../../../services/dealerOrderService";
import { uploadDealerPaymentDocument } from "../../../services/dealerService";
import { getAllInventories } from "../../../services/inventoryService";
import { getAllVehicleVariants } from "../../../services/vehicleVariantService";
import { decodeJwt } from "../../../utils/jwt";

// Helper function to map color names to badge classes
function getColorBadgeClass(color) {
  if (!color) return "secondary";
  const colorMap = {
    Red: "danger",
    Blue: "primary",
    Green: "success",
    Yellow: "warning",
    Black: "dark",
    White: "white-badge",
    Silver: "secondary",
    Gray: "secondary",
  };
  // Try to match case-insensitive
  const key = Object.keys(colorMap).find((k) => k.toLowerCase() === color.toLowerCase());
  return key ? colorMap[key] : "secondary";
}

function renderColorBadge(color) {
  const badgeClass = getColorBadgeClass(color);
  if (badgeClass === "white-badge") {
    return (
      <span className="badge bg-white text-dark border border-secondary" style={{ minWidth: 60 }}>
        {color}
      </span>
    );
  }
  if (badgeClass === "purple-badge") {
    return (
      <span className="badge" style={{ backgroundColor: "#6f42c1", color: "#fff", minWidth: 60 }}>
        {color}
      </span>
    );
  }
  if (badgeClass === "dark" && color === "Black") {
    return (
      <span className="badge" style={{ backgroundColor: "#000", color: "#fff", minWidth: 60 }}>
        {color}
      </span>
    );
  }
  return (
    <span className={`badge bg-label-${badgeClass}`} style={{ minWidth: 60 }}>
      {color}
    </span>
  );
}

const DealerOrdersPage = () => {
  // State chính
  const [orders, setOrders] = useState([]); // Khởi tạo là mảng rỗng
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // Pagination, sorting, filtering
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("");
  const [colorFilter, setColorFilter] = useState("");

  // State cho Modal Tạo Order (giữ nguyên từ lần trước)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [variants, setVariants] = useState([]);
  const [isVariantsLoading, setIsVariantsLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderColor, setOrderColor] = useState("");
  const [inventoryCount, setInventoryCount] = useState(null);
  const [isInventoryLoading, setIsInventoryLoading] = useState(false);

  // State cho Modal Upload Biên lai
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [orderToPay, setOrderToPay] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // State chung
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState(null);

  // --- 1. Tải Dữ liệu ---

  // ******** ĐÂY LÀ PHẦN SỬA LỖI ********
  const fetchOrders = async (params = {}) => {
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
      if (colorFilter) filterObj.color = colorFilter;
      const filters = Object.keys(filterObj).length > 0 ? JSON.stringify(filterObj) : undefined;
      const response = await getAllDealerOrders({
        page,
        pageSize,
        sortBy,
        sortOrder,
        filters,
        ...params,
      });
      // API: { success, data: { items, totalResults, ... } }
      const data = response?.data || {};
      const items = data.items || [];
      setOrders(Array.isArray(items) ? items : []);
      setTotalResults(data.totalResults || 0);
    } catch (err) {
      setError(err.message);
      setOrders([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  };
  // ***************************************

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, sortBy, sortOrder, statusFilter, colorFilter]);

  // --- 2. Xử lý Modal Tạo Order ---
  // (Giữ nguyên logic từ lần trước, đã bao gồm quantity và color)
  const handleShowCreateModal = async () => {
    setShowCreateModal(true);
    setModalError(null);
    setSelectedVariant("");
    setOrderQuantity(1);
    setOrderColor("");
    setIsVariantsLoading(true);
    try {
      const response = await getAllVehicleVariants();
      const variantArray = response.items || [];
      setVariants(variantArray);
      if (variantArray.length > 0) {
        setSelectedVariant(variantArray[0].id);
        // Fetch inventory for initially selected variant
        fetchInventoryForVariant(variantArray[0].id);
      }
    } catch (err) {
      setModalError(err.message);
      setVariants([]);
    } finally {
      setIsVariantsLoading(false);
    }
  };

  // Fetch inventory count for a variant
  const fetchInventoryForVariant = async (variantId) => {
    if (!variantId) {
      setInventoryCount(null);
      return;
    }
    setIsInventoryLoading(true);
    setInventoryCount(null);
    try {
      // Ask inventory service for all inventories matching this variant
      const filters = JSON.stringify({ variantId });
      const resp = await getAllInventories({ page: 1, pageSize: 1000, filters });
      const items = resp.items || [];
      // Sum up quantities across matched inventory records
      const total = items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
      setInventoryCount(total);
    } catch (err) {
      console.error("Failed to fetch inventory for variant", variantId, err);
      setInventoryCount(null);
    } finally {
      setIsInventoryLoading(false);
    }
  };

  // When selected variant changes, refresh inventory count
  useEffect(() => {
    if (selectedVariant) fetchInventoryForVariant(selectedVariant);
  }, [selectedVariant]);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModalError(null);
    try {
      const orderData = {
        variantId: selectedVariant,
        quantity: parseInt(orderQuantity, 10),
        color: orderColor,
      };
      await createDealerOrder(orderData); // Gọi API với 3 trường
      setShowCreateModal(false);
      fetchOrders(); // Tải lại danh sách
    } catch (err) {
      setModalError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 3. Xử lý Modal Upload Biên lai ---
  // (Không thay đổi)
  const handleShowUploadModal = (order) => {
    if (!order.paymentId) {
      setError("Error: Missing Payment ID for this order.");
      return;
    }
    setOrderToPay(order);
    setShowUploadModal(true);
    setModalError(null);
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadPayment = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setModalError("Please select a PDF file.");
      return;
    }
    setIsSubmitting(true);
    setModalError(null);
    try {
      await uploadDealerPaymentDocument(orderToPay.paymentId, selectedFile);
      setShowUploadModal(false);
      fetchOrders(); // Tải lại danh sách
    } catch (err) {
      setModalError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 4. Render Helper ---
  // src/components/DealerOrders/DealerOrdersPage.jsx

  // --- 4. Render Helper (CẬP NHẬT) ---
  const renderStatusBadge = (status) => {
    let variant = "secondary"; // Màu mặc định

    // Dùng toLowerCase() để bắt
    switch (status?.toLowerCase()) {
      // Logic của cậu
      case "pending":
        variant = "warning"; // Màu cam
        break;
      case "paid":
        variant = "success"; // Màu xanh lá
        break;
      case "failed":
        variant = "danger"; // Màu đỏ
        break;

      // Logic cũ của tui (bổ sung cho các trạng thái khác)
      case "confirmed":
        variant = "primary"; // Xanh đậm
        break;
      case "delivered":
        variant = "info"; // Xanh dương
        break;
      case "awaitingpayment":
        variant = "info"; // Xanh dương
        break;
      case "awaitingpaymentconfirmation":
        variant = "primary"; // Xanh đậm
        break;
      case "delivering":
        variant = "dark"; // Đen
        break;
      case "completed":
        variant = "success"; // Xanh lá
        break;
      case "canceled":
        variant = "danger"; // Đỏ
        break;

      default:
        variant = "secondary"; // Xám
    }

    // Dùng 'status' gốc để hiển thị, giữ nguyên chữ hoa/thường
    return <Badge bg={variant}>{status || "Unknown"}</Badge>;
  };

  const renderActionButton = (order) => {
    switch (order.status) {
      case "AwaitingPayment":
        return (
          <Button
            variant="success"
            size="sm"
            onClick={() => handleShowUploadModal(order)}
            disabled={!order.paymentId} // Thêm kiểm tra an toàn
          >
            Upload Payment
          </Button>
        );
      case "Pending":
        return <em>Awaiting OEM Review</em>;
      case "AwaitingPaymentConfirmation":
        return <em>Payment Under Review</em>;
      default:
        return null;
    }
  };

  // --- 5. Main Render ---
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
  const handleStatusFilter = (selectedStatus) => {
    setStatusFilter(selectedStatus);
    setPage(1);
  };
  const handleColorFilter = (selectedColor) => {
    setColorFilter(selectedColor);
    setPage(1);
  };
  // Sort indicator
  const renderSort = (column) => (sortBy === column ? (sortOrder === "asc" ? " ▲" : " ▼") : "");

  return (
    <>
      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">Dealer Orders</h5>
            </Col>
            <Col className="text-end">
              <Button variant="primary" onClick={handleShowCreateModal}>
                <i className="bx bx-plus me-1"></i> Create New Order
              </Button>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={3} sm={6} xs={12}>
              <Dropdown onSelect={handleStatusFilter} className="w-100">
                <Dropdown.Toggle variant="outline-secondary" className="w-100 text-start">
                  {statusFilter ? renderStatusBadge(statusFilter) : "All Statuses"}
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-100">
                  <Dropdown.Item eventKey="">All Statuses</Dropdown.Item>
                  {["Pending", "Confirmed", "Paid", "Delivered", "Canceled"].map((status) => (
                    <Dropdown.Item eventKey={status} key={status}>
                      {renderStatusBadge(status)}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col md={3} sm={6} xs={12}>
              <Dropdown onSelect={handleColorFilter} className="w-100">
                <Dropdown.Toggle variant="outline-secondary" className="w-100 text-start">
                  {colorFilter ? renderColorBadge(colorFilter) : "All Colors"}
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-100">
                  <Dropdown.Item eventKey="">All Colors</Dropdown.Item>
                  {["Red", "Blue", "Green", "Yellow", "Black", "White", "Silver", "Gray"].map((color) => (
                    <Dropdown.Item eventKey={color} key={color}>
                      {renderColorBadge(color)}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
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
                {/* Order ID column removed */}
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("variantName")}>
                  Vehicle Variant{renderSort("variantName")}
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("quantity")}>
                  Quantity{renderSort("quantity")}
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("color")}>
                  Color{renderSort("color")}
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("createdAt")}>
                  Created Date{renderSort("createdAt")}
                </th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("status")}>
                  Status{renderSort("status")}
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    <Spinner animation="border" />
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id}>
                    {/* Order ID cell removed */}
                    <td>{order.variantName || "N/A"}</td>
                    <td>{order.quantity || 1}</td>
                    <td>{renderColorBadge(order.color || "N/A")}</td>

                    <td>{order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}</td>
                    <td>{renderStatusBadge(order.status)}</td>
                    <td>{renderActionButton(order)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No orders found.
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

      {/* Modal Tạo Order (Đã có quantity và color) */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Order</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateOrder}>
          <Modal.Body>
            {modalError && <Alert variant="danger">{modalError}</Alert>}

            <Form.Group className="mb-3" controlId="vehicleVariantSelect">
              <Form.Label>Vehicle Variant</Form.Label>
              <Form.Select value={selectedVariant} onChange={(e) => setSelectedVariant(e.target.value)} disabled={isVariantsLoading || variants.length === 0}>
                {isVariantsLoading ? (
                  <option>Loading variants...</option>
                ) : variants.length > 0 ? (
                  variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} {v.modelName ? `(Model: ${v.modelName})` : ""}
                    </option>
                  ))
                ) : (
                  <option>No variants found</option>
                )}
              </Form.Select>
            </Form.Group>

            {/* Inventory availability info */}
            <div className="mb-2">
              {isInventoryLoading ? (
                <small className="text-muted">Checking inventory...</small>
              ) : inventoryCount === null ? (
                <small className="text-muted">Inventory: unavailable</small>
              ) : (
                <small className={`fw-semibold ${inventoryCount === 0 ? "text-danger" : "text-success"}`}>Available in inventory: {inventoryCount}</small>
              )}
            </div>

            <Form.Group className="mb-3" controlId="orderQuantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="number" value={orderQuantity} onChange={(e) => setOrderQuantity(e.target.value)} min="1" required />
              {inventoryCount !== null && (
                <div className="form-text mt-1">
                  {Number(orderQuantity) > inventoryCount ? (
                    <span className="text-warning">
                      <i className="bx bx-time-five me-1" />
                      Requested quantity exceeds available inventory. Your order may be delayed while we restock.
                    </span>
                  ) : (
                    <span className="text-muted">
                      You may order up to {inventoryCount} unit{inventoryCount > 1 ? "s" : ""}.
                    </span>
                  )}
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="orderColor">
              <Form.Label>Color</Form.Label>
              <Dropdown onSelect={(selected) => setOrderColor(selected)} className="w-100">
                <Dropdown.Toggle variant="outline-secondary" className="w-100 text-start" id="orderColorDropdown">
                  {orderColor ? renderColorBadge(orderColor) : "Select a color"}
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-100">
                  <Dropdown.Item eventKey="">Select a color</Dropdown.Item>
                  {["Red", "Blue", "Black", "White", "Silver", "Gray", "Green", "Yellow"].map((color) => (
                    <Dropdown.Item eventKey={color} key={color}>
                      {renderColorBadge(color)}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting || isInventoryLoading}>
              {isSubmitting ? <Spinner as="span" size="sm" /> : "Place Order"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modal Upload Biên lai (Không thay đổi) */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload Payment Document</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUploadPayment}>
          <Modal.Body>
            {modalError && <Alert variant="danger">{modalError}</Alert>}
            <p>
              Order ID: <strong>{orderToPay?.id?.substring(0, 8)}...</strong>
            </p>
            <Form.Group controlId="paymentFile">
              <Form.Label>Bank Transfer Receipt (PDF only)</Form.Label>
              <Form.Control type="file" accept=".pdf" onChange={handleFileChange} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? <Spinner as="span" size="sm" /> : "Upload"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default DealerOrdersPage;
