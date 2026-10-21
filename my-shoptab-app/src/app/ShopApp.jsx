import { useState } from "react";
import AddCustomer from "./AddCustomer";
import CustomerList from "./CustomerList";
import LedgerHistory from "./LedgerHistory";
import "./ShopApp.css";

function ShopApp({ onBack }) {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Show the ledger when a customer is selected, otherwise the home screen
  return (
    <div className="shop-app">
      <header className="shop-header">
        <h1>ShopTab</h1>
        <button className="header-btn" onClick={onBack}>← Home</button>
      </header>

      <main className="container">
        {selectedCustomer ? (
          <LedgerHistory
            customer={selectedCustomer}
            onBack={() => setSelectedCustomer(null)}
          />
        ) : (
          <>
            <AddCustomer onAdded={() => setRefreshKey(refreshKey + 1)} />
            <CustomerList refreshKey={refreshKey} onSelect={setSelectedCustomer} />
          </>
        )}
      </main>
    </div>
  );
}

export default ShopApp;
