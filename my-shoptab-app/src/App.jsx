import { useState } from "react";
import { useAuth } from "./auth/useAuth";
import Navbar from "./components/Navbar";

import Hero from "./components/Hero";
import Partners from "./components/Partners";
import Features from "./components/Features";
import Steps from "./components/Steps";
import Solutions from "./components/Solutions";
import Stats from "./components/Stats";
import CallToAction from "./components/CallToAction";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import ShopApp from "./app/ShopApp";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [authModalMode, setAuthModalMode] = useState(null); // "login" | "signup" | null
  const { user, logout } = useAuth();

  // Opens the ShopTab notebook app
  function openApp() {
    setPage("app");
    window.scrollTo(0, 0);
  }

  function handleLogin() {
    setAuthModalMode("login");
  }

  function handleSignup() {
    setAuthModalMode("signup");
  }

  function handleCloseModal() {
    setAuthModalMode(null);
  }

  function handleAuthSuccess() {
    // When login/signup succeeds, open the shop notebook directly
    openApp();
  }

  if (page === "app") {
    return <ShopApp onBack={() => setPage("home")} />;
  }

  return (
    <div id="top">
      <Navbar
        onGetStarted={openApp}
        onLogin={handleLogin}
        onSignup={handleSignup}
        user={user}
        onLogout={logout}
      />
      <Hero
        onGetStarted={openApp}
        onSignup={handleSignup}
        onLogin={handleLogin}
        user={user}
      />
      <Partners />
      <Features />
      <Steps />
      <Solutions />
      <Stats />
      <CallToAction
        onGetStarted={openApp}
        onSignup={handleSignup}
        onLogin={handleLogin}
        user={user}
      />
      <Footer />

      {authModalMode && (
        <AuthModal
          key={authModalMode}
          initialMode={authModalMode}
          onClose={handleCloseModal}
          onSuccess={handleAuthSuccess}
        />
      )}

    </div>
  );
}

export default App;
