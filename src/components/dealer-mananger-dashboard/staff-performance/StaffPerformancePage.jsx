import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form, Row, Spinner, Table } from "react-bootstrap";
import { getDealerStaffSales } from "../../../services/reportService";
import { decodeJwt } from "../../../utils/jwt";

const StaffPerformancePage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // State cho bộ lọc ngày
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

  // Hàm gọi API
  const fetchReport = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Lấy dealerId từ JWT
      const token = localStorage.getItem("evdms_auth_token");
      const payload = decodeJwt(token);
      const dealerId = payload?.dealerId;

      // Chỉ gửi các filter
      const queryParams = {};
      if (filters.startDate) queryParams.startDate = filters.startDate;
      if (filters.endDate) queryParams.endDate = filters.endDate;
      if (dealerId) queryParams.dealerId = dealerId;

      const response = await getDealerStaffSales(queryParams);
      setData(response.data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Tải dữ liệu lần đầu khi component được mount
  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  // Xử lý thay đổi filter
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý khi bấm nút "Lọc"
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchReport(); // Gọi lại API với filter mới
  };

  // Hàm render nội dung chính
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading</p>
        </div>
      );
    }

    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }

    if (data.length === 0) {
      return <p className="text-center text-muted">No data.</p>;
    }

    // Render bảng dữ liệu
    return (
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Staff name</th>
            <th>Total Orders</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map((staff, index) => (
            <tr key={staff.staffId || index}>
              <td>{index + 1}</td>
              <td>{staff.staffName}</td>
              <td>{staff.totalOrders}</td>
              <td>{`$${(staff.totalAmount || 0).toLocaleString("en-US")}`}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">Staff Performance Report</h5>
      </Card.Header>
      <Card.Body>
        {/* === BỘ LỌC === */}
        <Form onSubmit={handleFilterSubmit} className="mb-4 p-3 bg-light rounded">
          <Row className="align-items-end g-3">
            <Col md={4}>
              <Form.Group controlId="startDate">
                <Form.Label>Start Date</Form.Label>
                <Form.Control type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="endDate">
                <Form.Label>End Date</Form.Label>
                <Form.Control type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
              </Form.Group>
            </Col>
            <Col md={4} className="d-grid">
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? <Spinner as="span" size="sm" /> : <i className="bx bx-filter-alt me-1"></i>}
                Filter
              </Button>
            </Col>
          </Row>
        </Form>

        {/* === KẾT QUẢ === */}
        <div className="mt-4">{renderContent()}</div>
      </Card.Body>
    </Card>
  );
};

export default StaffPerformancePage;
