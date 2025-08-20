import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Header.css';
import Bazar_logo from '../../assets/Bazar_logo.png'; 

const Header = () => {
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <img src={Bazar_logo} alt="" />
        </Link>
        <div className='d-flex module_alignment'>
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
        </nav>

        <div className="header-actions">
          <Link to="/cart" className="cart-link">
            🛒 Cart ({getTotalItems()})
          </Link>
          
          {user ? (
            <div className="user-menu">
              <span>Welcome, {user.name}</span>
              <Link to="/profile">Profile</Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          )}
        </div>
        </div>
      </div>
    </header>
  );
};

export default Header;