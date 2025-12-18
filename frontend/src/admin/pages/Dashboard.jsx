import "../styles/admin.css";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import ContentCard from "../components/ContentCard";
import UserGrowthChart from "../charts/UserGrowthChart";

export default function Dashboard() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of platform activity"
      />

      <div className="stats-grid">
        <StatCard title="Users" value="1,240" />
        <StatCard title="Reports" value="312" />
        <StatCard title="Accuracy" value="96%" />
      </div>

      <ContentCard>
        <UserGrowthChart />
      </ContentCard>
    </>
  );
}
