import React from "react";

function PropertyList({ properties }) {
  if (properties.length === 0) {
    return <p className="no-results">No rentals found.</p>;
  }

  return (
    <div className="property-list">
      {properties.map((property) => (
        <div key={property.id} className="property-card">
          <img src={property.image} alt={property.title} />
          <h3>{property.title}</h3>
          <p>{property.location}</p>
          <p>€{property.price.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default PropertyList;
