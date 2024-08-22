import React, { useEffect, useState } from "react";
import Banner from "../components/Banner";
import Card from "../components/Card";
import Jobs from "./Jobs";
import FootSection from "../components/footSection";
import About from "../components/About";
import Sidebar from "../Sidebar/Sidebar";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";
import { useJobs } from "../context/jobsContext";

const Home = () => {
  const {jobs,isLoading}=useJobs;
  const [selectedCategory, setSelectedCategory] = useState({});
  // const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [totalJobs, setTotalJobs] = useState(0);
  // const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [refreshSidebar, setRefreshSidebar] = useState(false);

  // useEffect(() => {
  //   const jobRef = ref(database, "jobs");
  //   onValue(jobRef, (snapshot) => {
  //     const jobsData = snapshot.val();
  //     const loadedJobs = [];
  //     for (const id in jobsData) {
  //       if (jobsData[id].status === "approved") {
  //         loadedJobs.push({ id, ...jobsData[id] });
  //       }
  //     }
  //     // Reverse the jobs array to display the latest job first
  //     const reversedJobs = loadedJobs.reverse();
  //     setJobs(reversedJobs);
  //     setFilteredJobs(reversedJobs); // Initially set filteredJobs to all jobs
  //     setIsLoading(false);
  //   });
  // }, []);

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
      salaryType: value, // Ensure you're setting the correct filter category here
    }));
  };


  useEffect(() => {
    const applyFilters = () => {
      let filtered = jobs;

      if (query) {
        filtered = filtered.filter((job) =>
          job.jobTitle.toLowerCase().includes(query.toLowerCase())
        );
      }



      if (selectedCategory) {
        filtered = filtered.filter(
          ({ jobLocation, salaryType, experienceLevel, maxPrice, postingDate, employmentType }) => {
            let match = true;

            if (selectedCategory.location) {
              match = match && jobLocation.toLowerCase() === selectedCategory.location.toLowerCase();
            }
            if (selectedCategory.postingDate) {
              match = match && postingDate >= selectedCategory.postingDate;
            }
            if (selectedCategory.maxPrice) {
              match = match && parseInt(maxPrice) <= parseInt(selectedCategory.maxPrice);
            }
            if (selectedCategory.salaryType) {
              match = match && salaryType.toLowerCase() === selectedCategory.salaryType.toLowerCase();
            }
            if (selectedCategory.experienceLevel) {
              match = match && experienceLevel.toLowerCase() === selectedCategory.experienceLevel.toLowerCase();
            }
            if (selectedCategory.employmentType) {
              match = match && employmentType.toLowerCase() === selectedCategory.employmentType.toLowerCase();
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

          <div className="col-span-2 bg-sky-800 p-4 rounded-2xl">
            {isLoading ? (
              <p className="font-medium text-white">Loading...</p>
            ) : paginatedJobs.length > 0 ? (
              <Jobs result={paginatedJobs.map((data, i) => <Card key={i} data={data} />)} totalJobs={totalJobs} />
            ) : (
              <>
                <h3 className="text-lg font-bold mb-2 text-white">{paginatedJobs.length} Jobs</h3>
                <p>No data found</p>
              </>
            )}
            {totalJobs > itemsPerPage && (
              <div className="flex justify-center mt-4 space-x-8 text-white">
                <button onClick={prevPage} disabled={currentPage === 1} className="hover:underline">
                  Previous
                </button>
                <span className="mx-2">
                  Page {currentPage} of {Math.ceil(filteredJobs.length / itemsPerPage)}
                </span>
                <button
                  onClick={nextPage}
                  disabled={currentPage === Math.ceil(filteredJobs.length / itemsPerPage)}
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
