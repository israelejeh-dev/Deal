import { useState, useEffect, useCallback } from "react";
import { getEntries, deleteEntry } from "./storage";
import RecordEntryModal from "./RecordEntryModal";

function LedgerHistory({ customer, onBack }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getEntries(customer.id);
      setEntries(list);
    } catch (error) {
      console.error("Failed to load entries:", error);
    } finally {
      setLoading(false);
    }
  }, [customer.id]);

  // Load ledger entries when viewing this customer
  useEffect(() => {
    loadEntries();
  }, [loadEntries]);


  // Calculate current customer balance
  // Credits add to debt, payments reduce debt
  const balance = entries.reduce((total, entry) => {
    const amt = Number(entry.amount) || 0;
    return entry.type === "credit" ? total + amt : total - amt;
  }, 0);

  // Delete an incorrect entry
  async function handleDeleteEntry(entryId) {
    const confirm = window.confirm("Are you sure you want to delete this entry?");
    if (confirm) {
      await deleteEntry(entryId);
      loadEntries();
    }
  }

  // Format Nigerian or international phone numbers for WhatsApp
  function formatPhoneForWhatsApp(rawPhone) {
    let clean = (rawPhone || "").replace(/\D/g, ""); // strip non-digits
    // If entered as standard 11-digit Nigerian number (e.g. 08012345678), convert to 2348012345678
    if (clean.startsWith("0") && clean.length === 11) {
      clean = "234" + clean.substring(1);
    }
    return clean;
  }

  // Opens WhatsApp with an appropriate message
  function sendReminder() {
    const phone = formatPhoneForWhatsApp(customer.phone);
    let message = "";

    if (balance > 0) {
      message = `Hello ${customer.name}, this is a polite reminder from ShopTab that your current outstanding balance is ₦${balance.toLocaleString()}. Please settle it when you can. Thank you!`;
    } else if (balance === 0) {
      message = `Hello ${customer.name}, your account with ShopTab is fully settled. Thank you for your patronage!`;
    } else {
      message = `Hello ${customer.name}, you currently have an advance balance of ₦${Math.abs(balance).toLocaleString()} with ShopTab. Thank you!`;
    }

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  }

  return (
    <section>
      <button className="link-btn" onClick={onBack}>
        ← Back to customer list
      </button>

      {/* Customer Header Card */}
      <div className="card customer-summary-card">
        <div className="card-top-row">
          <div>
            <h2>{customer.name}</h2>
            <p className="muted">{customer.phone}</p>
          </div>
          <span className={balance > 0 ? "status-pill owing" : "status-pill settled"}>
            {balance > 0 ? "Debt Pending" : balance === 0 ? "Settled" : "Advance"}
          </span>
        </div>

        <div className="balance-box">
          <p className="balance-label">Current Balance:</p>
          <p className={balance > 0 ? "big-balance red" : "big-balance green"}>
            ₦{Math.abs(balance).toLocaleString()}
          </p>
        </div>

        <div className="actions">
          <button className="btn" onClick={() => setShowModal(true)}>
            + Record Credit / Payment
          </button>
          <button className="btn btn-green" onClick={sendReminder}>
            💬 Send WhatsApp Reminder
          </button>
        </div>
      </div>

      <h2>Transaction History</h2>

      {loading && <p className="muted">Loading transactions...</p>}

      {!loading && entries.length === 0 && (
        <div className="card empty-card">
          <p className="empty">No entries yet. Click "Record Credit / Payment" to add one.</p>
        </div>
      )}

      {/* Entry rows */}
      {!loading &&
        entries.map((entry) => {
          const isCredit = entry.type === "credit";
          const formattedDate = entry.created_at
            ? new Date(entry.created_at).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Recent";

          return (
            <div key={entry.id} className="entry-row">
              <div className="entry-left">
                <span className={`entry-badge ${isCredit ? "badge-credit" : "badge-payment"}`}>
                  {isCredit ? "CREDIT (OWED)" : "PAYMENT (RECEIVED)"}
                </span>
                <p className="entry-note">{entry.note || "No description note"}</p>
                <p className="muted small-date">{formattedDate}</p>
              </div>

              <div className="entry-right">
                <span className={isCredit ? "credit-amount" : "payment-amount"}>
                  {isCredit ? "+" : "-"}₦{Number(entry.amount || 0).toLocaleString()}
                </span>
                <button
                  className="delete-icon-btn"
                  title="Delete entry"
                  onClick={() => handleDeleteEntry(entry.id)}
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}

      {/* Record entry modal */}
      {showModal && (
        <RecordEntryModal
          customer={customer}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            loadEntries();
          }}
        />
      )}
    </section>
  );
}

export default LedgerHistory;
