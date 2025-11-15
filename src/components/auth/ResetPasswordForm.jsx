import { CheckCircle2, Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import NeumorphismButton from "../ui/NeumorphismButton";
import NeumorphismInput from "../ui/NeumorphismInput";

const ResetPasswordForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const handleOldPasswordChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, oldPassword: value });
    setErrors({ ...errors, oldPassword: value ? null : "Old password is required" });
  };
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({});

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: "Too weak", color: "bg-red-500" },
      { strength: 1, label: "Weak", color: "bg-orange-500" },
      { strength: 2, label: "Fair", color: "bg-yellow-500" },
      { strength: 3, label: "Good", color: "bg-blue-500" },
      { strength: 4, label: "Strong", color: "bg-green-500" },
      { strength: 5, label: "Very Strong", color: "bg-green-600" },
    ];

    return levels[strength];
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Must be at least 8 characters";
    if (!/(?=.*[a-z])/.test(password)) return "Must contain lowercase letter";
    if (!/(?=.*[A-Z])/.test(password)) return "Must contain uppercase letter";
    if (!/(?=.*\d)/.test(password)) return "Must contain a number";
    return null;
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, newPassword: value });

    const error = validatePassword(value);
    setErrors({ ...errors, newPassword: error });

    // Also check if confirm password matches
    if (formData.confirmPassword && value !== formData.confirmPassword) {
      setErrors({ ...errors, newPassword: error, confirmPassword: "Passwords do not match" });
    } else if (formData.confirmPassword) {
      setErrors({ ...errors, newPassword: error, confirmPassword: null });
    }
  };

  const handleConfirmChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, confirmPassword: value });

    if (value && value !== formData.newPassword) {
      setErrors({ ...errors, confirmPassword: "Passwords do not match" });
    } else {
      setErrors({ ...errors, confirmPassword: null });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.oldPassword) {
      setErrors({ ...errors, oldPassword: "Old password is required" });
      return;
    }
    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      setErrors({ ...errors, newPassword: passwordError });
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ ...errors, confirmPassword: "Passwords do not match" });
      return;
    }
    onSubmit(formData);
  };

  const strength = getPasswordStrength(formData.newPassword);

  return (
    <>
      <div className="flex justify-center mb-8">
        <div className="w-20 h-20 rounded-full flex items-center justify-center neu-icon">
          <Lock className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Your Password</h2>
        <p className="text-gray-500">Enter and confirm your new password below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Old Password */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Old Password</label>
          <NeumorphismInput icon={Lock} error={errors.oldPassword}>
            <input
              type="password"
              placeholder="Enter old password"
              value={formData.oldPassword}
              onChange={handleOldPasswordChange}
              className="flex-1 bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm font-medium"
              required
            />
          </NeumorphismInput>
        </div>
        {/* New Password */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">New Password</label>
          <NeumorphismInput icon={Lock} error={errors.newPassword}>
            <input
              type={showPassword.new ? "text" : "password"}
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handlePasswordChange}
              className="flex-1 bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm font-medium"
              required
            />
            <NeumorphismButton type="button" variant="toggle" onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}>
              {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </NeumorphismButton>
          </NeumorphismInput>
          {/* Password Strength Indicator */}
          {formData.newPassword && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Password strength:</span>
                <span className={`text-xs font-semibold ${strength.color.replace("bg-", "text-")}`}>{strength.label}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${(strength.strength / 5) * 100}%` }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Confirm Password</label>
          <NeumorphismInput icon={CheckCircle2} error={errors.confirmPassword}>
            <input
              type={showPassword.confirm ? "text" : "password"}
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleConfirmChange}
              className="flex-1 bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm font-medium"
              required
            />
            <NeumorphismButton type="button" variant="toggle" onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}>
              {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </NeumorphismButton>
          </NeumorphismInput>
        </div>

        {/* Requirements */}
        <div className="text-xs text-gray-600 space-y-1 pl-4">
          <p className="font-semibold">Password must contain:</p>
          <ul className="list-disc list-inside space-y-1">
            <li className={formData.newPassword.length >= 8 ? "text-green-600" : ""}>At least 8 characters</li>
            <li className={/[A-Z]/.test(formData.newPassword) ? "text-green-600" : ""}>One uppercase letter</li>
            <li className={/[a-z]/.test(formData.newPassword) ? "text-green-600" : ""}>One lowercase letter</li>
            <li className={/\d/.test(formData.newPassword) ? "text-green-600" : ""}>One number</li>
          </ul>
        </div>

        {/* Submit */}
        <NeumorphismButton type="submit" size="full" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="spinner"></div>
              <span>Resetting...</span>
            </>
          ) : (
            <>
              <span>Reset Password</span>
              <CheckCircle2 className="w-4 h-4" />
            </>
          )}
        </NeumorphismButton>
      </form>
    </>
  );
};

export default ResetPasswordForm;
