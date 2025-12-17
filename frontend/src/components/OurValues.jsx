import React from "react";
import { Globe, Lightbulb, Users } from "lucide-react"; // Example icons
import "../pages/css/About.css";

const OurValues = () => {
  const values = [
    {
      icon: <Globe className="value-icon" />,
      title: "Truth & Accuracy",
      text: "We believe in the fundamental importance of factual accuracy and commit to rigorous standards in our verification processes.",
    },
    {
      icon: <Lightbulb className="value-icon" />,
      title: "Innovation",
      text: "We continuously improve our technology to stay ahead of evolving misinformation tactics and provide the best tools to our users.",
    },
    {
      icon: <Users className="value-icon" />,
      title: "Accessibility",
      text: "We believe fact-checking should be available to everyone, not just experts. We design our tools to be user-friendly and accessible.",
    },
  ];

  return (
    <section className="values-section">
      <h2 className="values-title">Our Values</h2>
      <p className="values-subtitle">
        These core principles guide everything we do at TRUTHLAB.
      </p>

      <div className="values-container">
        {values.map((value, index) => (
          <div className="value-card" key={index}>
            <div className="value-icon-wrapper">{value.icon}</div>
            <h3>{value.title}</h3>
            <p>{value.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurValues;
