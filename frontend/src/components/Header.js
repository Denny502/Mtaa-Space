import React, { useState, useEffect } from "react";

function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <div className="container header-content">
        <a href="/" className="logo">RentHomes</a>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/">Rentals</a></li>
          <li><a href="/">Contacts</a></li>
          <li><a href="/">About</a></li>
        </ul>
        <div className="auth-buttons">
          <button className="btn btn-outline">Sign In</button>
          <button className="btn btn-primary">Sign Up</button>
        </div>
      </div>
    </header>
  );
}

export default Header;