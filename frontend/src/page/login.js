// src/components/Login.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/actions/authActions'; // Import login action
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
 const navigate=useNavigate()
  const { loading, error: loginError } = useSelector((state) => state.auth); // Get state from Redux

  const handleSubmit = async(e) => {
    e.preventDefault();
   await dispatch(loginUser(email, password)); 
    navigate('/contact')
  };

  return (
    <div className="login-container">
      <div>
        <img src="/images/quick_connect_logo.jpg" alt="Quick Connect Logo" className="image" />
      </div>
      <div className="login-box">
        <form onSubmit={handleSubmit} className="login-box">
          <h2>Sign-In</h2>

          {/* Email input */}
          <div className="input-group">
            <label htmlFor="email">Email or mobile phone number</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password input */}
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error || loginError ? <div className="error-message">{error || loginError}</div> : null}

          {/* Sign-in button */}
          <button type="submit" className="sign-in-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign-In'}
          </button>
        </form>

        {/* Forgot password link */}
        <div className="forgot-password">
          <Link to="/forgot-password">Forgot your password?</Link>
        </div>

        {/* Create account link */}
        <div>
          <Link to="/signup">
            <button className="new-account"> Create your account</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
