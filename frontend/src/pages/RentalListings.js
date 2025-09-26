import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { useLocation } from "react-router-dom";

function RentalListings() {
  const location = useLocation();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: { min: "", max: "" },
    bedrooms: { min: "", max: "" },
    location: ""
  });
  const [sortBy, setSortBy] = useState("newest");

  // Load properties from localStorage or use passed props
  useEffect(() => {
    const savedProperties = JSON.parse(localStorage.getItem('agentProperties') || '[]');
    
    if (location.state && location.state.newProperty) {
      // If coming from dashboard with new property
      const updatedProperties = [...savedProperties, location.state.newProperty];
      setProperties(updatedProperties);
      setFilteredProperties(updatedProperties);
      localStorage.setItem('agentProperties', JSON.stringify(updatedProperties));
    } else {
      // Load existing properties
      setProperties(savedProperties);
      setFilteredProperties(savedProperties);
    }
  }, [location.state]);

  // Apply filters
  useEffect(() => {
    let results = properties;

    // Price filter
    if (filters.priceRange.min) {
      results = results.filter(prop => 
        parseInt(prop.priceRange.min) >= parseInt(filters.priceRange.min)
      );
    }
    if (filters.priceRange.max) {
      results = results.filter(prop => 
        parseInt(prop.priceRange.max) <= parseInt(filters.priceRange.max)
      );
    }

    // Bedroom filter
    if (filters.bedrooms.min) {
      results = results.filter(prop => 
        parseInt(prop.bedroomRange.min) >= parseInt(filters.bedrooms.min)
      );
    }
    if (filters.bedrooms.max) {
      results = results.filter(prop => 
        parseInt(prop.bedroomRange.max) <= parseInt(filters.bedrooms.max)
      );
    }

    // Location filter
    if (filters.location) {
      results = results.filter(prop =>
        prop.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Sort results
    results = sortProperties(results, sortBy);

    setFilteredProperties(results);
  }, [filters, properties, sortBy]);

  const sortProperties = (properties, sortType) => {
    const sorted = [...properties];
    switch (sortType) {
      case "price-low":
        return sorted.sort((a, b) => parseInt(a.priceRange.min) - parseInt(b.priceRange.min));
      case "price-high":
        return sorted.sort((a, b) => parseInt(b.priceRange.max) - parseInt(a.priceRange.max));
      case "bedrooms":
        return sorted.sort((a, b) => parseInt(b.bedroomRange.max) - parseInt(a.bedroomRange.max));
      case "newest":
      default:
        return sorted.sort((a, b) => b.id - a.id);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleRangeFilterChange = (filterType, rangeType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: {
        ...prev[filterType],
        [rangeType]: value
      }
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: { min: "", max: "" },
      bedrooms: { min: "", max: "" },
      location: ""
    });
  };

  const handleInquire = (property) => {
    alert(`Inquiry sent for ${property.title}! The agent will contact you soon.`);
  };

  return (
    <div className="rental-listings">
      <Header />
      
      {/* Hero Section */}
      <section className="listings-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Find Your Perfect Apartment</h1>
            <p>Browse through our curated selection of quality apartments available for rent</p>
          </div>
        </div>
      </section>

      {/* Filters and Search Section */}
      <section className="listings-filters">
        <div className="container">
          <div className="filters-container">
            <div className="filter-group">
              <label>Location</label>
              <input
                type="text"
                placeholder="Enter city or area"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Price Range ($)</label>
              <div className="range-filters">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange.min}
                  onChange={(e) => handleRangeFilterChange('priceRange', 'min', e.target.value)}
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange.max}
                  onChange={(e) => handleRangeFilterChange('priceRange', 'max', e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Bedrooms</label>
              <div className="range-filters">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.bedrooms.min}
                  onChange={(e) => handleRangeFilterChange('bedrooms', 'min', e.target.value)}
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.bedrooms.max}
                  onChange={(e) => handleRangeFilterChange('bedrooms', 'max', e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Sort by</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="bedrooms">Most Bedrooms</option>
              </select>
            </div>

            <button className="clear-filters" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="listings-results">
        <div className="container">
          <div className="results-header">
            <h2>
              {filteredProperties.length} Apartment{filteredProperties.length !== 1 ? 's' : ''} Available
              {filters.location && ` in ${filters.location}`}
            </h2>
            <div className="results-stats">
              <span>Sorted by: {sortBy.replace('-', ' ')}</span>
            </div>
          </div>

          {filteredProperties.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🏢</div>
              <h3>No apartments found</h3>
              <p>Try adjusting your filters or search criteria</p>
              <button onClick={clearFilters} className="btn-primary">
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="properties-grid">
              {filteredProperties.map(property => (
                <div key={property.id} className="property-listing-card">
                  <div className="property-image">
                    <img 
                      src={property.images[0] || "https://via.placeholder.com/400x300?text=Apartment+Image"} 
                      alt={property.title}
                    />
                    <div className="property-badge">Apartment</div>
                    <div className="property-featured">Featured</div>
                  </div>
                  
                  <div className="property-content">
                    <div className="property-header">
                      <h3>{property.title}</h3>
                      <div className="property-price">
                        ${parseInt(property.priceRange.min).toLocaleString()} - ${parseInt(property.priceRange.max).toLocaleString()}
                        <span>/month</span>
                      </div>
                    </div>
                    
                    <p className="property-location">📍 {property.location}</p>
                    
                    <div className="property-features">
                      <span className="feature">
                        <strong>🛏️ {property.bedroomRange.min}-{property.bedroomRange.max} BR</strong>
                      </span>
                      <span className="feature">🏢 Apartment</span>
                      <span className="feature">📅 {property.dateAdded}</span>
                    </div>
                    
                    <p className="property-description">
                      {property.description.length > 120 
                        ? property.description.substring(0, 120) + '...' 
                        : property.description
                      }
                    </p>
                    
                    <div className="property-agent">
                      <span>Listed by: {property.agent}</span>
                    </div>
                    
                    <div className="property-actions">
                      <button 
                        className="btn-outline"
                        onClick={() => document.getElementById(`details-${property.id}`).showModal()}
                      >
                        View Details
                      </button>
                      <button 
                        className="btn-primary"
                        onClick={() => handleInquire(property)}
                      >
                        Contact Agent
                      </button>
                    </div>
                  </div>

                  {/* Property Details Modal */}
                  <dialog id={`details-${property.id}`} className="property-modal">
                    <div className="modal-content">
                      <button 
                        className="modal-close"
                        onClick={() => document.getElementById(`details-${property.id}`).close()}
                      >
                        ×
                      </button>
                      
                      <div className="modal-images">
                        <img 
                          src={property.images[0] || "https://via.placeholder.com/600x400?text=Apartment+Image"} 
                          alt={property.title}
                        />
                      </div>
                      
                      <div className="modal-details">
                        <h2>{property.title}</h2>
                        <div className="modal-price">
                          ${parseInt(property.priceRange.min).toLocaleString()} - ${parseInt(property.priceRange.max).toLocaleString()}/month
                        </div>
                        
                        <div className="modal-features">
                          <div className="feature-item">
                            <span>🏢 Type:</span>
                            <strong>Apartment</strong>
                          </div>
                          <div className="feature-item">
                            <span>🛏️ Bedrooms:</span>
                            <strong>{property.bedroomRange.min}-{property.bedroomRange.max}</strong>
                          </div>
                          <div className="feature-item">
                            <span>📍 Location:</span>
                            <strong>{property.location}</strong>
                          </div>
                          <div className="feature-item">
                            <span>👤 Agent:</span>
                            <strong>{property.agent}</strong>
                          </div>
                          <div className="feature-item">
                            <span>📅 Listed:</span>
                            <strong>{property.dateAdded}</strong>
                          </div>
                        </div>
                        
                        <div className="modal-description">
                          <h4>Description</h4>
                          <p>{property.description}</p>
                        </div>
                        
                        <div className="modal-actions">
                          <button 
                            className="btn-primary"
                            onClick={() => handleInquire(property)}
                          >
                            📞 Contact Agent
                          </button>
                          <button 
                            className="btn-outline"
                            onClick={() => document.getElementById(`details-${property.id}`).close()}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </dialog>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default RentalListings;