// src/components/DealerOrders/DealerOrdersPage.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Table,
  Spinner,
  Alert,
  Modal,
  Form,
  Badge,
  Row,
  Col,
  Dropdown
} from "react-bootstrap";
// Đảm bảo các đường dẫn service này là chính xác
import { getAllDealerOrders, createDealerOrder } from "../../../services/dealerOrderService";
import { getAllVehicleVariants } from "../../../services/vehicleVariantService";
import { uploadDealerPaymentDocument } from "../../../services/dealerService";



const DealerOrdersPage = () => {
  // State chính
  const [orders, setOrders] = useState([]); // Khởi tạo là mảng rỗng
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // State cho Modal Tạo Order (giữ nguyên từ lần trước)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState("");
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderColor, setOrderColor] = useState("");

  // State cho Modal Upload Biên lai
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [orderToPay, setOrderToPay] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // State chung
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState(null);

  // --- 1. Tải Dữ liệu ---
  
  // ******** ĐÂY LÀ PHẦN SỬA LỖI ********
  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 'response' là object mà API trả về (ví dụ: { success: true, data: { items: [...] } })
      const response = await getAllDealerOrders(); 
      
      // Lấy mảng data. Giả sử mảng nằm trong response.data.items
      // Hoặc có thể nằm trong response.data (nếu API trả về { success: true, data: [...] })
      const dataArray = response?.data?.items || response?.data || [];

      // Lớp bảo vệ quan trọng: Chỉ set state nếu nó THỰC SỰ là một mảng
      if (Array.isArray(dataArray)) {
        setOrders(dataArray);
      } else {
        // Nếu 'response' không phải là mảng, set mảng rỗng để tránh crash
        console.error("fetchOrders Error: Dữ liệu trả về không phải là mảng!", response);
        setOrders([]); 
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  // ***************************************


  useEffect(() => {
    fetchOrders();
  }, []); // Tải khi component mount

  // --- 2. Xử lý Modal Tạo Order ---
  // (Giữ nguyên logic từ lần trước, đã bao gồm quantity và color)
  const handleShowCreateModal = async () => {
    setShowCreateModal(true);
    setModalError(null);
    setSelectedVariant("");
    setOrderQuantity(1);
    setOrderColor("");
    try {
      const data = await getAllVehicleVariants();
      setVariants(data);
      if (data.length > 0) {
        setSelectedVariant(data[0].id);
      }
    } catch (err) {
      setModalError(err.message);
    }
  };

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
      case "Pending": return <em>Awaiting EVM Review</em>;
      case "AwaitingPaymentConfirmation": return <em>Payment Under Review</em>;
      default: return null;
    }
  };

  // --- 5. Main Render ---
  // (Phần JSX này không đổi, nhưng giờ nó sẽ nhận 'orders' là một mảng)
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
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Vehicle Variant</th>
                <th>Quantity</th>
                <th>Color</th>
                <th>Created Date</th>
                <th>Status</th>
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
              ) : orders.length > 0 ? ( // Chỗ này sẽ không crash nữa
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id ? order.id.substring(0, 8) : "N/A"}...</td>
                    <td>{order.variantName || "N/A"}</td>
                    <td>{order.quantity || 1}</td>
                    <td>{order.color || "N/A"}</td>
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
              <Form.Select
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value)}
                disabled={variants.length === 0}
              >
                {variants.length > 0 ? (
                  variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} (Model: {v.modelName})
                    </option>
                  ))
                ) : (
                  <option>Loading variants...</option>
                )}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="orderQuantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(e.target.value)}
                min="1"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="orderColor">
              <Form.Label>Color</Form.Label>
              <Form.Control
                type="text"
                value={orderColor}
                onChange={(e) => setOrderColor(e.target.value)}
                placeholder="e.g., Red, Blue, Black"
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
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
              <Form.Control
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                required
              />
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