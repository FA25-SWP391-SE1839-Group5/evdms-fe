import React, { useState, useEffect } from "react";
import { Card, Button, Alert, Pagination, Row, Col } from "react-bootstrap";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../../services/userService";

// Import các component con
import StaffTable from "./StaffTable";
import StaffFormModal from "./StaffFormModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const StaffManagement = () => {
  // State cho danh sách
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // State cho phân trang
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
  });

  // State cho Modal Thêm/Sửa
  const [showFormModal, setShowFormModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // null = Thêm, object = Sửa

  // State cho Modal Xóa
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // --- 1. Tải Dữ liệu & Phân trang ---
  const fetchUsers = async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllUsers(page, pagination.pageSize);
      setUsers(data.items || []);
      setPagination({
        page: data.page || page,
        pageSize: data.pageSize || pagination.pageSize,
        totalCount: data.totalCount || 0,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, []); // Chỉ chạy 1 lần

  const handlePageChange = (pageNumber) => {
    fetchUsers(pageNumber);
  };

  const totalPages = Math.ceil(pagination.totalCount / pagination.pageSize);

  // --- 2. Xử lý Modal Thêm/Sửa ---
  const handleShowAddModal = () => {
    setCurrentUser(null);
    setModalError(null);
    setShowFormModal(true);
  };

  const handleShowEditModal = (user) => {
    setCurrentUser(user);
    setModalError(null);
    setShowFormModal(true);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
    setCurrentUser(null);
  };

  const handleSubmitForm = async (formData) => {
    setIsSaving(true);
    setModalError(null);
    try {
      if (currentUser) {
        // Chế độ Sửa (Update)
        await updateUser(currentUser.id, formData);
      } else {
        // Chế độ Thêm mới (Create)
        // TODO: Gắn dealerId của manager đang đăng nhập vào đây
        // const loggedInManagerDealerId = "your-current-dealer-id";
        // await createUser({ ...formData, dealerId: loggedInManagerDealerId });
        await createUser(formData);
      }
      handleCloseFormModal();
      fetchUsers(pagination.page); // Tải lại trang hiện tại
    } catch (err) {
      setModalError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // --- 3. Xử lý Modal Xóa ---
  const handleShowDeleteModal = (user) => {
    setUserToDelete(user);
    setModalError(null); // Clear lỗi cũ (nếu có) từ modal form
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setUserToDelete(null);
    setShowDeleteModal(false);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.id);
      handleCloseDeleteModal();
      fetchUsers(pagination.page); // Tải lại
    } catch (err) {
      // Hiển thị lỗi ngay trên modal xóa
      setError(err.message); // Hoặc set state lỗi riêng cho modal xóa
      handleCloseDeleteModal(); // Đóng modal sau khi báo lỗi
    }
  };

  // --- 4. Render ---
  return (
    <>
      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">Staff Management</h5>
            </Col>
            <Col className="text-end">
              <Button variant="primary" onClick={handleShowAddModal}>
                <i className="bx bx-plus me-1"></i> Add Staff
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <StaffTable
            users={users}
            isLoading={isLoading}
            onEdit={handleShowEditModal}
            onDelete={handleShowDeleteModal}
          />

          {totalPages > 1 && (
            <Pagination className="justify-content-end">
              <Pagination.Prev
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              />
              {[...Array(totalPages).keys()].map((num) => (
                <Pagination.Item
                  key={num + 1}
                  active={num + 1 === pagination.page}
                  onClick={() => handlePageChange(num + 1)}
                >
                  {num + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === totalPages}
              />
            </Pagination>
          )}
        </Card.Body>
      </Card>

      {/* Modal Thêm/Sửa */}
      <StaffFormModal
        show={showFormModal}
        onHide={handleCloseFormModal}
        onSubmit={handleSubmitForm}
        currentUser={currentUser}
        isSaving={isSaving}
        modalError={modalError}
      />

      {/* Modal Xác nhận Xóa */}
      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận Xóa"
        body={
          <>
            Bạn có chắc chắn muốn xóa nhân viên{" "}
            <strong>{userToDelete?.fullName}</strong>?
            <br />
            Hành động này không thể hoàn tác.
          </>
        }
      />
    </>
  );
};

export default StaffManagement;