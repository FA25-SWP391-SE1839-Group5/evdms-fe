import { useState } from "react";
import "../asset/styles/neumorphism.css";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";
import LoginAvatar from "../components/auth/LoginAvatar";
import LoginForm from "../components/auth/LoginForm";
import SuccessMessage from "../components/auth/SuccessMessage";
import BackgroundElements from "../components/common/BackgroundElements";
import BrandHeader from "../components/common/BrandHeader";
import NeumorphismCard from "../components/ui/NeumorphismCard";
import { saveLoginToken, sendResetPasswordLink, validateLogin } from "../services/authService";
import { decodeJwt } from "../utils/jwt";

const LoginPage = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [forgotMessage, setForgotMessage] = useState("");

  // Handle main login
  const handleLogin = async (formData) => {
    setIsLoading(true);
    setLoginError("");

    try {
      // API returns: { accessToken, ... }
      const userData = await validateLogin(formData.email, formData.password);

      // Save token to localStorage
      saveLoginToken(userData);

      // Decode JWT to get role and other info
      const jwtPayload = decodeJwt(userData.accessToken);
      console.log("LoginPage - JWT Payload:", jwtPayload);

      // Normalize role from JWT (could be "EvmStaff", "evm_staff", etc.)
      const rawRole = jwtPayload.role || jwtPayload.Role || jwtPayload.ROLE;
      console.log("LoginPage - Raw role from JWT:", rawRole);

      // Normalize: "EvmStaff" -> "evm_staff"
      const normalizedRole = rawRole
        ? rawRole
            .replace(/([A-Z])/g, "_$1")
            .toLowerCase()
            .replace(/^_/, "")
        : undefined;

      console.log("LoginPage - Normalized role:", normalizedRole);

      const user = {
        id: userData.id,
        name: userData.fullName,
        email: userData.email,
        role: normalizedRole,
        dealerId: jwtPayload.dealerId || jwtPayload.dealerID || undefined,
      };

      console.log("LoginPage - User object to send:", user);

      if (!user.role) {
        setLoginError("No user role found in token. Cannot redirect.");
        setIsLoading(false);
        return;
      }

      setUserRole(user);
      setShowSuccess(true);

      // Delay redirect để show success message
      setTimeout(() => {
        onLoginSuccess(user);
      }, 1500);
    } catch (error) {
      setLoginError(error.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async (data) => {
    if (!data.email) {
      setLoginError("Please enter your email to reset password");
      return;
    }

    setIsLoading(true);
    setLoginError("");
    setForgotMessage("");

    try {
      await sendResetPasswordLink(data.email, data.method);
      setForgotMessage("✅ Password reset link has been sent! Please check your email.");
      setTimeout(() => {
        setShowForgotPassword(false);
      }, 3000);
    } catch (e) {
      setLoginError(e.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden"
      style={{
        background: "#e0e5ec",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <BackgroundElements />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex items-center min-h-screen">
          {/* Left Side - Logo and Description */}
          <div className="hidden lg:flex lg:w-1/2 lg:pr-12 flex-col">
            <BrandHeader />
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="w-full" style={{ maxWidth: "420px" }}>
              {/* Main Card */}
              <NeumorphismCard>
                {!showSuccess ? (
                  <>
                    {showForgotPassword ? (
                      <div className="flex flex-col items-center">
                        <ForgotPasswordForm onSubmit={handleForgotPassword} onBack={() => setShowForgotPassword(false)} isLoading={isLoading} />
                        {forgotMessage && <p className="text-green-600 text-sm mt-4 text-center">{forgotMessage}</p>}
                        {loginError && <p className="text-red-500 text-sm mt-4 text-center">{loginError}</p>}
                      </div>
                    ) : (
                      <>
                        <LoginAvatar />

                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back</h2>
                          <p className="text-gray-500">Please sign in to continue</p>
                        </div>

                        <LoginForm onSubmit={handleLogin} onForgotPassword={() => setShowForgotPassword(true)} isLoading={isLoading} loginError={loginError} />
                      </>
                    )}
                  </>
                ) : (
                  <SuccessMessage userName={userRole?.name} userRole={userRole?.role} />
                )}
              </NeumorphismCard>

              {/* Bottom Info */}
              <div className="text-center mt-8 space-y-2">
                <p className="text-xs text-gray-400">© {new Date().getFullYear()} EVDMS - Electric Vehicle Dealer Management System</p>
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    Privacy Policy
                  </a>
                  <span>•</span>
                  <a href="#" className="hover:text-blue-500 transition-colors">
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
