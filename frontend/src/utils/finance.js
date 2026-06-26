export const expenseCategories = ["Food", "Transport", "Shopping", "Bills", "Healthcare", "Travel", "Education", "Other"];
export const incomeCategories = ["Salary", "Freelance", "Business", "Investment", "Gift", "Other"];

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value || 0));

export const toDateInput = (date) => new Date(date || Date.now()).toISOString().slice(0, 10);

export const mergeTransactions = (income = [], expenses = []) =>
  [
    ...income.map((item) => ({ ...item, type: "income" })),
    ...expenses.map((item) => ({ ...item, type: "expense" })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

export const getTotals = (income = [], expenses = []) => {
  const totalIncome = income.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
  };
};

export const getMonthlyData = (income = [], expenses = []) => {
  const buckets = {};
  mergeTransactions(income, expenses).forEach((item) => {
    const key = new Date(item.date).toLocaleString("en-US", { month: "short", year: "2-digit" });
    buckets[key] ||= { income: 0, expense: 0 };
    buckets[key][item.type] += Number(item.amount || 0);
  });
  return Object.entries(buckets).map(([month, values]) => ({ month, ...values }));
};

export const getCategoryTotals = (expenses = []) => {
  const totals = {};
  expenses.forEach((expense) => {
    totals[expense.category] = (totals[expense.category] || 0) + Number(expense.amount || 0);
  });
  return totals;
};
