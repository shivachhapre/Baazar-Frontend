import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Cart.css';

const Cart = () => {
  const {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems 
  } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="cart-container">
        <div className="container">
          <h1>Shopping Cart</h1>
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some products to your cart and they will appear here.</p>
            <Link to="/products" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="cart-container">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <span className="item-count">
            {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            <div className="cart-items-header">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span></span>
            </div>

            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-product">
                  <Link to={`/product/${item.id}`}>
                    <img 
                      src={item.image || '/placeholder-image.jpg'} 
                      alt={item.name}
                      className="item-image"
                    />
                  </Link>
                  <div className="item-info">
                    <Link to={`/product/${item.id}`} className="item-name">
                      {item.name}
                    </Link>
                    <p className="item-description">
                      {item.description?.substring(0, 100)}
                      {item.description?.length > 100 && '...'}
                    </p>
                    {item.brand && (
                      <p className="item-brand">Brand: {item.brand}</p>
                    )}
                  </div>
                </div>

                <div className="item-price">
                  ${item.price?.toFixed(2)}
                </div>

                <div className="item-quantity">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                      className="quantity-input"
                    />
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                <div className="item-actions">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="remove-btn"
                    title="Remove item"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}

            <div className="cart-actions">
              <Link to="/products" className="continue-shopping">
                ← Continue Shopping
              </Link>
              <button onClick={clearCart} className="clear-cart-btn">
                Clear Cart
              </button>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-line">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="summary-line">
              <span>Shipping:</span>
              <span>
                {shipping === 0 ? (
                  <span className="free-shipping">FREE</span>
                ) : (
                  `$${shipping.toFixed(2)}`
                )}
              </span>
            </div>

            {shipping > 0 && (
              <div className="shipping-notice">
                <small>Free shipping on orders over $50</small>
              </div>
            )}

            <div className="summary-line">
              <span>Tax:</span>
              <span>${tax.toFixed(2)}</span>
            </div>

            <div className="summary-line total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleCheckout}
              className="checkout-btn"
            >
              Proceed to Checkout
            </button>

            {/* Security badges */}
            <div className="security-badges">
              <div className="security-item">
                <span className="icon">🔒</span>
                <span>Secure Checkout</span>
              </div>
              <div className="security-item">
                <span className="icon">↩️</span>
                <span>30-Day Returns</span>
              </div>
            </div>

            {/* Payment methods */}
            <div className="payment-methods">
              <small>We accept:</small>
              <div className="payment-icons">
                💳 💰 🏦
              </div>
            </div>
          </div>
        </div>

        {/* Recently viewed or recommended products */}
        <div className="cart-recommendations">
          <h3>You might also like</h3>
          <p>Add recommended products here based on cart items</p>
        </div>
      </div>
    </div>
  );
};

export default Cart;