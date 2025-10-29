import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Spinner,
  Alert,
  Form,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import { getDealerStaffSales } from "../../services/reportService"; // <-- Điều chỉnh đường dẫn

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
  const fetchReport = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Chỉ gửi các filter
      const queryParams = {};
      if (filters.startDate) queryParams.startDate = filters.startDate;
      if (filters.endDate) queryParams.endDate = filters.endDate;

      const report = await getDealerStaffSales(queryParams);
      
      // Giả sử API trả về một mảng
      setData(report || []); 
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Tải dữ liệu lần đầu khi component được mount
  useEffect(() => {
    fetchReport();
  }, []); // Chỉ chạy 1 lần

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
          <p>Đang tải báo cáo...</p>
        </div>
      );
    }

    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }

    if (data.length === 0) {
      return (
        <p className="text-center text-muted">
          Không có dữ liệu hiệu suất để hiển thị.
        </p>
      );
    }

    // Render bảng dữ liệu
    return (
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Tên Nhân viên</th>
            <th>Số đơn hàng</th>
            <th>Tổng Doanh thu (VND)</th>
            {/* Cậu có thể thêm các cột khác mà API trả về */}
          </tr>
        </thead>
        <tbody>
          {data.map((staff, index) => (
            <tr key={staff.id || index}> {/* API nên trả về một ID duy nhất */}
              <td>{index + 1}</td>
              <td>{staff.staffName}</td>
              <td>{staff.salesCount}</td>
              <td>{staff.totalRevenue.toLocaleString("vi-VN")}</td>
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
                <Form.Label>Từ ngày</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="endDate">
                <Form.Label>Đến ngày</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                />
              </Form.Group>
            </Col>
            <Col md={4} className="d-grid">
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? <Spinner as="span" size="sm" /> : <i className="bx bx-filter-alt me-1"></i>}
                Lọc Báo cáo
              </Button>
            </Col>
          </Row>
        </Form>

        {/* === KẾT QUẢ === */}
        <div className="mt-4">
          {renderContent()}
        </div>
      </Card.Body>
    </Card>
  );
};

export default StaffPerformancePage;