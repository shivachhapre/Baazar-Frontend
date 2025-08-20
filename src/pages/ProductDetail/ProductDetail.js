import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import './ProductDetail.css';

const fetchProduct = async (productId) => {
  const { data } = await axios.get(`http://localhost:5000/api/products/${productId}`);
  return data;
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading, error, isError } = useQuery(
    ['product', id],
    () => fetchProduct(id),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      id: product._id,
      image: product.images?.[0]?.url || '/placeholder-image.jpg',
      quantity
    };
    addToCart(cartItem, quantity);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  if (isLoading) {
    return (
      <div className="product-detail-container">
        <div className="loading">Loading product details...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="product-detail-container">
        <div className="error">
          Error loading product: {error.message}
          <button onClick={() => navigate('/products')} className="back-btn">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-container">
        <div className="error">
          Product not found
          <button onClick={() => navigate('/products')} className="back-btn">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const images = product.images || [{ url: '/placeholder-image.jpg', alt: product.name }];

  return (
    <div className="product-detail-container">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>

        <div className="product-detail">
          {/* Image Gallery */}
          <div className="product-images">
            <div className="main-image">
              <img 
                src={images[selectedImage]?.url || '/placeholder-image.jpg'} 
                alt={product.name}
              />
            </div>
            {images.length > 1 && (
              <div className="image-thumbnails">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={`${product.name} ${index + 1}`}
                    className={selectedImage === index ? 'active' : ''}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="breadcrumb">
              <span>{product.category}</span>
              {product.subcategory && <span> / {product.subcategory}</span>}
            </div>

            <h1>{product.name}</h1>
            
            <div className="rating">
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span 
                    key={star} 
                    className={star <= Math.round(product.averageRating) ? 'star filled' : 'star'}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="rating-count">
                ({product.totalReviews} reviews)
              </span>
            </div>

            <div className="price">
              <span className="current-price">${product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="original-price">${product.originalPrice}</span>
              )}
            </div>

            <p className="description">{product.description}</p>

            {/* Product Details */}
            <div className="product-details">
              {product.brand && (
                <div className="detail-item">
                  <strong>Brand:</strong> {product.brand}
                </div>
              )}
              <div className="detail-item">
                <strong>SKU:</strong> {product.sku}
              </div>
              <div className="detail-item">
                <strong>Availability:</strong> 
                <span className={product.inventory?.quantity > 0 ? 'in-stock' : 'out-of-stock'}>
                  {product.inventory?.quantity > 0 ? 
                    `${product.inventory.quantity} in stock` : 
                    'Out of stock'
                  }
                </span>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="product-actions">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={product.inventory?.quantity || 99}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="quantity-input"
                  />
                  <button 
                    onClick={() => setQuantity(Math.min(product.inventory?.quantity || 99, quantity + 1))}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="action-buttons">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inventory?.quantity}
                  className="add-to-cart-btn"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!product.inventory?.quantity}
                  className="buy-now-btn"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="product-tags">
                <strong>Tags:</strong>
                {product.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="reviews-section">
            <h3>Customer Reviews</h3>
            <div className="reviews">
              {product.reviews.map((review) => (
                <div key={review._id} className="review">
                  <div className="review-header">
                    <div className="reviewer-name">{review.user?.name || 'Anonymous'}</div>
                    <div className="review-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span 
                          key={star} 
                          className={star <= review.rating ? 'star filled' : 'star'}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <div className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="review-comment">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;