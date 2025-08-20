import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import './ProductList.css';

const fetchProducts = async ({ queryKey }) => {
  const [, filters] = queryKey;
  const params = new URLSearchParams();
  
  if (filters.category) params.append('category', filters.category);
  if (filters.search) params.append('search', filters.search);
  if (filters.minPrice) params.append('minPrice', filters.minPrice);
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
  params.append('page', filters.page);
  params.append('limit', filters.limit);

  const { data } = await axios.get(`http://localhost:5000/api/products?${params}`);
  return data;
};

const ProductList = () => {
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 12
  });

  const { data, isLoading, error, isError } = useQuery(
    ['products', filters],
    fetchProducts,
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  if (isLoading) {
    return (
      <div className="product-list-container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="product-list-container">
        <div className="error">
          Error loading products: {error.message}
        </div>
      </div>
    );
  }

  const { products = [], pagination = {} } = data || {};

  return (
    <div className="product-list-container">
        <h1>All Products</h1>
      <div className="container">
        
        {/* Filters */}
        <div className="filters">
          <div className="filter-group">
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="home">Home</option>
              <option value="sports">Sports</option>
              <option value="beauty">Beauty</option>
              <option value="toys">Toys</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="filter-group">
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="price-input"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="price-input"
            />
          </div>

          <div className="filter-group">
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleFilterChange('sortBy', sortBy);
                handleFilterChange('sortOrder', sortOrder);
              }}
              className="filter-select"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="results-summary">
          <p>
            Showing {products.length} of {pagination.totalProducts || 0} products
            {filters.search && ` for "${filters.search}"`}
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard 
                key={product._id} 
                product={{
                  ...product,
                  id: product._id,
                  image: product.images?.[0]?.url || '/placeholder-image.jpg'
                }} 
              />
            ))}
          </div>
        ) : (
          <div className="no-products">
            <p>No products found matching your criteria.</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={!pagination.hasPrev}
              className="pagination-btn"
            >
              Previous
            </button>
            
            <span className="pagination-info">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={!pagination.hasNext}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;