import { useContext, useMemo, useState } from "react";
import History from "./History";
import { AppContext } from "../context/AppContext";
import { expenseCategories, incomeCategories, mergeTransactions, toDateInput } from "../utils/finance";

const initialForm = {
  title: "",
  amount: "",
  category: "",
  description: "",
  date: toDateInput(),
};

const TransactionManager = ({ mode = "all" }) => {
  const {
    incomeData,
    expenseData,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  } = useContext(AppContext);
  const [type, setType] = useState(mode === "income" ? "income" : "expense");
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [filters, setFilters] = useState({ search: "", category: "", startDate: "", endDate: "" });
  const [saving, setSaving] = useState(false);

  const categories = type === "income" ? incomeCategories : expenseCategories;
  const allTransactions = useMemo(() => mergeTransactions(incomeData, expenseData), [incomeData, expenseData]);

  const baseTransactions = mode === "income" ? incomeData.map((item) => ({ ...item, type: "income" }))
    : mode === "expense" ? expenseData.map((item) => ({ ...item, type: "expense" }))
    : allTransactions;

  const filteredTransactions = baseTransactions.filter((item) => {
    const titleMatch = item.title.toLowerCase().includes(filters.search.toLowerCase());
    const categoryMatch = !filters.category || item.category === filters.category;
    const itemDate = new Date(item.date);
    const startMatch = !filters.startDate || itemDate >= new Date(filters.startDate);
    const endMatch = !filters.endDate || itemDate <= new Date(filters.endDate);
    return titleMatch && categoryMatch && startMatch && endMatch;
  });

  const resetForm = () => {
    setForm(initialForm);
    setEditing(null);
    if (mode === "income") setType("income");
    if (mode === "expense") setType("expense");
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateTransaction(type, editing._id, form);
      } else {
        await createTransaction(type, form);
      }
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const editTransaction = (transaction) => {
    setType(transaction.type);
    setEditing(transaction);
    setForm({
      title: transaction.title,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description || "",
      date: toDateInput(transaction.date),
    });
  };

  const deleteItem = async (transaction) => {
    await deleteTransaction(transaction.type, transaction._id);
  };

  return (
    <div className="transaction-layout">
      <section className="panel">
        <div className="panel-header">
          <h2>{editing ? "Edit Transaction" : "Add Transaction"}</h2>
          <span>{type}</span>
        </div>
        <form onSubmit={submit} className="form-grid">
          {mode === "all" && (
            <label>Type
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </label>
          )}
          <label>Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
          <label>Amount<input type="number" min="0.01" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required /></label>
          <label>Category
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
              <option value="">Select category</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>
          <label>Date<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></label>
          <label>Description<textarea rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <div className="form-actions">
            <button className="btn btn-primary" disabled={saving}>{saving ? "Saving..." : editing ? "Update" : "Add"}</button>
            {editing && <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>}
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>{mode === "all" ? "All Transactions" : mode === "income" ? "Income Records" : "Expense Records"}</h2>
          <span>{filteredTransactions.length} records</span>
        </div>
        <div className="filter-grid">
          <input placeholder="Search transactions" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
            <option value="">All categories</option>
            {[...new Set(baseTransactions.map((item) => item.category))].map((category) => <option key={category}>{category}</option>)}
          </select>
          <input type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
          <input type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
        </div>
        <History transactions={filteredTransactions} onEdit={editTransaction} onDelete={deleteItem} />
      </section>
    </div>
  );
};

export default TransactionManager;
