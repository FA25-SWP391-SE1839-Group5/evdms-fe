import React, { useState, useEffect } from "react";
import ResetPasswordForm from "../components/auth/ResetPasswordForm";
import { resetPassword } from "../services/authService";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

const ResetPasswordPage = () => {
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success, error, warning
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Extract and hide token from URL
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const resetToken = urlParams.get("token");

  if (resetToken) {
    // Lưu vào sessionStorage
    sessionStorage.setItem("resetToken", resetToken);

    // Xóa token khỏi URL mà không reload trang
    window.history.replaceState({}, document.title, window.location.pathname);

    setToken(resetToken);
  } else {
    // Nếu không có token trong URL hoặc storage thì báo lỗi
    const storedToken = sessionStorage.getItem("resetToken");
    if (storedToken) {
      setToken(storedToken);
    } else {
      setMessageType("error");
      setMessage("Invalid reset link. Please request a new password reset.");
    }
  }
}, []);

  // Countdown for redirect
  useEffect(() => {
    if (messageType === "success" && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (messageType === "success" && countdown === 0) {
      // Clear URL params and redirect to login
      window.history.replaceState({}, document.title, window.location.pathname);
      window.location.href = "/";
    }
  }, [messageType, countdown]);

  const handleSubmit = async ({ newPassword, confirmPassword }) => {
    if (!token) {
      setMessageType("error");
      setMessage("Invalid or expired reset link.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessageType("error");
      setMessage("Passwords do not match!");
      return;
    }

    // Password strength validation
    if (newPassword.length < 8) {
      setMessageType("error");
      setMessage("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    setMessage("");
    
    try {
      const savedToken = token || sessionStorage.getItem("resetToken");
      await resetPassword(savedToken, newPassword, confirmPassword);
      setMessage("Password reset successfully! Redirecting to login...");
    } catch (err) {
      setMessageType("error");
      setMessage(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getIcon = () => {
    switch (messageType) {
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "error":
        return <XCircle className="w-6 h-6 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-6 h-6 text-amber-500" />;
      default:
        return null;
    }
  };

  const getMessageStyle = () => {
    switch (messageType) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-amber-50 border-amber-200 text-amber-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const handleRequestNewLink = () => {
    window.history.replaceState({}, document.title, window.location.pathname);
    window.location.href = "/";
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-5"
      style={{
        background: "#e0e5ec",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div 
        className="w-full max-w-md"
        style={{
          background: "#e0e5ec",
          borderRadius: "30px",
          padding: "50px 40px",
          boxShadow: "20px 20px 60px #bec3cf, -20px -20px 60px #ffffff",
        }}
      >
        {!token ? (
          // Invalid token message
          <div className="text-center">
            <div className="mb-6">
              <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Invalid Link</h2>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired.
            </p>
            <button
              onClick={handleRequestNewLink}
              className="inline-block px-6 py-3 rounded-xl font-semibold text-gray-700 transition-all"
              style={{
                background: "#e0e5ec",
                boxShadow: "8px 8px 20px #bec3cf, -8px -8px 20px #ffffff",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "12px 12px 30px #bec3cf, -12px -12px 30px #ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "8px 8px 20px #bec3cf, -8px -8px 20px #ffffff";
              }}
            >
              Back to Login
            </button>
          </div>
        ) : (
          <>
            <ResetPasswordForm onSubmit={handleSubmit} isLoading={loading} />
            
            {message && (
              <div 
                className={`mt-6 p-4 rounded-xl border-2 flex items-start space-x-3 ${getMessageStyle()}`}
                style={{
                  animation: messageType === "success" ? "successPulse 0.6s ease-out" : "fadeIn 0.3s ease-out"
                }}
              >
                {getIcon()}
                <div className="flex-1">
                  <p className="font-medium">{message}</p>
                  {messageType === "success" && (
                    <p className="text-sm mt-1">
                      Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
                    </p>
                  )}
                </div>
              </div>
            )}

            {messageType === "error" && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleRequestNewLink}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
                >
                  Request a new reset link
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;