import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", users: 40 },
  { month: "Feb", users: 70 },
  { month: "Mar", users: 120 },
];

const UserGrowthChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line dataKey="users" stroke="#38bdf8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default UserGrowthChart;
