// src/components/HistoryCard.jsx
import React from "react";
import { FileText, ArrowRight } from "lucide-react";

const HistoryCard = ({ item }) => {
  return (
    <div className="history-card">
      <div className="history-info">
        <FileText className="card-icon" size={28} />
        <div>
          <h3>{item.title}</h3>
          <p>
            Verified on {item.date} · <span>{item.type}</span>
          </p>
          <p className="score">Credibility Score: <b>{item.score}/100</b></p>
        </div>
      </div>
      <div className="history-actions">
        <span className="status-badge">{item.status}</span>
        <button className="view-btn">
          View Details <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default HistoryCard;