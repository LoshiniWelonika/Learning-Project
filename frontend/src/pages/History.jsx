// src/pages/VerificationHistory.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HistoryCard from "../components/HistoryCard";
import "./css/History.css";
import { Search, Filter, Calendar } from "lucide-react";

const VerificationHistory = () => {
  const [historyData, setHistoryData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("access_token") || localStorage.getItem("token");
        const res = await fetch("http://127.0.0.1:5000/verify/history", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        // Handle common failure modes: unauthorized or network/other errors
        if (res.status === 401) {
          setError("Please log in to view your verification history.");
          setHistoryData([]);
          setLoading(false);
          return;
        }

        if (!res.ok) {
          // Try to parse JSON error body safely
          let errMsg = "Failed to fetch history";
          try {
            const errBody = await res.json();
            errMsg = errBody.error || errMsg;
          } catch (e) {
            // ignore JSON parse errors
          }
          throw new Error(errMsg);
        }

        const body = await res.json();

        const mapped = (body.history || []).map((h, idx) => {
          const date = h.created_at ? new Date(h.created_at).toLocaleString() : "-";
          const score = Math.round((h.confidence || 0) * 100);
          let status = "Uncertain";
          if (h.confidence >= 0.6 || (h.prediction === "REAL" && h.confidence >= 0.5)) status = "Likely True";
          else if (h.confidence <= 0.4 || (h.prediction === "FAKE" && h.confidence >= 0.5)) status = "Likely Fake";

          return {
            id: h.id || idx,
            title: h.text ? (h.text.length > 140 ? h.text.substring(0, 137) + "..." : h.text) : "(no text)",
            fullText: h.text || "",
            date,
            type: "Article",
            score,
            status,
            prediction: h.prediction || null,
            confidence: h.confidence || 0,
            confidencePercent: Math.round((h.confidence || 0) * 100),
            username: h.username || h.user_email || null,
          };
        });

        setHistoryData(mapped);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by topic or keyword"
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm("")}>Clear</button>
            )}
          </div>

        </div>

        <div className="history-list"> 
          {loading && <p>Loading history…</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && historyData.length === 0 && <p>No history yet.</p>}
          {!loading && !error && historyData.length > 0 && (
            (() => {
              const q = (searchTerm || "").trim().toLowerCase();
              const filtered = q
                ? historyData.filter((h) => {
                    return (
                      (h.title && h.title.toLowerCase().includes(q)) ||
                      (h.fullText && h.fullText.toLowerCase().includes(q)) ||
                      (h.username && h.username.toLowerCase().includes(q))
                    );
                  })
                : historyData;

              if (filtered.length === 0) return <p>No matches for "{searchTerm}".</p>;

              return filtered.map((item) => <HistoryCard key={item.id} item={item} />);
            })()
          )}
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