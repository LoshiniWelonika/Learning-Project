import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="logo">TruthLab</h2>

      <nav className="nav">
        <NavLink to="/admin/dashboard">Dashboard</NavLink>
        <NavLink to="/admin/users">Users</NavLink>
        <NavLink to="/admin/reports">Reports</NavLink>
      </nav>
    </aside>
  );
}
