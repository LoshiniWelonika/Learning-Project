import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../pages/css/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Login successful!");
        console.log("User:", data.user);

        // Store JWT token and user before navigating
        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
        }
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        // Redirect admin users to admin dashboard
        const isAdmin = (data.user && (data.user.is_admin || (data.user.email || "").toLowerCase() === "admin@gmail.com"));
        navigate(isAdmin ? "/admin" : "/verify");
      } else {
        alert(`⚠️ ${data.error || "Login failed. Please try again."}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("🚨 Server error. Please try again later.");
    }
  };

  // If redirected back from Google OAuth, capture token from URL
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const access_token = params.get("access_token");
      const email = params.get("email");
      const name = params.get("name");
      if (access_token) {
        localStorage.setItem("access_token", access_token);
        if (email || name) {
          const user = { full_name: name || email, email };
          localStorage.setItem("user", JSON.stringify(user));
          const isAdminOAuth = (email || "").toLowerCase() === "admin@gmail.com";
          window.history.replaceState({}, document.title, window.location.pathname);
          navigate(isAdminOAuth ? "/admin" : "/verify");
        } else {
          window.history.replaceState({}, document.title, window.location.pathname);
          navigate("/verify");
        }
      }
    } catch (e) {
      // ignore
    }
  }, [navigate]);

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-header">Log In to TruthLab</h1>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="input-group">
            <label htmlFor="email">Email address</label>
            <div className="input-field-container">
              <i className="fa-regular fa-user"></i>
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

          {/* Password Field */}
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-field-container">
              <i className="fa-solid fa-key"></i>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <a href="#" className="forgot-password">
            Forgot Password?
          </a>

          {/* Login Button */}
          <button type="submit" className="btn login-primary-btn">
            Log in
          </button>

          {/* Google Login Button (UI only for now) */}
          <button
            type="button"
            className="btn login-secondary-btn"
            onClick={() => window.open("http://127.0.0.1:5001/auth/google/login", "_blank", "noopener,noreferrer")}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
              className="google-icon"
            />
            Login with Google
          </button>
        </form>

        <p className="signup-text">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
