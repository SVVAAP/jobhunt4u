import React, { useState } from "react";

const Location = ({ handleChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);
  const locations = ["London", "Seattle", "Madrid", "Boston"];

  const handleSearch = () => {
    const filtered = locations.filter(location =>
      location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLocations(filtered);
  };

  return (
    <div>
      <h4 className="text-lg font-medium mb-2">Location</h4>
      <div>
        <label className="sidebar-label-container">
          <input onChange={handleChange} type="radio" value="" name="location" />
          <span className="checkmark"></span>All
        </label>
        
        <input
          type="text"
          placeholder="Search location"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="form-input mt-2 mb-2 border-gray-300 "
        />
        
        <button onClick={handleSearch} className="btn btn-primary mb-2">Search</button>
        
        {filteredLocations.map(location => (
          <div key={location}>
            <label className="sidebar-label-container">
              <input
                onChange={handleChange}
                type="radio"
                value={location.toLowerCase()}
                name="location"
              />
              <span className="checkmark"></span>{location}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Location;
