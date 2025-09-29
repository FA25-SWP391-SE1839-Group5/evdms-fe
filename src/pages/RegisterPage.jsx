import { useState } from 'react';
import './RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    day: '',
    month: '',
    year: '',
    gender: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Here you would typically call your API
      console.log('Register attempt:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Handle successful registration
      alert('Registration successful!');
      
    } catch (error) {
      console.error('Register error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    alert('Navigate to login page');
  };

  // Generate day options (1-31)
  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);
  
  // Generate year options (current year - 100 to current year)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  return (
    <div className="register-container">
      <div className="register-content">
        <div className="register-card">
          <div className="register-header">
            <h1 className="register-title">Create New Account</h1>
            <p className="register-subtitle">It's quick and easy.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="register-form">
            {/* Name fields */}
            <div className="name-group">
              <div className="input-group">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="input-group">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Birth date */}
            <div className="birth-section">
              <label className="birth-label">
                Date of birth
                <span className="info-icon">?</span>
              </label>
              
              <div className="birth-group">
                <select
                  name="day"
                  value={formData.day}
                  onChange={handleInputChange}
                  className="birth-select"
                  required
                >
                  <option value="">Day</option>
                  {dayOptions.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                
                <select
                  name="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  className="birth-select"
                  required
                >
                  <option value="">Month</option>
                  {months.map(month => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
                
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="birth-select"
                  required
                >
                  <option value="">Year</option>
                  {yearOptions.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Gender */}
            <div className="gender-section">
              <label className="gender-label">
                Gender
                <span className="info-icon">?</span>
              </label>
              
              <div className="gender-group">
                <label className="gender-option">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="gender-text">Female</span>
                </label>
                
                <label className="gender-option">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="gender-text">Male</span>
                </label>
                
                <label className="gender-option">
                  <input
                    type="radio"
                    name="gender"
                    value="custom"
                    checked={formData.gender === 'custom'}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="gender-text">Custom</span>
                </label>
              </div>
            </div>

            {/* Email */}
            <div className="input-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Mobile number or email"
                disabled={isLoading}
                required
              />
            </div>
            
            {/* Password */}
            <div className="input-group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="New password"
                disabled={isLoading}
                required
              />
            </div>
            
            {/* Sign up button */}
            <button 
              type="submit" 
              className="signup-button"
              disabled={isLoading}
            >
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>

          {/* Already have account */}
          <div className="login-link">
            <a href="#" onClick={handleLogin}>Already have an account?</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;