import React from "react";

function PropertyCard({ property }) {
  return (
    <div className="property-card">
      <img src={property.image} alt={property.address} className="property-image" />
      <div className="property-details">
        <div className="property-price">{property.price}</div>
        <div className="property-address">{property.address}</div>
      </div>
    </div>
  );
}

export default PropertyCard;
