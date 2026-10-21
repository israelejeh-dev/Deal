import { useState } from "react";
import { addEntry } from "./storage";

function RecordEntryModal({ customer, onClose, onSaved }) {
  const [type, setType] = useState("credit"); // "credit" (customer took goods on credit) or "payment" (customer paid money)
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(e) {
    e.preventDefault();

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await addEntry(customer.id, type, numericAmount, note);
      onSaved(); // Closes modal and refreshes ledger
    } catch (err) {
      setError(err.message || "Failed to save entry");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      {/* stopPropagation prevents modal from closing when clicking inside it */}
      <form
        className="modal"
        onSubmit={handleSave}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Record entry for {customer.name}</h2>
        <p className="muted">
          {type === "credit"
            ? "Record goods or money the customer owes."
            : "Record cash or transfer the customer paid."}
        </p>

        {error && <p className="error-msg">{error}</p>}

        {/* Toggle between Credit and Payment */}
        <div className="toggle">
          <button
            type="button"
            className={type === "credit" ? "active credit-toggle" : ""}
            onClick={() => setType("credit")}
          >
            + Credit (Owed)
          </button>
          <button
            type="button"
            className={type === "payment" ? "active payment-toggle" : ""}
            onClick={() => setType("payment")}
          >
            - Payment (Received)
          </button>
        </div>

        <label className="input-label">Amount (₦)</label>
        <input
          type="number"
          placeholder="e.g. 5000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          required
        />

        <label className="input-label">Note / Item description</label>
        <input
          type="text"
          placeholder="e.g. 1 Bag of Rice, Bread, Cash..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="actions">
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Saving..." : "Save entry"}
          </button>
          <button
            type="button"
            className="btn btn-grey"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default RecordEntryModal;
