// Change the brand name here and it updates everywhere
export const brand = "ShopTab";

export const navLinks = [
  { label: "Why ShopTab", href: "#features" },
  { label: "How it works", href: "#steps" },
  { label: "Features", href: "#solutions" },
];

export const partners = ["Provision stores", "Market stalls", "Pharmacies", "Salons", "Mini-marts"];

export const features = [
  { number: "01", title: "Track every debt", text: "Record what each customer owes you in a few taps." },
  { number: "02", title: "Record payments", text: "Log cash or transfer payments the moment they come in." },
  { number: "03", title: "Balances that add up", text: "Every balance is simply credits minus payments." },
  { number: "04", title: "WhatsApp reminders", text: "Send a polite reminder to a customer with one tap." },
];

export const steps = [
  { title: "Add your customers", text: "Save a name and a phone number. That is all you need." },
  { title: "Record credits and payments", text: "For example ₦4,500 for Rice, or ₦2,000 paid via Cash." },
  { title: "Send a reminder", text: "Open WhatsApp with a ready message and press send." },
];

export const solutions = [
  {
    tab: "Customers",
    title: "Keep your customer list",
    text: "Add a customer with just a name and a phone number.",
    points: ["Name and phone only", "See every balance in one list", "Tap a customer to open their history"],
  },
  {
    tab: "Ledger",
    title: "A clear history for every customer",
    text: "See every credit and payment in order.",
    points: ["Credits and payments in one list", "A short note on each entry, like Rice or Cash", "The balance updates by itself"],
  },
  {
    tab: "Reminders",
    title: "Remind customers politely",
    text: "Open WhatsApp with a message that is ready to send.",
    points: ["Includes the customer's name", "Includes their current balance", "Includes your shop name"],
  },
];

export const stats = [
  { number: "2", label: "Entry types: credit and payment" },
  { number: "1 tap", label: "To send a reminder" },
  { number: "0", label: "Complicated bookkeeping" },
  { number: "Phone", label: "First, built for small screens" },
];

export const footerColumns = [
  { title: "Product", links: ["Customers", "Ledger", "Reminders"] },
  { title: "Company", links: ["About", "Contact"] },
  { title: "Legal", links: ["Privacy", "Terms"] },
];
