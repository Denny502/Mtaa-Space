// src/components/SignupPopup.js - UPDATED
import React, { useState } from "react";

function SignupPopup({ isOpen, onClose, onSuccess }) {
  const [activeForm, setActiveForm] = useState("choice"); // 'choice', 'signup', 'signin'
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    userType: "agent" // 'agent' or 'landlord'
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    // Simulate API call - in real app, this would connect to your backend
    console.log("Sign up data:", formData);
    
    // Simple validation
    if (formData.fullName && formData.email && formData.password) {
      // Store user data in localStorage (simulate successful registration)
      localStorage.setItem('agentUser', JSON.stringify(formData));
      localStorage.setItem('isAuthenticated', 'true');
      
      onSuccess(); // Redirect to dashboard
    } else {
      alert("Please fill in all required fields");
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    // Simulate sign in logic
    console.log("Sign in data:", { email: formData.email, password: formData.password });
    
    if (formData.email && formData.password) {
      // Check if user exists (in real app, this would be an API call)
      const storedUser = localStorage.getItem('agentUser');
      
      if (storedUser) {
        localStorage.setItem('isAuthenticated', 'true');
        onSuccess(); // Redirect to dashboard
      } else {
        alert("No account found. Please create an account first.");
        setActiveForm("signup");
      }
    } else {
      alert("Please enter email and password");
    }
  };

  const renderChoiceScreen = () => (
    <div className="popup-content">
      <h2>Join RentHomes as an Agent</h2>
      <p>Sign in to your account or create a new one to list your properties and reach thousands of potential tenants.</p>
      
      <div className="popup-actions">
        <button 
          className="popup-btn popup-btn-primary" 
          onClick={() => setActiveForm("signup")}
        >
          Create Agent Account
        </button>
        
        <button 
          className="popup-btn popup-btn-outline" 
          onClick={() => setActiveForm("signin")}
        >
          Sign In to Existing Account
        </button>
      </div>
      
      <div className="popup-benefits">
        <h4>Benefits of becoming an agent:</h4>
        <ul>
          <li>✅ List unlimited properties</li>
          <li>✅ Reach thousands of potential tenants</li>
          <li>✅ Professional listing dashboard</li>
          <li>✅ Performance analytics</li>
          <li>✅ Priority customer support</li>
        </ul>
      </div>
    </div>
  );

  const renderSignUpForm = () => (
    <form onSubmit={handleSignUp} className="auth-form">
      <h2>Create Agent Account</h2>
      
      <div className="form-group">
        <label>Full Name *</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="Enter your full name"
          required
        />
      </div>

      <div className="form-group">
        <label>Email Address *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="form-group">
        <label>Phone Number *</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Enter your phone number"
          required
        />
      </div>

      <div className="form-group">
        <label>I am a *</label>
        <select name="userType" value={formData.userType} onChange={handleInputChange} required>
          <option value="agent">Real Estate Agent</option>
          <option value="landlord">Property Owner/Landlord</option>
        </select>
      </div>

      <div className="form-group">
        <label>Password *</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Create a password"
          required
        />
      </div>

      <div className="form-actions">
        <button type="button" className="popup-btn popup-btn-outline" onClick={() => setActiveForm("choice")}>
          Back
        </button>
        <button type="submit" className="popup-btn popup-btn-primary">
          Create Account
        </button>
      </div>
    </form>
  );

  const renderSignInForm = () => (
    <form onSubmit={handleSignIn} className="auth-form">
      <h2>Sign In to Your Account</h2>
      
      <div className="form-group">
        <label>Email Address *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="form-group">
        <label>Password *</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Enter your password"
          required
        />
      </div>

      <div className="form-actions">
        <button type="button" className="popup-btn popup-btn-outline" onClick={() => setActiveForm("choice")}>
          Back
        </button>
        <button type="submit" className="popup-btn popup-btn-primary">
          Sign In
        </button>
      </div>

      <p className="switch-form">
        Don't have an account?{" "}
        <button type="button" className="text-link" onClick={() => setActiveForm("signup")}>
          Create one here
        </button>
      </p>
    </form>
  );

  return (
    <div className="popup-overlay">
      <div className="signup-popup">
        <button className="close-btn" onClick={onClose}>×</button>
        
        {activeForm === "choice" && renderChoiceScreen()}
        {activeForm === "signup" && renderSignUpForm()}
        {activeForm === "signin" && renderSignInForm()}
      </div>
    </div>
  );
}

export default SignupPopup;