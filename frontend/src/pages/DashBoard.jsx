import { useContext, useMemo } from "react";
import Chart from "../components/Chart";
import History from "../components/History";
import { AppContext } from "../context/AppContext";
import { formatCurrency, getCategoryTotals, getMonthlyData, getTotals, mergeTransactions } from "../utils/finance";

const chartColors = ["#0f766e", "#2563eb", "#b45309", "#7c3aed", "#dc2626", "#0891b2", "#4b5563", "#16a34a"];

const DashBoard = () => {
  const { incomeData, expenseData, loading, user } = useContext(AppContext);
  const transactions = useMemo(() => mergeTransactions(incomeData, expenseData), [incomeData, expenseData]);
  const totals = useMemo(() => getTotals(incomeData, expenseData), [incomeData, expenseData]);
  const monthly = useMemo(() => getMonthlyData(incomeData, expenseData), [incomeData, expenseData]);
  const categoryTotals = useMemo(() => getCategoryTotals(expenseData), [expenseData]);

  const monthlyExpenseData = {
    labels: monthly.map((item) => item.month),
    datasets: [{ label: "Expenses", data: monthly.map((item) => item.expense), backgroundColor: "#dc2626" }],
  };
  const incomeVsExpenseData = {
    labels: monthly.map((item) => item.month),
    datasets: [
      { label: "Income", data: monthly.map((item) => item.income), borderColor: "#0f766e", backgroundColor: "#0f766e" },
      { label: "Expense", data: monthly.map((item) => item.expense), borderColor: "#dc2626", backgroundColor: "#dc2626" },
    ],
  };
  const categoryData = {
    labels: Object.keys(categoryTotals),
    datasets: [{ data: Object.values(categoryTotals), backgroundColor: chartColors }],
  };

  return (
    <section className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Hello, {user?.name || "there"}</h1>
        </div>
        <span className="status-pill">{loading ? "Syncing..." : "Live"}</span>
      </div>

      <div className="metric-grid">
        <article className="metric-card"><span>Total Income</span><strong>{formatCurrency(totals.totalIncome)}</strong></article>
        <article className="metric-card"><span>Total Expenses</span><strong>{formatCurrency(totals.totalExpenses)}</strong></article>
        <article className="metric-card"><span>Current Balance</span><strong>{formatCurrency(totals.balance)}</strong></article>
        <article className="metric-card"><span>Transactions</span><strong>{transactions.length}</strong></article>
      </div>

      <div className="dashboard-grid">
        <section className="panel chart-panel"><div className="panel-header"><h2>Monthly Expense Chart</h2></div><Chart data={monthlyExpenseData} /></section>
        <section className="panel chart-panel"><div className="panel-header"><h2>Category-wise Pie Chart</h2></div><Chart type="pie" data={categoryData} /></section>
      </div>

      <section className="panel chart-panel wide-panel">
        <div className="panel-header"><h2>Income vs Expense</h2><span>Monthly summary</span></div>
        <Chart type="line" data={incomeVsExpenseData} />
      </section>

      <section className="panel">
        <div className="panel-header"><h2>Recent Transactions</h2><span>{transactions.slice(0, 6).length} latest</span></div>
        <History transactions={transactions.slice(0, 6)} />
      </section>
    </section>
  );
};

export default DashBoard;
