import React from 'react';
import { User } from 'lucide-react';

const LoginAvatar = () => {
  return (
    <div className="flex justify-center mb-8">
      <div className="w-20 h-20 rounded-full flex items-center justify-center neu-icon">
        <User className="w-8 h-8 text-gray-600" />
      </div>
    </div>
  );
};

export default LoginAvatar;