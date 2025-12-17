import React from "react";
import { Link } from "react-router-dom";
import "../pages/css/About.css";

const CTASection = () => {
  return (
    <section className="cta-section">
      <h2>Ready to experience these features?</h2>
      <p>
        Start using TRUTHLAB today and never fall for fake news again.
      </p>
      <Link to="/signup">
        <button className="cta-button">Get Started</button>
      </Link>
    </section>
  );
};

export default CTASection;
