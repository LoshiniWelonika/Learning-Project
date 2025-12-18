import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const UserGrowthChart = ({ counts }) => {
  const data = counts
    ? [
        { name: "Total", value: counts.total || 0 },
        { name: "Real", value: counts.real || 0 },
        { name: "Fake", value: counts.fake || 0 },
      ]
    : [
        { name: "Total", value: 0 },
        { name: "Real", value: 0 },
        { name: "Fake", value: 0 },
      ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="value" fill="#38bdf8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default UserGrowthChart;
