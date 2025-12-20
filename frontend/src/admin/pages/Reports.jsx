import React, { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import ContentCard from "../components/ContentCard";

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch("http://127.0.0.1:5000/admin/stats", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || `HTTP ${res.status}`);
        }
        const data = await res.json();
        setRecent(data.recent || []);
      } catch (e) {
        console.error(e);
        setError(e.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <>
      <PageHeader title="Reports" subtitle="Reported news & issues" />

      <ContentCard>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
            <i className="fa fa-spinner fa-spin" style={{ fontSize: 24 }}></i>
            <div>Loading reports...</div>
          </div>
        ) : error ? (
          <div style={{ padding: 24, color: "var(--danger)" }}>Error: {error}</div>
        ) : recent.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
            No verified news found.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {recent.map((r) => {
              const id = r.id || r._id || Math.random().toString(36).slice(2);
              const text = r.text || "";
              const short = text.length > 300 ? text.slice(0, 300) + "..." : text;
              const isExpanded = !!expanded[id];
              const when = r.created_at ? new Date(r.created_at).toLocaleString() : "-";
              return (
                <div
                  key={id}
                  style={{
                    padding: 16,
                    borderRadius: 8,
                    background: "var(--card-bg)",
                    boxShadow: "var(--card-shadow)",
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,var(--primary),var(--primary-dark))",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {(r.username || r.user_email || "U").charAt(0).toUpperCase()}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                      <div>
                        <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{r.username || r.user_email || "Unknown"}</div>
                        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{r.user_email || "-"}</div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{when}</div>
                        <div style={{ marginTop: 6 }}>
                          <span style={{
                            display: "inline-block",
                            padding: "6px 10px",
                            borderRadius: 18,
                            background: r.prediction === "REAL" ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                            color: r.prediction === "REAL" ? "#16a34a" : "#dc2626",
                            fontWeight: 600,
                            fontSize: 13,
                          }}>{r.prediction || "-"}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: 10, color: "var(--text-main)" }}>
                      {isExpanded ? text : short}
                    </div>

                    <div style={{ marginTop: 10, display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Confidence: {(Number(r.confidence) * 100 || 0).toFixed(1)}%</div>
                      {text.length > 300 && (
                        <button
                          onClick={() => setExpanded((s) => ({ ...s, [id]: !s[id] }))}
                          className="btn"
                          style={{ padding: "6px 10px" }}
                        >
                          {isExpanded ? "Show less" : "Show more"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ContentCard>
    </>
  );
}
