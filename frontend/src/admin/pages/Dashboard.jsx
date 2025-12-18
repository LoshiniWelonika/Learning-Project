import "../styles/admin.css";
import React, { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import ContentCard from "../components/ContentCard";
import UserGrowthChart from "../charts/UserGrowthChart";

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, real: 0, fake: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch("http://127.0.0.1:5000/admin/stats", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          setStats({ total: data.total || 0, real: data.real || 0, fake: data.fake || 0 });
        } else {
          console.error("Failed to fetch admin stats", await res.text());
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview of platform activity" />

      <div className="stats-grid">
        <StatCard title="Verified" value={loading ? "..." : stats.total} />
        <StatCard title="Real" value={loading ? "..." : stats.real} />
        <StatCard title="Fake" value={loading ? "..." : stats.fake} />
      </div>

      <ContentCard>
        <UserGrowthChart counts={stats} />
      </ContentCard>
    </>
  );
}
