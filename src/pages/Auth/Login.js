import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const loginUser = async (credentials) => {
   try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/auth/login`, credentials);
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      return { success: true, userData };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
};

const Login = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors }, setError } = useForm();

  const from = location.state?.from || '/';

  const loginMutation = useMutation(loginUser, {
    onSuccess: (data) => {
      setUser(data?.userData);
      navigate(from, { replace: true });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Login failed';
      setError('root', { message });
    }
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {errors.root && (
            <div className="error-banner">
              {errors.root.message}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address'
                }
              })}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
              autoComplete="email"
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                className={errors.password ? 'error' : ''}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" {...register('rememberMe')} />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="auth-btn primary"
            disabled={loginMutation.isLoading}
          >
            {loginMutation.isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="social-login">
          <button className="social-btn google" type="button">
            <span className="social-icon">🔍</span>
            Continue with Google
          </button>
          <button className="social-btn facebook" type="button">
            <span className="social-icon">📘</span>
            Continue with Facebook
          </button>
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" state={{ from }}>
              Create one
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="demo-credentials">
          <h4>Demo Credentials:</h4>
          <div className="demo-info">
            <p><strong>Regular User:</strong></p>
            <p>Email: user@example.com</p>
            <p>Password: password123</p>
          </div>
          <div className="demo-info">
            <p><strong>Admin User:</strong></p>
            <p>Email: admin@example.com</p>
            <p>Password: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;