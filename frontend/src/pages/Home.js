import React, { useState } from "react";
import Header from "../components/Header";
import SearchForm from "../components/SearchForm";
import PropertyList from "../components/PropertyList";

function Home() {
  const [properties] = useState([
    {
      id: 1,
      title: "Ocean Breeze Villa",
      location: "123 Main Street, Anywhere, CA 12345",
      price: 910000,
      image: "https://via.placeholder.com/500x300?text=Ocean+Breeze+Villa",
      type: "villa"
    },
    {
      id: 2,
      title: "Jakson House",
      location: "456 Oak Avenue, New York, NY 10001",
      price: 750000,
      image: "https://via.placeholder.com/500x300?text=Jakson+House",
      type: "house"
    },
    {
      id: 3,
      title: "Lakeside Cottage",
      location: "789 Maple Lane, Los Angeles, CA 90001",
      price: 540000,
      image: "https://via.placeholder.com/500x300?text=Lakeside+Cottage",
      type: "cottage"
    },
  ]);

  const [filtered, setFiltered] = useState(properties);

  const handleSearch = (filters) => {
    const { location, type, maxPrice } = filters;
    let results = properties;

    if (location) {
      results = results.filter((p) =>
        p.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (type) {
      results = results.filter((p) => p.type === type);
    }

    if (maxPrice) {
      results = results.filter((p) => p.price <= parseInt(maxPrice, 10));
    }

    setFiltered(results);
  };

  return (
    <div>
      <Header />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Finding Your New Home Is Simple</h1>
          <p>
            RentHomes.com is your go-to destination for finding the perfect
            rental home to suit your needs.
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="search-bar-container">
          <SearchForm onSearch={handleSearch} />
        </div>
      </section>

      {/* Most Viewed Section */}
      <section className="most-viewed">
        <h2>Most Viewed</h2>
        <p>
          Discover a range of vacation homes worldwide. Book securely and get
          expert customer support for a stress-free stay.
        </p>
        <PropertyList properties={filtered} />
      </section>
    </div>
  );
}

export default Home;