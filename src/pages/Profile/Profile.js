import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

const fetchUserProfile = async () => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get("http://localhost:5000/api/users/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

const fetchUserOrders = async () => {
  const token = localStorage.getItem("token");
  const { data } = await axios.get("http://localhost:5000/api/orders", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

const updateUserProfile = async (profileData) => {
  const token = localStorage.getItem("token");
  const { data } = await axios.put(
    "http://localhost:5000/api/auth/profile",
    profileData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

const changePassword = async (passwordData) => {
  const token = localStorage.getItem("token");
  const { data } = await axios.put(
    "http://localhost:5000/api/auth/change-password",
    passwordData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

const Profile = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile");
  const [message, setMessage] = useState(location.state?.message || "");

  // Fetch user profile
  const { data: profileData, isLoading: profileLoading } = useQuery(
    "userProfile",
    fetchUserProfile,
    { staleTime: 5 * 60 * 1000 }
  );

  // Fetch user orders
  const { data: ordersData, isLoading: ordersLoading } = useQuery(
    "userOrders",
    fetchUserOrders,
    {
      staleTime: 2 * 60 * 1000,
      enabled: activeTab === "orders",
    }
  );

  // Profile form
  const profileForm = useForm({
    defaultValues: {
      name: profileData?.name || "",
      email: profileData?.email || "",
      phone: profileData?.phone || "",
      dateOfBirth: profileData?.dateOfBirth?.split("T")[0] || "",
      gender: profileData?.gender || "",
    },
  });

  // Password form
  const passwordForm = useForm();

  // Update profile mutation
  const updateProfileMutation = useMutation(updateUserProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries("userProfile");
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 5000);
    },
    onError: (error) => {
      setMessage(error.response?.data?.message || "Profile update failed");
      setTimeout(() => setMessage(""), 5000);
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation(changePassword, {
    onSuccess: () => {
      passwordForm.reset();
      setMessage("Password changed successfully!");
      setTimeout(() => setMessage(""), 5000);
    },
    onError: (error) => {
      setMessage(error.response?.data?.message || "Password change failed");
      setTimeout(() => setMessage(""), 5000);
    },
  });

  const onProfileSubmit = (data) => {
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = (data) => {
    changePasswordMutation.mutate(data);
  };

  const handleLogout = () => {
    logout();
  };

  // Clear message after some time
  React.useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Update form when profile data loads
  React.useEffect(() => {
    if (profileData) {
      profileForm.reset({
        name: profileData.name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        dateOfBirth: profileData.dateOfBirth?.split("T")[0] || "",
        gender: profileData.gender || "",
      });
    }
  }, [profileData, profileForm]);

  if (profileLoading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/users/upload-avatar`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        queryClient.invalidateQueries("userProfile");
        setMessage("Avatar updated successfully!");
        setTimeout(() => setMessage(""), 5000);
      })
      .catch((error) => {
        setMessage(error.response?.data?.message || "Avatar update failed");
        setTimeout(() => setMessage(""), 5000);
      });
  };

  return (
    <div className="profile-container">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            <img
              src={profileData?.avatar || "/default-avatar.png"}
              alt="Profile"
            />

            <label htmlFor="avatar-upload" className="change-avatar-btn">
              📷
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files[0]) {
                  handleImageUpload(e.target.files[0]);
                }
              }}
            />
          </div>
          <div className="profile-info">
            <h1>Welcome, {profileData?.name || user?.name}!</h1>
            <p>{profileData?.email}</p>
            <span className="user-role">
              {profileData?.role === "admin" ? "👑 Admin" : "👤 Customer"}
            </span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>

        {message && (
          <div
            className={`message ${
              message.includes("success") ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}

        <div className="profile-content">
          <div className="profile-tabs">
            <button
              className={`tab ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              👤 Profile
            </button>
            <button
              className={`tab ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              📦 Orders
            </button>
            <button
              className={`tab ${activeTab === "wishlist" ? "active" : ""}`}
              onClick={() => setActiveTab("wishlist")}
            >
              ❤️ Wishlist
            </button>
            <button
              className={`tab ${activeTab === "addresses" ? "active" : ""}`}
              onClick={() => setActiveTab("addresses")}
            >
              📍 Addresses
            </button>
            <button
              className={`tab ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              🔒 Security
            </button>
          </div>

          <div className="profile-tab-content">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="tab-panel">
                <h2>Personal Information</h2>
                <form
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  className="profile-form"
                >
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        {...profileForm.register("name", {
                          required: "Name is required",
                        })}
                        className={
                          profileForm.formState.errors.name ? "error" : ""
                        }
                      />
                      {profileForm.formState.errors.name && (
                        <span className="error-message">
                          {profileForm.formState.errors.name.message}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        {...profileForm.register("email")}
                        disabled
                        className="disabled"
                      />
                      <small>Email cannot be changed</small>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        {...profileForm.register("phone")}
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div className="form-group">
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        {...profileForm.register("dateOfBirth")}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Gender</label>
                    <select {...profileForm.register("gender")}>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="update-btn"
                    disabled={updateProfileMutation.isLoading}
                  >
                    {updateProfileMutation.isLoading
                      ? "Updating..."
                      : "Update Profile"}
                  </button>
                </form>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="tab-panel">
                <h2>Order History</h2>
                {ordersLoading ? (
                  <div className="loading">Loading orders...</div>
                ) : ordersData?.orders?.length > 0 ? (
                  <div className="orders-list">
                    {ordersData.orders.map((order) => (
                      <div key={order._id} className="order-card">
                        <div className="order-header">
                          <div className="order-info">
                            <h3>Order #{order._id.slice(-6)}</h3>
                            <p>
                              Placed on{" "}
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="order-status">
                            <span
                              className={`status ${order.status.toLowerCase()}`}
                            >
                              {order.status}
                            </span>
                            <span className="order-total">
                              ${order.totalAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className="order-items">
                          {order.items.map((item) => (
                            <div key={item._id} className="order-item">
                              <img
                                src={
                                  item.product?.images?.[0]?.url ||
                                  "/placeholder-image.jpg"
                                }
                                alt={item.product?.name}
                              />
                              <div className="item-details">
                                <h4>{item.product?.name || "Product name"}</h4>
                                <p>Quantity: {item.quantity}</p>
                                <p>Price: ${item.price.toFixed(2)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="order-actions">
                          <button className="btn-secondary">
                            View Details
                          </button>
                          {order.status === "delivered" && (
                            <button className="btn-primary">Reorder</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <h3>No orders yet</h3>
                    <p>When you place orders, they'll appear here.</p>
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="tab-panel">
                <h2>My Wishlist</h2>
                {profileData?.wishlist?.length > 0 ? (
                  <div className="wishlist-grid">
                    {profileData.wishlist.map((item) => (
                      <div key={item._id} className="wishlist-item">
                        <img
                          src={
                            item.images?.[0]?.url || "/placeholder-image.jpg"
                          }
                          alt={item.name}
                        />
                        <div className="item-info">
                          <h3>{item.name}</h3>
                          <p className="price">${item.price}</p>
                          <div className="item-actions">
                            <button className="btn-primary">Add to Cart</button>
                            <button className="btn-secondary">Remove</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">❤️</div>
                    <h3>Your wishlist is empty</h3>
                    <p>Save items you love for later.</p>
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="tab-panel">
                <h2>Saved Addresses</h2>
                {profileData?.address?.length > 0 ? (
                  <div className="addresses-list">
                    {profileData.address.map((addr, index) => (
                      <div key={index} className="address-card">
                        <div className="address-header">
                          <h3>{addr.type}</h3>
                          {addr.isDefault && (
                            <span className="default-badge">Default</span>
                          )}
                        </div>
                        <div className="address-details">
                          <p>{addr.street}</p>
                          <p>
                            {addr.city}, {addr.state} {addr.zipCode}
                          </p>
                          <p>{addr.country}</p>
                        </div>
                        <div className="address-actions">
                          <button className="btn-secondary">Edit</button>
                          <button className="btn-danger">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">📍</div>
                    <h3>No saved addresses</h3>
                    <p>Add addresses for faster checkout.</p>
                  </div>
                )}
                <button className="btn-primary add-address-btn">
                  + Add New Address
                </button>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="tab-panel">
                <h2>Security Settings</h2>

                <div className="security-section">
                  <h3>Change Password</h3>
                  <form
                    onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                    className="password-form"
                  >
                    <div className="form-group">
                      <label>Current Password</label>
                      <input
                        type="password"
                        {...passwordForm.register("currentPassword", {
                          required: "Current password is required",
                        })}
                        className={
                          passwordForm.formState.errors.currentPassword
                            ? "error"
                            : ""
                        }
                      />
                      {passwordForm.formState.errors.currentPassword && (
                        <span className="error-message">
                          {
                            passwordForm.formState.errors.currentPassword
                              .message
                          }
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>New Password</label>
                      <input
                        type="password"
                        {...passwordForm.register("newPassword", {
                          required: "New password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                          pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                            message:
                              "Password must contain uppercase, lowercase and number",
                          },
                        })}
                        className={
                          passwordForm.formState.errors.newPassword
                            ? "error"
                            : ""
                        }
                      />
                      {passwordForm.formState.errors.newPassword && (
                        <span className="error-message">
                          {passwordForm.formState.errors.newPassword.message}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        {...passwordForm.register("confirmNewPassword", {
                          required: "Please confirm new password",
                          validate: (value) =>
                            value === passwordForm.watch("newPassword") ||
                            "Passwords do not match",
                        })}
                        className={
                          passwordForm.formState.errors.confirmNewPassword
                            ? "error"
                            : ""
                        }
                      />
                      {passwordForm.formState.errors.confirmNewPassword && (
                        <span className="error-message">
                          {
                            passwordForm.formState.errors.confirmNewPassword
                              .message
                          }
                        </span>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="update-btn"
                      disabled={changePasswordMutation.isLoading}
                    >
                      {changePasswordMutation.isLoading
                        ? "Changing..."
                        : "Change Password"}
                    </button>
                  </form>
                </div>

                <div className="security-section">
                  <h3>Account Security</h3>
                  <div className="security-item">
                    <div className="security-info">
                      <h4>Two-Factor Authentication</h4>
                      <p>Add an extra layer of security to your account</p>
                    </div>
                    <button className="btn-secondary">Enable</button>
                  </div>

                  <div className="security-item">
                    <div className="security-info">
                      <h4>Login Sessions</h4>
                      <p>Manage devices that are logged into your account</p>
                    </div>
                    <button className="btn-secondary">Manage</button>
                  </div>

                  <div className="security-item danger">
                    <div className="security-info">
                      <h4>Delete Account</h4>
                      <p>Permanently delete your account and all data</p>
                    </div>
                    <button className="btn-danger">Delete Account</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
