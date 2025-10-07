import React, { useState } from 'react';
import { Lock, CheckCircle2 } from 'lucide-react';
import NeumorphismButton from '../ui/NeumorphismButton';
import NeumorphismInput from '../ui/NeumorphismInput';

const ResetPasswordForm = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        onSubmit(formData);
    };

    return (
        <>
            <div className="flex justify-center mb-8">
                <div className="w-20 h-20 rounded-full flex items-center justify-center neu-icon">
                    <Lock className="w-8 h-8 text-blue-600" />
                </div>
            </div>

            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Your Password</h2>
                <p className="text-gray-500">
                    Enter and confirm your new password below
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password */}
                <NeumorphismInput icon={Lock}>
                    <input
                        type="password"
                        placeholder="New password"
                        value={formData.newPassword}
                        onChange={(e) =>
                            setFormData({ ...formData, newPassword: e.target.value })
                        }
                        className="flex-1 bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm font-medium"
                        required
                    />
                </NeumorphismInput>

                {/* Confirm Password */}
                <NeumorphismInput icon={CheckCircle2}>
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                            setFormData({ ...formData, confirmPassword: e.target.value })
                        }
                        className="flex-1 bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm font-medium"
                        required
                    />
                </NeumorphismInput>

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
