import { useState } from "react";
import { addCustomer } from "./storage";

function AddCustomer({ onAdded }) {
  // Store the form inputs in state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Runs when the user clicks "Add customer"
  async function handleSubmit(e) {
    e.preventDefault();

    // Basic validation
    if (!name.trim() || !phone.trim()) {
      setMessage("Please enter both name and phone number.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await addCustomer(name, phone);
      setName("");
      setPhone("");
      setMessage("✓ Customer added successfully!");
      setTimeout(() => setMessage(""), 3000);
      onAdded(); // Tell parent component to reload the customer list
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Add customer</h2>

      {message && (
        <p className={message.startsWith("✓") ? "success-msg" : "error-msg"}>
          {message}
        </p>
      )}

      <input
        type="text"
        placeholder="Customer Name (e.g. Mrs. Adebayo)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="tel"
        placeholder="Phone Number (e.g. 08012345678)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />

      <button type="submit" className="btn" disabled={loading}>
        {loading ? "Adding..." : "+ Add customer"}
      </button>
    </form>
  );
}

export default AddCustomer;
