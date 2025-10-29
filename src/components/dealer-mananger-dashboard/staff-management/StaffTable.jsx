import React from "react";
import { Table, Spinner, Button } from "react-bootstrap";

const StaffTable = ({ users, isLoading, onEdit, onDelete }) => {
  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
        <p>Đang tải danh sách...</p>
      </div>
    );
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>NAME</th>
          <th>Email</th>
          <th>ROLE</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.length > 0 ? (
          users.map((user) => (
            <tr key={user.id}>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {user.isActive ? (
                  <span className="badge bg-success">Active</span>
                ) : (
                  <span className="badge bg-danger">Inactive</span>
                )}
              </td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  className="me-2"
                  onClick={() => onEdit(user)}
                >
                  <i className="bx bx-edit"></i>
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(user)}
                >
                  <i className="bx bx-trash"></i>
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center">
              No staffs found
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default StaffTable;