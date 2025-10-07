import React, { useState } from "react";
import ResetPasswordForm from "../components/auth/ResetPasswordForm";
import { resetPassword } from "../services/authService";

const ResetPasswordPage = () => {
  const token = new URLSearchParams(window.location.search).get("token");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async ({ newPassword, confirmPassword }) => {
    if (!token) {
      setMessage("❌ Invalid or expired reset link.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, newPassword, confirmPassword); // ✅ token gửi qua đây
      setMessage("✅ Password reset successfully! Redirecting...");
      setTimeout(() => (window.location.href = "/login"), 2500);
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full">
        <ResetPasswordForm onSubmit={handleSubmit} isLoading={loading} />
        {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
