import React from "react";
import "./css/Navbar.css";
import logo from "../assets/logo.png"; 
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token =
    (typeof window !== "undefined" && (localStorage.getItem("access_token") || localStorage.getItem("token"))) || null;
  let user = null;
  try {
    user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;
  } catch {
    user = null;
  }
  const isLoggedIn = Boolean(token);
  const firstName = user?.full_name ? user.full_name.split(" ")[0] : (user?.email ? user.email.split("@")[0] : "");

  const handleLogout = () => {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch {}
    alert("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left: Logo */}
        <div className="navbar-logo">
          <img src={logo} alt="TRUTHLAB Logo" />
        </div>

        {/* Center: Links */}
        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>Home</NavLink>
          <NavLink to="/verify">Verify</NavLink>
          <NavLink to="/about">About</NavLink> 
          <NavLink to="/history">History</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
        </div>

        {/* Right: Buttons / User Avatar */}
        <div className="navbar-buttons">
          {isLoggedIn ? (
            <>
              <div className="avatar-circle" title={firstName} aria-label={`Logged in as ${firstName}`}>
                {firstName}
              </div>
              <button className="logoutbtn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login"><button className="loginbtn">Log in</button></NavLink>
              <NavLink to="/signup"><button className="signUpbtn">Sign up</button></NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
