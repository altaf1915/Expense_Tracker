import TransactionManager from "../components/TransactionManager";

const ViewTransactions = () => (
  <section className="page-stack">
    <div className="page-header"><div><p className="eyebrow">Transaction Center</p><h1>All Transactions</h1></div></div>
    <TransactionManager mode="all" />
  </section>
);

export default ViewTransactions;
