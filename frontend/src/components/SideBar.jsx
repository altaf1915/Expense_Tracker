import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/transactions", label: "Transactions" },
  { to: "/income", label: "Income" },
  { to: "/expenses", label: "Expenses" },
];

const SideBar = ({ user, onLogout }) => (
  <aside className="sidebar">
    <div className="brand">
      <span className="brand-mark">ET</span>
      <div>
        <strong>Expense Tracker</strong>
        <small>Personal finance</small>
      </div>
    </div>

    <nav className="nav-list">
      {navItems.map((item) => (
        <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          {item.label}
        </NavLink>
      ))}
    </nav>

    <div className="sidebar-footer">
      <span>Signed in as</span>
      <strong>{user?.name || "User"}</strong>
      <button className="btn btn-secondary btn-full" onClick={onLogout}>Logout</button>
    </div>
  </aside>
);

export default SideBar;
