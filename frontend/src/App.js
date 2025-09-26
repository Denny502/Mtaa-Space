import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AgentDashboard from "./pages/AgentDashboard";
import RentalListings from './pages/RentalListings';
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agent-dashboard" element={<AgentDashboard />} />
        <Route path="/rentals" element={<RentalListings />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;