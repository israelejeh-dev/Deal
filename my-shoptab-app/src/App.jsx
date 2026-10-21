import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Partners from "./components/Partners";
import Features from "./components/Features";
import Steps from "./components/Steps";
import Solutions from "./components/Solutions";
import Stats from "./components/Stats";
import CallToAction from "./components/CallToAction";
import Footer from "./components/Footer";
import ShopApp from "./app/ShopApp";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");

  // "Get started" opens the ShopTab app
  function openApp() {
    setPage("app");
    window.scrollTo(0, 0);
  }

  if (page === "app") {
    return <ShopApp onBack={() => setPage("home")} />;
  }

  return (
    <div id="top">
      <Navbar onGetStarted={openApp} />
      <Hero onGetStarted={openApp} />
      <Partners />
      <Features />
      <Steps />
      <Solutions />
      <Stats />
      <CallToAction onGetStarted={openApp} />
      <Footer />
    </div>
  );
}

export default App;
