import React from "react";
import { useNavigate } from "react-router-dom";

function AgentHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('agentUser');
    navigate('/');
  };

  const userData = JSON.parse(localStorage.getItem('agentUser') || '{}');

  return (
    <header className="agent-header">
      <div className="container header-content">
        <a href="/" className="logo">RentHomes</a>
        
        <div className="agent-nav">
          <span>Welcome, {userData.fullName || 'Agent'}!</span>
          <button className="btn btn-outline" onClick={() => navigate('/agent-dashboard')}>
            Dashboard
          </button>
          <button className="btn btn-outline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default AgentHeader;