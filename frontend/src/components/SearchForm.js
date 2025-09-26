import React, { useState } from "react";

// Updated SearchForm.js to match the image
function SearchForm({ onSearch }) {
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ location, type, maxPrice });
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="City Street"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="apartment">Apartment</option>
      </select>
      <input
        type="number"
        placeholder="Price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}
export default SearchForm;