import TransactionManager from "../components/TransactionManager";

const Expenses = () => (
  <section className="page-stack">
    <div className="page-header"><div><p className="eyebrow">Expense Management</p><h1>Expenses</h1></div></div>
    <TransactionManager mode="expense" />
  </section>
);

export default Expenses;
