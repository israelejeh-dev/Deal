import { useState } from "react"; 
import { useAuth } from "../auth/useAuth";
import AddCustomer from "./AddCustomer"; 
import CustomerList from "./CustomerList"; 
import LedgerHistory from "./LedgerHistory"; 
import Dashboard from "./Dashboard"; 
import "./ShopApp.css"; 
function ShopApp({ onBack }) { const { user, logout } = 
useAuth(); const [view, setView] = useState("dashboard"); 
const [selectedCustomer, setSelectedCustomer] = useState(null); 
const [refreshKey, setRefreshKey] = useState(0); async function handleLogout() 
{ await logout(); if (onBack) onBack(); } function openCustomers() 
{ setSelectedCustomer(null); setView("customers"); } function openDashboard() 
{ setSelectedCustomer(null); setView("dashboard"); } return ( <div className="shop-app"> 
<header className="shop-header"> <div className="shop-header-left"> 
<h1>ShopTab</h1> {user && ( <span className="shop-owner-badge"> 
👤{" "} {user.displayName || user.email?.split("@")[0] || "Shop Owner"} </span> )} 
</div> <div className="shop-header-actions"> {view === "customers" && !selectedCustomer && 
( <button type="button" className="header-btn" onClick={openDashboard} > Dashboard 
</button> )} <button type="button" className="header-btn" onClick={onBack}
> ← Website </button> {user && ( <button type="button" className="header-btn header-logout-btn" 
onClick={handleLogout} title="Sign out of ShopTab" > Log out </button> )} 
</div> </header> <main className="container"> {selectedCustomer ? ( <LedgerHistory customer={selectedCustomer} 
onBack={() => setSelectedCustomer(null)} /> ) : view === "dashboard" ? 
( <Dashboard onOpenCustomers={openCustomers} /> ) : ( <> <AddCustomer onAdded={() => 
setRefreshKey((key) => key + 1)} /> <CustomerList refreshKey={refreshKey} onSelect=
{setSelectedCustomer} /> </> )} </main> </div> ); } export default ShopApp;