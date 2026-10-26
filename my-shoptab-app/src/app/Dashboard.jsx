import { useEffect, useState } from "react";
import { getCustomers, getEntries } from "./storage";
import "./Dashboard.css";

function Dashboard({ onOpenCustomers }) {
  const [customers, setCustomers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [customerData, entryData] = await Promise.all([
          getCustomers(),
          getEntries(),
        ]);
        setCustomers(customerData);
        setEntries(entryData);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const totalOwed = entries.reduce((total, entry) => {
    const amount = Number(entry.amount) || 0;
    return entry.type === "credit" ? total + amount : total - amount;
  }, 0);

  const totalPayments = entries
    .filter((entry) => entry.type === "payment")
    .reduce((total, entry) => total + (Number(entry.amount) || 0), 0);

  const recentEntries = [...entries]
    .sort((a, b) => (b.created_at || 0) - (a.created_at || 0))
    .slice(0, 5);

  if (loading) {
    return <p className="dashboard-loading">Loading dashboard...</p>;
  }

  return (
    <section className="dashboard">
      <div className="dashboard-heading">
        <div>
          <p className="dashboard-label">SHOP OVERVIEW</p>
          <h2>Your business at a glance</h2>
        </div>
        <button
          type="button"
          className="dashboard-primary-btn"
          onClick={onOpenCustomers}
        >
          View Customers
        </button>
      </div>

      <div className="dashboard-stat-grid">
        <div className="dashboard-stat-card">
          <span>Total Customers</span>
          <strong>{customers.length}</strong>
        </div>
        <div className="dashboard-stat-card dashboard-debt-card">
          <span>Total Outstanding</span>
          <strong>₦{Math.max(totalOwed, 0).toLocaleString()}</strong>
        </div>
        <div className="dashboard-stat-card dashboard-payment-card">
          <span>Total Payments</span>
          <strong>₦{totalPayments.toLocaleString()}</strong>
        </div>
      </div>

      <div className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <h3>Recent Transactions</h3>
          <span>{entries.length} total</span>
        </div>

        {recentEntries.length === 0 ? (
          <p className="dashboard-empty">
            No transactions yet. Add a customer and record your first entry.
          </p>
        ) : (
          <div className="dashboard-transactions">
            {recentEntries.map((entry) => (
              <div className="dashboard-transaction" key={entry.id}>
                <div>
                  <strong>
                    {entry.type === "credit" ? "Credit" : "Payment"}
                  </strong>
                  <p>{entry.note || "No note added"}</p>
                </div>
                <span
                  className={
                    entry.type === "credit"
                      ? "transaction-credit"
                      : "transaction-payment"
                  }
                >
                  {entry.type === "credit" ? "+" : "-"}₦
                  {Number(entry.amount || 0).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Dashboard;
