import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import axios from 'axios';
import { API_BASE_URL, useAuth } from '../../context/AuthContext';
import './Auth.css';

const registerUser = async (userData) => {
  const { data } = await axios.post(`${API_BASE_URL}/api/auth/register`, userData);
  return data;
};

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors }, setError, watch } = useForm();

  const from = location.state?.from || '/';
  const password = watch('password');

  const registerMutation = useMutation(registerUser, {
    onSuccess: (data) => {
      login(data.user, data.token);
      navigate(from, { replace: true });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Registration failed';
      setError('root', { message });
    }
  });

  const onSubmit = (data) => {
    const { confirmPassword, agreeToTerms, ...userData } = data;
    registerMutation.mutate(userData);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join us and start shopping</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {errors.root && (
            <div className="error-banner">
              {errors.root.message}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              {...register('name', {
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                },
                maxLength: {
                  value: 50,
                  message: 'Name cannot exceed 50 characters'
                }
              })}
              className={errors.name ? 'error' : ''}
              placeholder="Enter your full name"
              autoComplete="name"
            />
            {errors.name && (
              <span className="error-message">{errors.name.message}</span>
            )}
          </div>

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
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                  }
                })}
                className={errors.password ? 'error' : ''}
                placeholder="Create a password"
                autoComplete="new-password"
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
            <div className="password-requirements">
              <small>Password must contain:</small>
              <ul>
                <li>At least 6 characters</li>
                <li>One uppercase letter</li>
                <li>One lowercase letter</li>
                <li>One number</li>
              </ul>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match'
                })}
                className={errors.confirmPassword ? 'error' : ''}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                {...register('agreeToTerms', {
                  required: 'You must agree to the terms and conditions'
                })}
                className={errors.agreeToTerms ? 'error' : ''}
              />
              <span>
                I agree to the{' '}
                <Link to="/terms" target="_blank">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" target="_blank">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.agreeToTerms && (
              <span className="error-message">{errors.agreeToTerms.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input type="checkbox" {...register('newsletter')} />
              <span>
                Subscribe to our newsletter for updates and exclusive offers
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="auth-btn primary"
            disabled={registerMutation.isLoading}
          >
            {registerMutation.isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <div className="social-login">
          <button className="social-btn google" type="button">
            <span className="social-icon">🔍</span>
            Sign up with Google
          </button>
          <button className="social-btn facebook" type="button">
            <span className="social-icon">📘</span>
            Sign up with Facebook
          </button>
        </div>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" state={{ from }}>
              Sign in
            </Link>
          </p>
        </div>

        {/* Benefits of Creating Account */}
        <div className="signup-benefits">
          <h4>Why create an account?</h4>
          <ul>
            <li>💾 Save your favorite items</li>
            <li>🚀 Faster checkout</li>
            <li>📋 Track your orders</li>
            <li>🎁 Exclusive offers and discounts</li>
            <li>📧 Get personalized recommendations</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;