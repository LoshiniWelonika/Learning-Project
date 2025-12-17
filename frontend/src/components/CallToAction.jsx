import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/CallToAction.css";

const CallToAction = () => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/signup"); // navigates to Sign Up page
  };

  return (
    <section className="cta">
      <h2>Ready to verify with confidence?</h2>
      <p>Start using TRUTHLAB today and never fall for fake news again.</p>
      <button onClick={handleClick} className="cta-btn">Get Started</button>
    </section>
  );
};

export default CallToAction;
