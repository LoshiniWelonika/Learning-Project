import React from "react";
import { FaSearch, FaCheckSquare, FaChartLine } from "react-icons/fa";
import "../pages/css/Home.css";

const HowItWorks = () => {
  return (
    <section className="how-it-works">
      <h2>How TRUTHLAB Works</h2>
      <p>
        Our AI-powered platform uses advanced algorithms to verify information <br />
        across multiple sources.
      </p>

      <div className="work-cards">
        <div className="card">
            <div className="icon-circle">
            <FaSearch className="icon" />
          </div>
          <h3>Source Analysis</h3>
          <p>
            We analyze the credibility of the source by examining its history,
            reputation, and previous accuracy.
          </p>
        </div>

        <div className="card">
             <div className="icon-circle">
            <FaCheckSquare className="icon" />
          </div>
          <h3>Content Verification</h3>
          <p>
            Our AI cross-references information with thousands of reliable
            sources to verify facts and claims.
          </p>
        </div>

        <div className="card">
            <div className="icon-circle">
            <FaChartLine className="icon" />
          </div>
          <h3>Credibility Score</h3>
          <p>
            Get a clear credibility score that helps you determine the
            reliability of information quickly.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
