import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { API_BASE_URL, useAuth } from '../../context/AuthContext';
import './Checkout.css';

const createOrder = async (orderData) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.post(`${API_BASE_URL}/api/orders`, orderData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return data;
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart, getCartTotal } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      email: user?.email || '',
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ')[1] || '',
      phone: user?.phone || '',
    }
  });

  const orderMutation = useMutation(createOrder, {
    onSuccess: (data) => {
      clearCart();
      navigate('/profile', { 
        state: { message: 'Order placed successfully!', orderId: data.order._id }
      });
    },
    onError: (error) => {
      console.error('Order failed:', error);
      alert('Order failed. Please try again.');
    }
  });

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [isAuthenticated, navigate]);

  // Redirect to cart if empty
  React.useEffect(() => {
    if (cartItems?.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  if (!isAuthenticated || cartItems?.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const onSubmit = (data) => {
    const orderData = {
      items: cartItems?.map(item => ({
        product: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress: {
        street: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country || 'US'
      },
      billingAddress: data.sameAsShipping ? {
        street: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country || 'US'
      } : {
        street: data.billingAddress,
        city: data.billingCity,
        state: data.billingState,
        zipCode: data.billingZipCode,
        country: data.billingCountry || 'US'
      },
      paymentMethod: {
        type: paymentMethod,
        ...(paymentMethod === 'card' && {
          cardNumber: data.cardNumber,
          expiryDate: data.expiryDate,
          cvv: data.cvv,
          cardName: data.cardName
        })
      },
      totalAmount: total,
      shippingCost: shipping,
      taxAmount: tax
    };

    orderMutation.mutate(orderData);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="checkout-container">
      <div className="container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <div className="checkout-steps">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Shipping</div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Payment</div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Review</div>
          </div>
        </div>

        <div className="checkout-content">
          <div className="checkout-form">
            <form onSubmit={handleSubmit(onSubmit)}>
              
              {/* Step 1: Shipping Information */}
              {step === 1 && (
                <div className="checkout-step">
                  <h2>Shipping Information</h2>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name *</label>
                      <input
                        type="text"
                        {...register('firstName', { required: 'First name is required' })}
                        className={errors.firstName ? 'error' : ''}
                      />
                      {errors.firstName && <span className="error-message">{errors.firstName.message}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label>Last Name *</label>
                      <input
                        type="text"
                        {...register('lastName', { required: 'Last name is required' })}
                        className={errors.lastName ? 'error' : ''}
                      />
                      {errors.lastName && <span className="error-message">{errors.lastName.message}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-message">{errors.email.message}</span>}
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      {...register('phone')}
                    />
                  </div>

                  <div className="form-group">
                    <label>Address *</label>
                    <input
                      type="text"
                      {...register('address', { required: 'Address is required' })}
                      className={errors.address ? 'error' : ''}
                    />
                    {errors.address && <span className="error-message">{errors.address.message}</span>}
                  </div>

                  <div className="form-row">
                                        <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        {...register('city', { required: 'City is required' })}
                        className={errors.city ? 'error' : ''}
                      />
                      {errors.city && <span className="error-message">{errors.city.message}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label>State *</label>
                      <input
                        type="text"
                        {...register('state', { required: 'State is required' })}
                        className={errors.state ? 'error' : ''}
                      />
                      {errors.state && <span className="error-message">{errors.state.message}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label>ZIP Code *</label>
                      <input
                        type="text"
                        {...register('zipCode', { required: 'ZIP code is required' })}
                        className={errors.zipCode ? 'error' : ''}
                      />
                      {errors.zipCode && <span className="error-message">{errors.zipCode.message}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Country *</label>
                    <select
                      {...register('country', { required: 'Country is required' })}
                      className={errors.country ? 'error' : ''}
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="IN">India</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                    {errors.country && <span className="error-message">{errors.country.message}</span>}
                  </div>

                  <div className="step-actions">
                    <button type="button" onClick={nextStep} className="next-btn">
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Information */}
              {step === 2 && (
                <div className="checkout-step">
                  <h2>Payment Information</h2>
                  
                  <div className="payment-methods">
                    <div className="payment-method">
                      <input
                        type="radio"
                        id="card"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label htmlFor="card">Credit/Debit Card</label>
                    </div>
                    
                    <div className="payment-method">
                      <input
                        type="radio"
                        id="paypal"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label htmlFor="paypal">PayPal</label>
                    </div>
                    
                    <div className="payment-method">
                      <input
                        type="radio"
                        id="cod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label htmlFor="cod">Cash on Delivery</label>
                    </div>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="card-details">
                      <div className="form-group">
                        <label>Card Number *</label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          {...register('cardNumber', { 
                            required: paymentMethod === 'card' ? 'Card number is required' : false 
                          })}
                          className={errors.cardNumber ? 'error' : ''}
                        />
                        {errors.cardNumber && <span className="error-message">{errors.cardNumber.message}</span>}
                      </div>
                      
                      <div className="form-group">
                        <label>Cardholder Name *</label>
                        <input
                          type="text"
                          {...register('cardName', { 
                            required: paymentMethod === 'card' ? 'Cardholder name is required' : false 
                          })}
                          className={errors.cardName ? 'error' : ''}
                        />
                        {errors.cardName && <span className="error-message">{errors.cardName.message}</span>}
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label>Expiry Date *</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            {...register('expiryDate', { 
                              required: paymentMethod === 'card' ? 'Expiry date is required' : false 
                            })}
                            className={errors.expiryDate ? 'error' : ''}
                          />
                          {errors.expiryDate && <span className="error-message">{errors.expiryDate.message}</span>}
                        </div>
                        
                        <div className="form-group">
                          <label>CVV *</label>
                          <input
                            type="text"
                            placeholder="123"
                            {...register('cvv', { 
                              required: paymentMethod === 'card' ? 'CVV is required' : false 
                            })}
                            className={errors.cvv ? 'error' : ''}
                          />
                          {errors.cvv && <span className="error-message">{errors.cvv.message}</span>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Billing Address */}
                  <div className="billing-address">
                    <div className="form-group checkbox-group">
                      <input
                        type="checkbox"
                        id="sameAsShipping"
                        {...register('sameAsShipping')}
                        defaultChecked
                      />
                      <label htmlFor="sameAsShipping">
                        Billing address same as shipping address
                      </label>
                    </div>

                    {!watch('sameAsShipping') && (
                      <div className="billing-fields">
                        <h3>Billing Address</h3>
                        {/* Add billing address fields similar to shipping */}
                        <div className="form-group">
                          <label>Billing Address *</label>
                          <input
                            type="text"
                            {...register('billingAddress', { 
                              required: !watch('sameAsShipping') ? 'Billing address is required' : false 
                            })}
                          />
                        </div>
                        {/* Add more billing fields as needed */}
                      </div>
                    )}
                  </div>

                  <div className="step-actions">
                    <button type="button" onClick={prevStep} className="prev-btn">
                      Back to Shipping
                    </button>
                    <button type="button" onClick={nextStep} className="next-btn">
                      Review Order
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Order Review */}
              {step === 3 && (
                <div className="checkout-step">
                  <h2>Review Your Order</h2>
                  
                  <div className="order-review">
                    <div className="review-section">
                      <h3>Items</h3>
                      {cartItems?.map((item) => (
                        <div key={item.id} className="review-item">
                          <img src={item.image} alt={item.name} className="item-image" />
                          <div className="item-details">
                            <h4>{item.name}</h4>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: ${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="review-section">
                      <h3>Shipping Address</h3>
                      <p>
                        {watch('firstName')} {watch('lastName')}<br/>
                        {watch('address')}<br/>
                        {watch('city')}, {watch('state')} {watch('zipCode')}<br/>
                        {watch('country')}
                      </p>
                    </div>

                    <div className="review-section">
                      <h3>Payment Method</h3>
                      <p>
                        {paymentMethod === 'card' && 'Credit/Debit Card'}
                        {paymentMethod === 'paypal' && 'PayPal'}
                        {paymentMethod === 'cod' && 'Cash on Delivery'}
                      </p>
                    </div>
                  </div>

                  <div className="step-actions">
                    <button type="button" onClick={prevStep} className="prev-btn">
                      Back to Payment
                    </button>
                    <button 
                      type="submit" 
                      className="place-order-btn"
                      disabled={orderMutation.isLoading}
                    >
                      {orderMutation.isLoading ? 'Placing Order...' : 'Place Order'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-items">
              {cartItems?.map((item) => (
                <div key={item.id} className="summary-item">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">×{item.quantity}</span>
                  <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-line">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="summary-line">
                <span>Shipping:</span>
                <span>
                  {shipping === 0 ? 'FREE' : `${shipping.toFixed(2)}`}
                </span>
              </div>
              
              <div className="summary-line">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <div className="summary-line total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="security-notice">
              <div className="security-item">
                <span className="icon">🔒</span>
                <span>Your information is secure</span>
              </div>
              <div className="security-item">
                <span className="icon">↩️</span>
                <span>30-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;