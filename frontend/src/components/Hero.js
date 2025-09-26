import React from "react";
import SearchForm from "./SearchForm";

function Hero({ onSearch }) {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <div className="container hero-content">
          <h1>Finding Your New Home Is Simple</h1>
          <p>
            RentHomes.com is your go-to destination for finding the perfect rental home. 
            With thousands of property listings across the United States and Europe.
          </p>
          <SearchForm onSearch={onSearch} />
        </div>
      </div>
    </section>
  );
}

export default Hero;
