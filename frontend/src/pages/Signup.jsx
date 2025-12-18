import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../pages/css/Login.css";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 Password validation
    if (formData.password !== formData.confirm_password) {
      alert("❌ Passwords do not match! Please recheck.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5001/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // ✅ Only send necessary data
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Account created successfully! Please log in.");
        // Redirect to login page
        navigate("/login");
      } else {
        alert(`⚠️ ${data.error || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("🚨 Server error. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <h1 className="header">Create your account</h1>
      <p className="tagline">
        Join TruthLab to start verifying news with confidence
      </p>

      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="input-group">
          <label htmlFor="full_name">Full Name</label>
          <div className="input-field-container">
            <i className="fa-regular fa-user"></i>
            <input
              type="text"
              id="full_name"
              placeholder="Enter your full name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="input-group">
          <label htmlFor="email">Email address</label>
          <div className="input-field-container">
            <i className="fa-regular fa-envelope"></i>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <div className="input-field-container">
            <i className="fa-solid fa-key"></i>
            <input
              type="password"
              id="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <p className="password-hint">Must be at least 6 characters long.</p>
        </div>

        {/* Confirm Password */}
        <div className="input-group">
          <label htmlFor="confirm_password">Confirm Password</label>
          <div className="input-field-container">
            <i className="fa-solid fa-key"></i>
            <input
              type="password"
              id="confirm_password"
              placeholder="Confirm your password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn primary-btn">
          Create Account
        </button>
      </form>

      <p className="signup-text">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
