import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AgentHeader from "../components/AgentHeader";

function AgentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("properties");
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [newProperty, setNewProperty] = useState({
    title: "",
    description: "",
    priceRange: { min: "", max: "" },
    location: "",
    bedroomRange: { min: "", max: "" },
    images: []
  });

  const userData = JSON.parse(localStorage.getItem('agentUser') || '{}');
  const [properties, setProperties] = useState([]);

  const handleAddProperty = (e) => {
    e.preventDefault();
    const property = {
      id: Date.now(),
      ...newProperty,
      status: "Active",
      agent: userData.fullName,
      dateAdded: new Date().toLocaleDateString(),
      type: "apartment"
    };
    
    const updatedProperties = [...properties, property];
    setProperties(updatedProperties);
    
    // Save to localStorage
    localStorage.setItem('agentProperties', JSON.stringify(updatedProperties));
    
    setShowAddProperty(false);
    setNewProperty({
      title: "", 
      description: "", 
      priceRange: { min: "", max: "" },
      location: "", 
      bedroomRange: { min: "", max: "" },
      images: []
    });
    
    // Redirect to rental listings page with the new property
    navigate('/rentals', { state: { newProperty: property } });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setNewProperty({...newProperty, images: imageUrls});
  };

  const handleDeleteProperty = (propertyId) => {
    if (window.confirm("Are you sure you want to delete this apartment?")) {
      const updatedProperties = properties.filter(property => property.id !== propertyId);
      setProperties(updatedProperties);
      localStorage.setItem('agentProperties', JSON.stringify(updatedProperties));
    }
  };

  const handleEditProperty = (propertyId) => {
    const propertyToEdit = properties.find(property => property.id === propertyId);
    setNewProperty(propertyToEdit);
    setShowAddProperty(true);
    const updatedProperties = properties.filter(property => property.id !== propertyId);
    setProperties(updatedProperties);
    localStorage.setItem('agentProperties', JSON.stringify(updatedProperties));
  };

  const handleRangeChange = (field, rangeType, value) => {
    setNewProperty({
      ...newProperty,
      [field]: {
        ...newProperty[field],
        [rangeType]: value
      }
    });
  };

  // Load properties from localStorage on component mount
  React.useEffect(() => {
    const savedProperties = JSON.parse(localStorage.getItem('agentProperties') || '[]');
    setProperties(savedProperties);
  }, []);

  if (!localStorage.getItem('isAuthenticated')) {
    return (
      <div className="not-authorized">
        <div className="container">
          <h2>Access Denied</h2>
          <p>Please sign in to access the agent dashboard.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="agent-dashboard">
      <AgentHeader />
      
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="container">
          <h1>Welcome back, {userData.fullName}!</h1>
          <p>Manage your apartment listings and connect with tenants</p>
        </div>
      </div>

      {/* Simple Stats Overview */}
      <section className="dashboard-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🏢</div>
              <h3>{properties.length}</h3>
              <p>Apartments Listed</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <h3>${properties.reduce((acc, prop) => acc + (parseInt(prop.priceRange.min) || 0), 0).toLocaleString()}</h3>
              <p>Total Value</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Navigation */}
      <section className="dashboard-nav">
        <div className="container">
          <div className="nav-tabs">
            <button 
              className={activeTab === "properties" && !showAddProperty ? "active" : ""}
              onClick={() => {
                setActiveTab("properties");
                setShowAddProperty(false);
              }}
            >
              📋 My Apartments
            </button>
            <button 
              className={`add-property-btn ${showAddProperty ? "active" : ""}`}
              onClick={() => {
                setActiveTab("add");
                setShowAddProperty(true);
              }}
            >
              <span className="btn-icon">+</span>
              Add New Apartment
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="container">
          {showAddProperty ? (
            <div className="add-property-form">
              <div className="form-header">
                <h2>{newProperty.id ? "Edit Apartment" : "List New Apartment"}</h2>
                <p>Fill in the details to {newProperty.id ? "update" : "list"} your apartment</p>
              </div>
              
              <form onSubmit={handleAddProperty}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Apartment Title *</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Spacious 2-Bedroom Apartment with Balcony"
                      value={newProperty.title}
                      onChange={(e) => setNewProperty({...newProperty, title: e.target.value})} 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Location *</label>
                    <input 
                      type="text" 
                      placeholder="Full address including city"
                      value={newProperty.location}
                      onChange={(e) => setNewProperty({...newProperty, location: e.target.value})} 
                      required 
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Price Range ($/month) *</label>
                    <div className="range-inputs">
                      <input 
                        type="number" 
                        placeholder="Min price"
                        value={newProperty.priceRange.min}
                        onChange={(e) => handleRangeChange('priceRange', 'min', e.target.value)} 
                        required 
                      />
                      <span className="range-separator">to</span>
                      <input 
                        type="number" 
                        placeholder="Max price"
                        value={newProperty.priceRange.max}
                        onChange={(e) => handleRangeChange('priceRange', 'max', e.target.value)} 
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label>Bedroom Range *</label>
                    <div className="range-inputs">
                      <input 
                        type="number" 
                        placeholder="Min bedrooms"
                        value={newProperty.bedroomRange.min}
                        onChange={(e) => handleRangeChange('bedroomRange', 'min', e.target.value)} 
                        required 
                      />
                      <span className="range-separator">to</span>
                      <input 
                        type="number" 
                        placeholder="Max bedrooms"
                        value={newProperty.bedroomRange.max}
                        onChange={(e) => handleRangeChange('bedroomRange', 'max', e.target.value)} 
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label>Apartment Description *</label>
                    <textarea 
                      placeholder="Describe your apartment in detail. Include features, amenities, nearby attractions, etc."
                      value={newProperty.description}
                      onChange={(e) => setNewProperty({...newProperty, description: e.target.value})} 
                      rows="4"
                      required 
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Apartment Images *</label>
                    <div className="file-upload">
                      <input 
                        type="file" 
                        multiple 
                        onChange={handleImageUpload} 
                        accept="image/*"
                        required={newProperty.images.length === 0}
                      />
                      <p>Upload high-quality images of your apartment (max 10 images)</p>
                      {newProperty.images.length > 0 && (
                        <div className="image-preview">
                          <p>{newProperty.images.length} image(s) selected</p>
                          <div className="image-thumbnails">
                            {newProperty.images.map((img, index) => (
                              <img key={index} src={img} alt={`Preview ${index + 1}`} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-outline" 
                    onClick={() => {
                      setShowAddProperty(false);
                      setNewProperty({
                        title: "", 
                        description: "", 
                        priceRange: { min: "", max: "" },
                        location: "", 
                        bedroomRange: { min: "", max: "" },
                        images: []
                      });
                    }}
                  >
                    ← Cancel
                  </button>
                  <button type="submit" className="btn-primary btn-submit">
                    <span className="btn-icon">✓</span>
                    {newProperty.id ? "Update Apartment" : "List Apartment & View Rentals"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="properties-section">
              <div className="section-header">
                <h2>My Apartments ({properties.length})</h2>
                <button 
                  className="add-property-btn-secondary" 
                  onClick={() => setShowAddProperty(true)}
                >
                  <span className="btn-icon">+</span>
                  Add New Apartment
                </button>
              </div>

              {properties.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🏢</div>
                  <h3>No Apartments Listed Yet</h3>
                  <p>Start by adding your first apartment to reach potential tenants!</p>
                  <button 
                    className="add-property-btn-secondary" 
                    onClick={() => setShowAddProperty(true)}
                  >
                    <span className="btn-icon">+</span>
                    Add Your First Apartment
                  </button>
                </div>
              ) : (
                <div className="properties-grid">
                  {properties.map(property => (
                    <div key={property.id} className="property-management-card">
                      <div className="property-image">
                        <img 
                          src={property.images[0] || "https://via.placeholder.com/400x250?text=Apartment+Image"} 
                          alt={property.title} 
                        />
                        <div className="property-badge">Apartment</div>
                        <div className={`property-status ${property.status.toLowerCase()}`}>
                          {property.status}
                        </div>
                      </div>
                      
                      <div className="property-info">
                        <h3>{property.title}</h3>
                        <p className="property-location">📍 {property.location}</p>
                        <p className="property-price">
                          ${parseInt(property.priceRange.min).toLocaleString()} - ${parseInt(property.priceRange.max).toLocaleString()}/month
                        </p>
                        
                        <div className="property-details">
                          <span className="detail-badge">🛏️ {property.bedroomRange.min}-{property.bedroomRange.max} BR</span>
                        </div>
                        
                        <p className="property-description">
                          {property.description.length > 100 
                            ? property.description.substring(0, 100) + '...' 
                            : property.description
                          }
                        </p>
                        
                        <div className="property-meta">
                          <span className="agent">👤 {property.agent}</span>
                          <span className="date">📅 {property.dateAdded}</span>
                        </div>
                      </div>
                      
                      <div className="property-actions">
                        <button 
                          className="btn-outline" 
                          onClick={() => handleEditProperty(property.id)}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className="btn-danger" 
                          onClick={() => handleDeleteProperty(property.id)}
                        >
                          🗑️ Delete
                        </button>
                        <button 
                          className="btn-primary"
                          onClick={() => navigate('/rentals')}
                        >
                          👀 View on Rentals
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AgentDashboard;