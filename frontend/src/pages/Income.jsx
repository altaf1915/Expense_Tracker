import TransactionManager from "../components/TransactionManager";

const Income = () => (
  <section className="page-stack">
    <div className="page-header"><div><p className="eyebrow">Income Management</p><h1>Income</h1></div></div>
    <TransactionManager mode="income" />
  </section>
);

export default Income;
