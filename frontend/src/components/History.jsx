const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value || 0));

const History = ({ transactions = [], onEdit, onDelete }) => (
  <div className="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Category</th>
          <th>Date</th>
          <th>Type</th>
          <th>Amount</th>
          {(onEdit || onDelete) && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {transactions.length === 0 ? (
          <tr>
            <td colSpan={6} className="empty-cell">No transactions found.</td>
          </tr>
        ) : (
          transactions.map((transaction) => (
            <tr key={`${transaction.type}-${transaction._id}`}>
              <td>
                <strong>{transaction.title}</strong>
                <small>{transaction.description || "No description"}</small>
              </td>
              <td>{transaction.category}</td>
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
              <td><span className={`pill ${transaction.type}`}>{transaction.type}</span></td>
              <td className={transaction.type === "income" ? "positive" : "negative"}>
                {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
              </td>
              {(onEdit || onDelete) && (
                <td>
                  <div className="row-actions">
                    {onEdit && <button className="ghost-btn" onClick={() => onEdit(transaction)}>Edit</button>}
                    {onDelete && <button className="ghost-btn danger" onClick={() => onDelete(transaction)}>Delete</button>}
                  </div>
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default History;
