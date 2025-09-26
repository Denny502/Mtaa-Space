// src/components/Footer.js - COMPLETE VERSION
import React, { useState } from "react";
import SignupPopup from "./SignupPopup";
import { useNavigate } from "react-router-dom";

function Footer() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();

  const handleListProperty = () => {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (isAuthenticated) {
      navigate('/agent-dashboard');
    } else {
      setIsPopupOpen(true);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleAuthSuccess = () => {
    handleClosePopup();
    navigate('/agent-dashboard'); // Redirect to dashboard after successful auth
  };

  return (
    <>
      <footer>
        <div className="container footer-content">
          <div className="footer-column">
            <h3>RentHomes</h3>
            <p>
              Search thousands of rental properties with ease. 
              Your next home is just a few clicks away.
            </p>
          </div>
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><a href="/">Browse Rentals</a></li>
              <li><a href="/">Find Apartments</a></li>
              <li><a href="/">Rental Guides</a></li>
              <li><a href="/">Contact Support</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Resources</h3>
            <ul className="footer-links">
              <li><a href="/">Blog</a></li>
              <li><a href="/">Neighborhood Info</a></li>
              <li><a href="/">Moving Tips</a></li>
              <li><a href="/">FAQ</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>For Agents & Landlords</h3>
            <div className="agent-actions">
              <p>List your properties and reach thousands of potential tenants.</p>
              <div className="footer-auth-buttons">
                <button className="footer-btn footer-btn-primary" onClick={handleListProperty}>
                  List Your Property
                </button>
              </div>
            </div>
          </div>
          <div className="footer-column">
            <h3>Legal</h3>
            <ul className="footer-links">
              <li><a href="/">Terms of Service</a></li>
              <li><a href="/">Privacy Policy</a></li>
              <li><a href="/">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; 2025 RentHomes. All rights reserved.</p>
        </div>
      </footer>

      <SignupPopup 
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}

export default Footer;