import React, { useEffect, useState } from "react";
import Banner from "../components/Banner";
import Card from "../components/Card";
import Jobs from "./Jobs";
import FootSection from "../components/footSection";
import About from "../components/About";
import Sidebar from "../Sidebar/Sidebar";

import { useJobs } from "../context/jobsContext";

const Home = () => {
  const { jobs, isLoading } = useJobs(); // Correctly invoke useJobs
  const [selectedCategory, setSelectedCategory] = useState({});
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [totalJobs, setTotalJobs] = useState(0);
  const [query, setQuery] = useState("");
  const [refreshSidebar, setRefreshSidebar] = useState(false);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSelectedCategory((prevSelected) => ({
      ...prevSelected,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setSelectedCategory({});
    setQuery("");
    setRefreshSidebar((prev) => !prev); // Toggle the state to force re-render
  };

  const handleClick = (event) => {
    const { value } = event.target;
    setSelectedCategory((prevSelected) => ({
      ...prevSelected,
      salaryType: value,
    }));
  };

  useEffect(() => {
    const applyFilters = () => {
      if (!jobs) return; // Add check to avoid filtering on undefined jobs

      let filtered = jobs;

      if (query) {
        filtered = filtered.filter((job) =>
          job.jobTitle.toLowerCase().includes(query.toLowerCase())
        );
      }

      if (selectedCategory) {
        filtered = filtered.filter(
          ({
            jobLocation,
            salaryType,
            experienceLevel,
            maxPrice,
            postingDate,
            employmentType,
            jobCategory
          }) => {
            let match = true;

            if (selectedCategory.location) {
              match =
                match &&
                jobLocation.toLowerCase() ===
                  selectedCategory.location.toLowerCase();
            }
            if (selectedCategory.postingDate) {
              match = match && postingDate >= selectedCategory.postingDate;
            }
            if (selectedCategory.maxPrice) {
              match =
                match &&
                parseInt(maxPrice) <= parseInt(selectedCategory.maxPrice);
            }
            if (selectedCategory.salaryType) {
              match =
                match &&
                salaryType.toLowerCase() ===
                  selectedCategory.salaryType.toLowerCase();
            }
            if (selectedCategory.experienceLevel) {
              match =
                match &&
                experienceLevel.toLowerCase() ===
                  selectedCategory.experienceLevel.toLowerCase();
            }
            if (selectedCategory.employmentType) {
              match =
                match &&
                employmentType.toLowerCase() ===
                  selectedCategory.employmentType.toLowerCase();
            }
            if (selectedCategory.jobCategory) {
              match =
                match &&
                jobCategory ===
                  selectedCategory.jobCategory;
            }


            return match;
          }
        );
      }

      setFilteredJobs(filtered);
      setTotalJobs(filtered.length); // Update totalJobs based on filtered data
      setCurrentPage(1); // Reset to the first page
    };

    applyFilters();
  }, [jobs, selectedCategory, query]);

  const calculatePageRange = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return { startIndex, endIndex };
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredJobs.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const { startIndex, endIndex } = calculatePageRange();
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  return (
    <>
      <div>
        <Banner query={query} handleInputChange={handleInputChange} />
        <div className="md:grid grid-cols-3 gap-8 lg:px-12 px-4 py-6">
          <div className="rounded mb-6">
            <Sidebar
              key={refreshSidebar}
              handleChange={handleChange}
              handleClick={handleClick}
              clearFilters={clearFilters}
            />
          </div>

          <div className="col-span-2 bg-sky-800 p-4 rounded-lg">
            {isLoading ? (
              <p className="font-medium text-white">Loading...</p>
            ) : paginatedJobs.length > 0 ? (
              <Jobs
                result={paginatedJobs.map((data, i) => (
                  <Card key={i} data={data} />
                ))}
                totalJobs={totalJobs}
              />
            ) : (
              <>
                <h3 className="text-lg font-bold mb-2 text-white">
                  {paginatedJobs.length} Jobs
                </h3>
                <p>No data found</p>
              </>
            )}
            {totalJobs > itemsPerPage && (
              <div className="flex justify-center mt-4 space-x-8 text-white">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="hover:underline"
                >
                  Previous
                </button>
                <span className="mx-2">
                  Page {currentPage} of{" "}
                  {Math.ceil(filteredJobs.length / itemsPerPage)}
                </span>
                <button
                  onClick={nextPage}
                  disabled={
                    currentPage ===
                    Math.ceil(filteredJobs.length / itemsPerPage)
                  }
                  className="hover:underline"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
        
      </div>
      <div>
        <About />
      </div>
     
      <div>
        <FootSection />
      </div>
    </>
  );
};

export default Home;
