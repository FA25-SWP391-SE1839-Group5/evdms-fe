import React, { useState } from 'react';
import { createUser } from '../services/userService'; //

const AddStaffModal = ({ onClose, onSuccess, manager }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!manager.dealerId) {
       setError("Critical Error: Manager's dealerId is missing. Cannot create user.");
       return;
    }

    try {
      const userData = {
        ...formData,
        role: "DealerStaff", 
        dealerId: manager.dealerId
      };
      
      await createUser(userData); //
      onSuccess(); // Tải lại danh sách
      onClose(); // Đóng modal
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    // Đây là markup cho một modal, bạn tự thay thế bằng component Modal của bạn
    <div className="modal-backdrop">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <h5>Add New Staff</h5>
          <input name="fullName" placeholder="Full Name" onChange={handleChange} />
          <input name="email" placeholder="Email" type="email" onChange={handleChange} />
          <input name="password" placeholder="Password" type="password" onChange={handleChange} />
          {error && <div className="text-danger">{error}</div>}
          <button type="submit">Create User</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddStaffModal;