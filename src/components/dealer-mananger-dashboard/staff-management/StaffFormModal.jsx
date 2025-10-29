// src/components/StaffManagement/StaffFormModal.js
import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Spinner,
  Alert,
} from "react-bootstrap";

const StaffFormModal = ({ show, onHide, onSubmit, currentUser, isSaving, modalError }) => {
  const [formData, setFormData] = useState({});

  // Cập nhật state của form khi `currentUser` thay đổi (khi mở modal Sửa)
  // hoặc reset form (khi mở modal Thêm)
  useEffect(() => {
    if (show) {
      if (currentUser) {
        // Chế độ Sửa: Nạp dữ liệu, password để trống
        setFormData({
          ...currentUser,
          password: "", 
        });
      } else {
        // Chế độ Thêm: Reset form
        setFormData({
          fullName: "",
          email: "",
          password: "",
          role: "DealerStaff",
          isActive: true,
        });
      }
    }
  }, [currentUser, show]); // Chạy lại khi mở modal hoặc khi user thay đổi

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Gửi state của form lên component cha
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {currentUser ? "Edit Staff" : "Add Staff"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {modalError && <Alert variant="danger">{modalError}</Alert>}
          <Form.Group className="mb-3" controlId="formFullName">
            <Form.Label>NAME</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={formData.fullName || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              placeholder={currentUser ? "Để trống nếu không đổi" : ""}
              required={!currentUser} // Bắt buộc nếu là user mới
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formRole">
            <Form.Label>Role</Form.Label>
            <Form.Select
              name="role"
              value={formData.role || "DealerStaff"}
              onChange={handleChange}
            >
              <option value="DealerStaff">Dealer Staff</option>
              {/* Thêm các role khác nếu cần */}
            </Form.Select>
          </Form.Group>
          <Form.Check
            type="switch"
            id="formIsActive"
            label="Active"
            name="isActive"
            checked={formData.isActive || false}
            onChange={handleChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? (
              <Spinner as="span" size="sm" />
            ) : (
              "Save"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default StaffFormModal;