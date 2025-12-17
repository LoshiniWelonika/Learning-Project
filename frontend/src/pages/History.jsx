// src/pages/VerificationHistory.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HistoryCard from "../components/HistoryCard";
import "./css/History.css";
import { Search, Filter, Calendar } from "lucide-react";

const VerificationHistory = () => {
  const historyData = [
    {
      id: 1,
      title: "Global Temperatures Hit Record High for Third Consecutive Year",
      date: "9/27/2025, 12:43 PM",
      type: "Article",
      score: 85,
      status: "Likely True",
      color: "#C7F8E4",
    },
    {
      id: 2,
      title: "Scientists Discover Cure for All Types of Cancer",
      date: "9/25/2025, 10:15 AM",
      type: "Headline",
      score: 17,
      status: "Likely Fake",
      color: "#FFD6D6",
    },
    {
      id: 3,
      title: "New Study Links Coffee Consumption to Increased Lifespan",
      date: "9/26/2025, 1:15 PM",
      type: "URL",
      score: 50,
      status: "Uncertain",
      color: "#FDF7D1",
    },
  ];

  return (
    <div className="history-page">
      <Navbar />
      <main className="text-center bg-white py-12">
        <div className="hero">
            <h1 className="text-3xl font-bold mb-2">Verification History</h1>
             <button className="verify-new-btn">Verify New Content</button>
        </div>
      </main>
      <div className="history-container">
        <div className="filter-bar">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search your verification history"
            />
          </div>

          <div className="filter-actions">
            <button className="filter-btn">
              <Filter size={18} /> Filter
            </button>
            <button className="date-btn">
              <Calendar size={18} /> Date Range
            </button>
          </div>
        </div>

        <div className="history-list">
          {historyData.map((item) => (
            <HistoryCard key={item.id} item={item} />
          ))}
        </div>

        <div className="pagination">
          <button>Previous</button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>Next</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VerificationHistory;