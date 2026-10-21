import { useState, useEffect } from "react";
import { getCustomers, getEntries, deleteCustomer, isUsingLocalStorage } from "./storage";

function CustomerList({ refreshKey, onSelect }) {
  const [customers, setCustomers] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Load customer data when the component loads or refreshKey changes
  useEffect(() => {
    loadData();
  }, [refreshKey]);

  async function loadData() {
    setLoading(true);
    try {
      const [customerData, entryData] = await Promise.all([
        getCustomers(),
        getEntries(),
      ]);
      setCustomers(customerData);
      setEntries(entryData);
    } catch (error) {
      console.error("Failed to load customers:", error);
    } finally {
      setLoading(false);
    }
  }

  // Calculate balance: credits minus payments
  function getBalance(customerId) {
    return entries
      .filter((entry) => entry.customer_id === customerId)
      .reduce((total, entry) => {
        const amt = Number(entry.amount) || 0;
        return entry.type === "credit" ? total + amt : total - amt;
      }, 0);
  }

  // Handle deleting a customer
  async function handleDelete(e, customer) {
    e.stopPropagation(); // Prevents clicking the row from opening the customer page
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${customer.name}? All their ledger history will be removed.`
    );
    if (confirmDelete) {
      await deleteCustomer(customer.id);
      loadData();
    }
  }

  // Filter customers by search term
  const filteredCustomers = customers.filter((c) => {
    const q = search.toLowerCase();
    const nameMatch = c.name?.toLowerCase().includes(q);
    const phoneMatch = c.phone?.toLowerCase().includes(q);
    return nameMatch || phoneMatch;
  });

  return (
    <section>
      <div className="section-header-row">
        <h2>Customers ({customers.length})</h2>
        {isUsingLocalStorage && (
          <span className="mode-badge" title="Data saved to browser storage">
            ● Offline / Local Mode
          </span>
        )}
      </div>

      {/* Search Bar */}
      {customers.length > 0 && (
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search customer by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}

      {/* Loading state */}
      {loading && <p className="muted">Loading customer records...</p>}

      {/* Empty states */}
      {!loading && customers.length === 0 && (
        <div className="card empty-card">
          <p className="empty">No customers yet. Add your first customer above!</p>
        </div>
      )}

      {!loading && customers.length > 0 && filteredCustomers.length === 0 && (
        <p className="empty">No customers match "{search}".</p>
      )}

      {/* Customer rows */}
      {!loading &&
        filteredCustomers.map((customer) => {
          const balance = getBalance(customer.id);
          const isOwing = balance > 0;
          const isSettled = balance === 0;

          return (
            <div
              key={customer.id}
              className="customer-row"
              onClick={() => onSelect(customer)}
            >
              <div className="customer-info">
                <strong>{customer.name}</strong>
                <p className="muted">{customer.phone}</p>
              </div>

              <div className="customer-right">
                <span
                  className={
                    isOwing
                      ? "balance owing"
                      : isSettled
                      ? "balance settled"
                      : "balance advance"
                  }
                >
                  {isOwing && "Owes "}
                  ₦{Math.abs(balance).toLocaleString()}
                  {isSettled && " (Settled)"}
                  {balance < 0 && " (Advance)"}
                </span>

                <button
                  className="delete-icon-btn"
                  title="Delete customer"
                  onClick={(e) => handleDelete(e, customer)}
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
    </section>
  );
}

export default CustomerList;
