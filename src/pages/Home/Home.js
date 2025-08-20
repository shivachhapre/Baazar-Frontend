import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to E-Store</h1>
          <p>Discover amazing products at unbeatable prices</p>
          <Link to="/products" className="cta-button">
            Shop Now
          </Link>
        </div>
      </section>
      
      <section className="features">
        <div className="container">
          <h2>Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature">
              <h3>🚚 Free Shipping</h3>
              <p>Free delivery on orders over $50</p>
            </div>
            <div className="feature">
              <h3>🔒 Secure Payment</h3>
              <p>Your payment information is safe with us</p>
            </div>
            <div className="feature">
              <h3>📞 24/7 Support</h3>
              <p>Customer support available around the clock</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;