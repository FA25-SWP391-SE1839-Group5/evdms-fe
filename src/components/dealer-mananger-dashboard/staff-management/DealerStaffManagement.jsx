// src/pages/DealerStaffManagement.jsx
import React, { useState, useEffect } from 'react';
import { getAllUsers, createUser, updateUser, deleteUser } from '../services/userService';
import { getCurrentUser } from '../services/authService'; 

const DealerStaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State cho modal (sẽ tạo sau)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const manager = getCurrentUser(); // Lấy thông tin manager đã login

  // Hàm fetch dữ liệu
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers(); 
      setStaffList(response.data.items);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Tải danh sách khi component mount
  useEffect(() => {
    fetchStaff();
  }, []);

  // ... (Các hàm handle Add, Edit, Delete sẽ ở đây) ...

  if (loading) return <div>Loading staff...</div>;
  if (error) return <div className="text-danger">Error: {error}</div>;

  return (
    <div>
      <h4 className="fw-bold py-3 mb-4">Staff Management</h4>
      
      <button 
        className="btn btn-primary mb-3"
        onClick={() => setIsAddModalOpen(true)}
      >
        Add New Staff
      </button>

      {/* 1. HIỂN THỊ DANH SÁCH (Read) */}
      <div className="card">
        <h5 className="card-header">Staff List</h5>
        <div className="table-responsive text-nowrap">
          <table className="table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="table-border-bottom-0">
              {staffList.map(user => (
                <tr key={user.id}>
                  <td><strong>{user.fullName}</strong></td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={`badge bg-label-${user.isActive ? 'success' : 'warning'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    {/* 3. NÚT Update / 4. NÚT Delete */}
                    <button className="btn btn-sm btn-info me-2">Edit</button>
                    <button className="btn btn-sm btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* 2. MODAL TẠO MỚI (Create) */}
      {/* {isAddModalOpen && (
        <AddStaffModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={fetchStaff} // Tải lại danh sách sau khi tạo
          manager={manager}
        />
      )} */}
    </div>
  );
};

export default DealerStaffManagement;