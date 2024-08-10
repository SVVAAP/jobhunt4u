import React, { useEffect, useState } from "react";
import Banner from "../components/Banner";
import Card from "../components/Card";
import Jobs from "./Jobs";
import FootSection from "../components/footSection";
import About from "../components/About";
import Sidebar from "../Sidebar/Sidebar";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState({});
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [totalJobs, setTotalJobs] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [refreshSidebar, setRefreshSidebar] = useState(false);

  useEffect(() => {
    const jobRef = ref(database, "jobs");
    onValue(jobRef, (snapshot) => {
      const jobsData = snapshot.val();
      const loadedJobs = [];
      for (const id in jobsData) {
        if (jobsData[id].status === "approved") {
          loadedJobs.push({ id, ...jobsData[id] });
        }
      }
      setJobs(loadedJobs);
      setIsLoading(false);
    });
  }, []);

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

  const calculatePageRange = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return { startIndex, endIndex };
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredItems.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const filteredItems = jobs.filter((job) => job.jobTitle.toLowerCase().indexOf(query.toLowerCase()) !== -1);

  const filteredData = (jobs, selected, query) => {
    let filteredJobs = jobs;

    if (query) {
      filteredJobs = filteredJobs.filter((job) => job.jobTitle.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }

    if (selected) {
      filteredJobs = filteredJobs.filter(
        ({ jobLocation, salaryType, experienceLevel, maxPrice, postingDate, employmentType }) => {
          let match = true;

          if (selected.location) {
            match = match && jobLocation.toLowerCase() === selected.location.toLowerCase();
          }
          if (selected.postingDate) {
            match = match && postingDate >= selected.postingDate;
          }
          if (selected.maxPrice) {
            match = match && parseInt(maxPrice) <= parseInt(selected.maxPrice);
          }
          if (selected.salaryType) {
            match = match && salaryType.toLowerCase() === selected.salaryType.toLowerCase();
          }
          if (selected.experienceLevel) {
            match = match && experienceLevel.toLowerCase() === selected.experienceLevel.toLowerCase();
          }
          if (selected.employmentType) {
            match = match && employmentType.toLowerCase() === selected.employmentType.toLowerCase();
          }

          return match;
        }
      );
    }

    const totalFilteredJobs = filteredJobs.length;

    const { startIndex, endIndex } = calculatePageRange();
    filteredJobs = filteredJobs.slice(startIndex, endIndex);

    return {
      result: filteredJobs.map((data, i) => <Card key={i} data={data} />),
      totalLength: totalFilteredJobs,
    };
  };

  const { result, totalLength } = filteredData(jobs, selectedCategory, query);

  useEffect(() => {
    setTotalJobs(totalLength);
  }, [totalLength]);

  return (
    <>
      <div>
        <Banner query={query} handleInputChange={handleInputChange} />
        <div className=" md:grid grid-cols-3 gap-8 lg:px-12 px-4 py-6">
          <div className="rounded">
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
            ) : result.length > 0 ? (
              <Jobs result={result} totalJobs={totalJobs} />
            ) : (
              <>
                <h3 className="text-lg font-bold mb-2 text-white">{result.length} Jobs</h3>
                <p>No data found</p>
              </>
            )}
            {result.length > 5 && (
              <div className="flex justify-center mt-4 space-x-8 text-white">
                <button onClick={prevPage} disabled={currentPage === 1} className="hover:underline">
                  Previous
                </button>
                <span className="mx-2">
                  Page {currentPage} of {Math.ceil(filteredItems.length / itemsPerPage)}
                </span>
                <button
                  onClick={nextPage}
                  disabled={currentPage === Math.ceil(filteredItems.length / itemsPerPage)}
                  className="hover:underline">
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
