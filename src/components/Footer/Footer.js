import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-sections">
            
            {/* Company Info */}
            <div className="footer-section">
              <h3 className="footer-title">E-Store</h3>
              <p className="footer-description">
                Your one-stop destination for all your shopping needs. 
                Quality products at unbeatable prices with exceptional customer service.
              </p>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <span className="social-icon">📘</span>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <span className="social-icon">🐦</span>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <span className="social-icon">📷</span>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <span className="social-icon">💼</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/products">All Products</Link></li>
                <li><Link to="/products?category=electronics">Electronics</Link></li>
                <li><Link to="/products?category=clothing">Clothing</Link></li>
                <li><Link to="/products?category=books">Books</Link></li>
                <li><Link to="/products?featured=true">Featured Products</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div className="footer-section">
              <h4 className="footer-heading">Customer Service</h4>
              <ul className="footer-links">
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/support">Help & Support</Link></li>
                <li><Link to="/shipping">Shipping Info</Link></li>
                <li><Link to="/returns">Returns & Exchanges</Link></li>
                <li><Link to="/size-guide">Size Guide</Link></li>
                <li><Link to="/track-order">Track Your Order</Link></li>
              </ul>
            </div>

            {/* Account */}
            <div className="footer-section">
              <h4 className="footer-heading">My Account</h4>
              <ul className="footer-links">
                <li><Link to="/login">Sign In</Link></li>
                <li><Link to="/register">Create Account</Link></li>
                <li><Link to="/profile">My Profile</Link></li>
                <li><Link to="/cart">Shopping Cart</Link></li>
                <li><Link to="/profile">Order History</Link></li>
                <li><Link to="/profile">Wishlist</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="footer-section">
              <h4 className="footer-heading">Newsletter</h4>
              <p className="newsletter-text">
                Subscribe to get updates about new products and exclusive offers.
              </p>
              <div className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter-input"
                />
                <button className="newsletter-btn" type="button">
                  Subscribe
                </button>
              </div>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <span>support@estore.com</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <span>123 Shopping St, City, State 12345</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <div className="footer-info">
                <p className="copyright">
                  &copy; {currentYear} E-Store. All rights reserved.
                </p>
                <div className="footer-legal">
                  <Link to="/privacy-policy">Privacy Policy</Link>
                  <Link to="/terms-of-service">Terms of Service</Link>
                  <Link to="/cookies-policy">Cookies Policy</Link>
                  <Link to="/accessibility">Accessibility</Link>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="payment-methods">
                <span className="payment-text">We Accept:</span>
                <div className="payment-icons">
                  <span className="payment-icon" title="Visa">💳</span>
                  <span className="payment-icon" title="Mastercard">💳</span>
                  <span className="payment-icon" title="PayPal">💰</span>
                  <span className="payment-icon" title="American Express">💳</span>
                  <span className="payment-icon" title="Apple Pay">📱</span>
                  <span className="payment-icon" title="Google Pay">📱</span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="trust-badges">
              <div className="trust-badge">
                <span className="trust-icon">🔒</span>
                <div className="trust-text">
                  <strong>Secure Shopping</strong>
                  <small>SSL Protected</small>
                </div>
              </div>
              <div className="trust-badge">
                <span className="trust-icon">🚚</span>
                <div className="trust-text">
                  <strong>Free Shipping</strong>
                  <small>Orders over $50</small>
                </div>
              </div>
              <div className="trust-badge">
                <span className="trust-icon">↩️</span>
                <div className="trust-text">
                  <strong>Easy Returns</strong>
                  <small>30-Day Policy</small>
                </div>
              </div>
              <div className="trust-badge">
                <span className="trust-icon">🏆</span>
                <div className="trust-text">
                  <strong>Quality Guarantee</strong>
                  <small>Premium Products</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;