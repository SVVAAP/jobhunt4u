import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Card from "../components/Card";
import { useJobs } from "../context/jobsContext";
import Jobs from "./Jobs";

const Home_Emp = () => {
  const { jobs, user, isLoading } = useJobs();
  const userJobs = jobs?.filter((data) => data.postedBy === user.email);

  const [selectedCategory, setSelectedCategory] = useState({});
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
      salaryType: value, // Ensure you're setting the correct filter category here
    }));
  };

  const calculatePageRange = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return { startIndex, endIndex };
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(totalJobs / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const filterJobs = (jobs, selected, query) => {
    let filteredJobs = jobs;

    if (query) {
      filteredJobs = jobs.filter((job) =>
        job.jobTitle.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (selected) {
      filteredJobs = jobs.filter(
        ({
          jobLocation,
          salaryType,
          experienceLevel,
          maxPrice,
          postingDate,
          employmentType,
        }) => {
          let match = true;

          if (selected.location) {
            match =
              match &&
              jobLocation.toLowerCase() === selected.location.toLowerCase();
          }
          if (selected.postingDate) {
            match = match && postingDate >= selected.postingDate;
          }
          if (selected.maxPrice) {
            match =
              match && parseInt(maxPrice) <= parseInt(selected.maxPrice);
          }
          if (selected.salaryType) {
            match =
              match &&
              salaryType.toLowerCase() === selected.salaryType.toLowerCase();
          }
          if (selected.experienceLevel) {
            match =
              match &&
              experienceLevel.toLowerCase() ===
                selected.experienceLevel.toLowerCase();
          }
          if (selected.employmentType) {
            match =
              match &&
              employmentType.toLowerCase() ===
                selected.employmentType.toLowerCase();
          }

          return match;
        }
      );
    }

    const totalFilteredJobs = filteredJobs.length;

    const { startIndex, endIndex } = calculatePageRange();
    filteredJobs = filteredJobs.slice(startIndex, endIndex);

    return {
      result: filteredJobs,
      totalLength: totalFilteredJobs,
    };
  };

  const { result, totalLength } = filterJobs(userJobs, selectedCategory, query);

  useEffect(() => {
    setTotalJobs(totalLength);
  }, [totalLength]);

  return (
    <>
      <div className="max-w-screen-2xl container mx-auto xl:px-24 md:py-20 py-14 px-4">
        <h1 className="text-5xl font-bold text-primary mb-3">
          Empower Your Business with the <span className="text-blue">Best Talent</span>
        </h1>
        <p className="text-lg text-black/70 mb-8">
          Post jobs, manage applications, and find the perfect candidates to drive your company forward.
        </p>

        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
          Hire the best with <span className="text-blue">JobHunt4U</span>
        </h1>
        <p className="text-lg font-normal text-gray-500 lg:text-xl">
          Join thousands of companies that trust us to help them build their teams and grow their businesses.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
          <a
            href="#post-job"
            className="rounded-md bg-blue px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Post a Job
          </a>
          <a href="#learn-more" className="text-sm font-semibold leading-6 text-black">
            Learn more <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
      <div className="flex flex-wrap justify-center">
        <h1
          id="manage-jobs"
          className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-black md:text-5xl lg:text-6xl"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 animated-gradient-header">
            Manage Your 
          </span>Jobs.
        </h1>
      </div>
    
      <div className="flex space-x-5 p-5">
        {/* Sidebar */}
        <div className="">
          <Sidebar
            key={refreshSidebar}
            handleChange={handleChange}
            handleClick={handleClick}
            clearFilters={clearFilters}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-sky-800 p-4 rounded-2xl">
          {isLoading ? (
            <p className="font-medium text-white">Loading...</p>
          ) : result.length > 0 ? (
            <Jobs result={result.map((data, i) => <Card key={i} data={data} />)} totalJobs={totalJobs} />
          ) : (
            <>
              <h3 className="text-lg font-bold mb-2 text-white">0 Jobs</h3>
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
                Page {currentPage} of {Math.ceil(totalJobs / itemsPerPage)}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === Math.ceil(totalJobs / itemsPerPage)}
                className="hover:underline"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home_Emp;
