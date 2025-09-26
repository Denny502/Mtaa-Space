import React from "react";
import { Link } from "react-router-dom";
import "./App.css"; // optional if using App.css

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">MtaaHomes</h2>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>
          <Link to="/support">Support</Link>
        </li>
        <li>
          <Link to="/location">Location</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
