import React, { useEffect, useState } from 'react';
import { useJobs } from '../context/jobsContext';

function Category({ handleChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategory, setFilteredCategory] = useState([]);
  const { jobs } = useJobs();
  const [catogerys, setCatogerys] = useState([]);

  useEffect(() => {
    if (jobs) {
      const uniqueCatogerys = [...new Set(jobs.map(job => job.jobCategory))]
        .sort((a, b) => a.localeCompare(b)); // Sort categories alphabetically
      setCatogerys(uniqueCatogerys);
      setFilteredCategory(uniqueCatogerys); // Set initially to show all categories
    }
  }, [jobs]);

  return (
    <div className="bg-white rounded-lg p-3">
      <h4 className="text-lg font-medium mb-2">Category</h4>
      <div>
        <label className="sidebar-label-container">
          <input onChange={handleChange} type="radio" value="" name="jobCategory" />
          <span className="checkmark"></span>All
        </label>
        
        <div className="mt-2 max-h-40 overflow-y-auto rounded">
          {filteredCategory.map(category => (
            <div key={category}>
              <label className="sidebar-label-container">
                <input
                  onChange={handleChange}
                  type="radio"
                  value={category}
                  name="jobCategory"
                />
                <span className="checkmark"></span>{category}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Category;
