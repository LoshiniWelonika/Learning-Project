import React, { useState } from "react";
import "./css/Navbar.css";
import logo from "../assets/logo.png";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const token =
    (typeof window !== "undefined" &&
      (localStorage.getItem("access_token") ||
        localStorage.getItem("token"))) ||
    null;

  let user = null;
  try {
    user =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("user") || "null")
        : null;
  } catch {
    user = null;
  }

  const isLoggedIn = Boolean(token);

  const firstLetter =
    user?.full_name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "";

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <img src={logo} alt="TRUTHLAB Logo" />
        </div>

        {/* Links */}
        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink>
          <NavLink to="/verify">Verify</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/history">History</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
        </div>

        {/* Right section */}
        <div className="navbar-buttons">
          {isLoggedIn ? (
            <div className="profile-wrapper">
              <div
                className="avatar-circle"
                onClick={() => setShowDropdown(!showDropdown)}
                title="Profile"
              >
                {firstLetter}
              </div>

              {showDropdown && (
                <div className="profile-dropdown">
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavLink to="/login">
                <button className="loginbtn">Log in</button>
              </NavLink>
              <NavLink to="/signup">
                <button className="signUpbtn">Sign up</button>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
