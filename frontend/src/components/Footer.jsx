import React from "react";
import "./css/Footer.css";
import logo from "../assets/logo.png"; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <img src={logo} alt="TruthLab Logo" className="footer-logo" />
          <p className="footer-copy">© 2023 TRUTHLAB. All rights reserved.</p>
        </div>

        <div className="footer-right">
          <div className="footer-column">
            <a href="/signup">Sign up</a>
            <a href="/login">Log in</a>
          </div>
          <div className="footer-column">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/features">Features</a>
            <a href="/faq">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
