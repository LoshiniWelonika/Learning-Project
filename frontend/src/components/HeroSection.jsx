import React from "react";
import "../pages/css/Home.css"; 

const Hero = () => {
  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero center-hero" id="home">
      <div className="hero-content">
        <h1>
          No More Fake <br /> Verify News With Confidence
        </h1>
        <p>
          TRUTHLAB's AI-powered platform helps you detect fake news and verify
          information with cutting-edge technology.
        </p>
        <div className="hero-buttons flex gap-4 justify-center">
          <button className="primary-btn" onClick={() => handleScroll("how-it-works")}>
            Get Started
          </button>
          <button
            className="secondary-btn"
            onClick={() => (window.location.href = "/login")}
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
