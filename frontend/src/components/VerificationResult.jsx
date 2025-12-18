import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  X,
} from "lucide-react";
import "./css/verificationResult.css";

function VerificationResult({
  score,
  result,
  onVerifyAnother,
  contentType,
}) {
  const [showReportForm, setShowReportForm] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    satisfaction: "",
    issue_description: "",
  });

  /* ===============================
     Probability handling
  =============================== */
  const realProbability =
    result?.real_probability ?? (score ? score / 100 : 0.5);
  const fakeProbability =
    result?.fake_probability ?? (score ? (100 - score) / 100 : 0.5);

  const realProb = Math.round(realProbability * 100);
  const fakeProb = Math.round(fakeProbability * 100);
  const content = result?.content || "No content provided.";

  let resultStatement = content;

  /* ===============================
     Decision logic
  =============================== */
  let status = "";
  let resultClass = "";
  let message = "";
  let IconComponent = AlertTriangle;

  const label =
    result?.label || (realProbability >= 0.5 ? "REAL" : "FAKE");

  if (realProbability >= 0.6) {
    status = `Likely ${label}`;
    resultClass = "result-success";
    message = "This content seems trustworthy.";
    IconComponent = CheckCircle;
  } else if (realProbability >= 0.4) {
    status = `Likely ${label}`;
    resultClass = "result-warning";
    message = "The content credibility is questionable.";
    IconComponent = AlertTriangle;
  } else {
    status = `Likely ${label}`;
    resultClass = "result-danger";
    message = "This content is likely false.";
    IconComponent = XCircle;
  }

  const SafeIcon = IconComponent;

  const category = result?.category || status;
  const allTokens = result?.all_tokens ?? null;
  const usedTokens = result?.used_tokens ?? null;

  /* ===============================
     Form handlers
  =============================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.satisfaction) {
      alert("Please select your satisfaction level.");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:5001/report/submit-report",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            satisfaction: formData.satisfaction,
            issue_description: formData.issue_description,
            news_id: contentType,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Your issue has been reported successfully!");
        setFormData({
          email: "",
          satisfaction: "",
          issue_description: "",
        });
        setShowReportForm(false);
      } else {
        alert(data.error || data.message || "Report failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <div className="verification-card">
      {/* Close button */}
      <button className="close-btn" onClick={onVerifyAnother}>
        <X size={15} />
      </button>

      {showReportForm ? (
        /* ===============================
           Report Form
        =============================== */
        <div className="report-form">
          <button
            className="close-btn"
            onClick={() => setShowReportForm(false)}
          >
            <X size={15} />
          </button>

          <h2 className="verification-title">Report Issue</h2>

          <form
            className="report-form-inner"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              name="email"
              placeholder="Enter your email..."
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>How satisfied are you with the result?</label>

            <div className="radio-group">
              {[
                "Very Dissatisfied",
                "Dissatisfied",
                "Neutral",
                "Satisfied",
                "Very Satisfied",
              ].map((opt, i) => (
                <label key={i}>
                  <input
                    type="radio"
                    name="satisfaction"
                    value={opt}
                    checked={formData.satisfaction === opt}
                    onChange={handleChange}
                    required
                  />
                  {opt}
                </label>
              ))}
            </div>

            <label>Report anything</label>
            <textarea
              name="issue_description"
              placeholder="Write your issue here..."
              rows="6"
              value={formData.issue_description}
              onChange={handleChange}
            />

            <button
              type="submit"
              className="report-submit-btn"
            >
              Report
            </button>
          </form>
        </div>
      ) : (
        <>
          {/* ===============================
             Verification Result
          =============================== */}
          <h2 className="verification-title">
            Verification Results
          </h2>

          <p className="verification-time">
            Analysis completed on{" "}
            {new Date().toLocaleString()}
          </p>

          <div className={`result-box ${resultClass}`}>
            <SafeIcon className="result-icon" size={60} />

            <h3 className="result-text">{status}</h3>

            <h4 className="result-score">
              Real: {realProb}% | Fake: {fakeProb}%
            </h4>

            <h3>{message}</h3>

            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">
                  Category:
                </span>
                <span className="detail-value">
                  {category}
                </span>
              </div>

              {allTokens != null &&
                usedTokens != null && (
                  <div className="detail-item">
                    <span className="detail-label">
                      Tokens Used:
                    </span>
                    <span className="detail-value">
                      {usedTokens} / {allTokens}
                    </span>
                  </div>
                )}
            </div>

            <div className="button-group">
              <button
                onClick={onVerifyAnother}
                className="verify-btn"
              >
                Verify Another
              </button>

              <button
                className="report-btn"
                onClick={() => setShowReportForm(true)}
              >
                Report Issue
              </button>
            </div>
          </div>

          {/* ===============================
             Analyzed Content
          =============================== */}
          <div className="analyzed-section">
            <p className="analyzed-label">
              Content Analyzed
            </p>
            <div className="analyzed-box">
              <p>{resultStatement}</p>
              <small>
                Content Type: {contentType}
              </small>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default VerificationResult;
