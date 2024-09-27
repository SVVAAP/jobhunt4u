import React, { useEffect, useState } from "react";
import { useJobs } from "../context/jobsContext";

const Location = ({ handleChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);
  const { jobs } = useJobs();
  const [locations, setLocations] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (jobs) {
      const uniqueLocations = [...new Set(jobs.map(job => job.jobLocation))];
      setLocations(uniqueLocations);
      setFilteredLocations(uniqueLocations); // Set initially to show all locations
    }
  }, [jobs]);

  useEffect(() => {
    const filtered = locations.filter(location =>
      location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLocations(filtered);
  }, [searchTerm, locations]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg p-3">
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
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="form-input mt-1 mb-1 border-gray-300 p-2" 
          className="form-input mt-1 mb-1 border-gray-300 p-1" 
        />
        
          <div className="mt-1 max-h-40 overflow-y-auto  rounded">
          <div className="mt-1 max-h-40 overflow-y-auto  rounded">
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
    </div>
  );
};

export default Location;
