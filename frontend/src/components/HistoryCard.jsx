// src/components/HistoryCard.jsx
import React from "react";
import { FileText, ArrowRight } from "lucide-react";

const HistoryCard = ({ item }) => {
  const [showFull, setShowFull] = React.useState(false);

  const badgeStyle =
    item.prediction === "REAL"
      ? { backgroundColor: "#C7F8E4", color: "#064e3b" }
      : item.prediction === "FAKE"
      ? { backgroundColor: "#FFD6D6", color: "#7f1d1d" }
      : {};

  return (
    <div className="history-card">      
      <div className="history-info">
        <FileText className="card-icon" size={28} />
        <div>
          <h3>{item.title}</h3>
          <p>
            Verified on {item.date} · <span>{item.type}</span>
          </p>

          <p className="meta">
            <span className="confidence">Confidence: <b>{item.confidencePercent}%</b></span>
          </p>

          {item.username && (
            <p className="verified-by">Verified by: <b>{item.username}</b></p>
          )}

          <p className="score">Credibility Score: <b>{item.score}/100</b></p>
        </div>
      </div>

      <div className="history-actions">
        <span className="status-badge" style={badgeStyle}>{item.prediction}</span>
      </div>

      {showFull && (
        <div className="history-full">
          <p>{item.fullText}</p>
        </div>
      )}
    </div>
  );
};

export default HistoryCard;