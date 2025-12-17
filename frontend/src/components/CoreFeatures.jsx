import React from "react";
import { FileSearch, Percent } from "lucide-react"; // You can replace icons if needed
import "../pages/css/About.css";

const CoreFeatures = () => {
  const features = [
    {
      icon: <FileSearch className="feature-icon" />,
      title: "Text Analysis",
      description:
        "Our AI analyzes written content to identify misleading claims, exaggerations, and factual inaccuracies by cross-referencing with trusted sources.",
      points: [
        "Claim extraction and verification",
        "Content cross-validation",
        "Automatic accuracy checks",
      ],
    },
    {
      icon: <Percent className="feature-icon" />,
      title: "Credibility Scoring",
      description:
        "Get a clear, numerical assessment of information reliability based on multiple factors, helping you quickly determine trustworthiness.",
      points: [
        "Multi-factor analysis",
        "Detailed breakdown reports",
        "Historical comparison",
      ],
    },
  ];

  return (
    <section className="features-section">
      <h2 className="features-title">Core Features</h2>
      <p className="features-subtitle">
        Our comprehensive suite of tools to verify information across various
        media formats.
      </p>

      <div className="features-container">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon-wrapper">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <ul>
              {feature.points.map((point, i) => (
                <li key={i}>✓ {point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CoreFeatures;
