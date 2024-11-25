import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Card from "../components/Card";
import { useJobs } from "../context/jobsContext";
import Jobs from "./Jobs";
import FootSection from "../components/footSection";
import About from "../components/About";
import card_image from "../assets/card_back.png";
import { Link } from "react-router-dom";

const Home_Emp = () => {
  const { allJobs, user, isLoading } = useJobs();
  const userJobs = allJobs?.filter((data) => data.postedBy === user.email);
  

  const [selectedCategory, setSelectedCategory] = useState({});
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [totalJobs, setTotalJobs] = useState(0);
  const [query, setQuery] = useState("");
  const [refreshSidebar, setRefreshSidebar] = useState(false);
  const [showAlert,setShowAlert]=useState(false);

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
      let filtered = userJobs || [];
  
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
            jobCategory,
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
      setTotalJobs(filtered.length);
    };
  
    applyFilters();
  }, [selectedCategory, query]);
  

  useEffect(() => {
    // Reset the current page to 1 only when the filters or query changes
    setCurrentPage(1);
  }, [selectedCategory, query]);

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
      <div className="max-w-screen container p-1 mx-auto m-4 mb-8 rounded-lg animated-gradient-bg">
      <div className=" flex justify-center ">
      <h3 className="text-center text-xl font-bold font-roboto my-1  text-white  px-4  p-2 rounded">Employer - Dashboard</h3></div>
        <div className="md:py-10 py-5 xl:px-14 mx-auto  px-4 rounded-md bg-white/90">
        <h1 className="text-4xl font-bold text-primary mb-3">
          Empower Your Business with the{" "}
          <span className="text-blue animated-gradient-header">Best Talent</span>
        </h1>
        <p className="text-lg text-black/70 mb-8">
          Post jobs, manage applications, and find the perfect candidates to
          drive your company forward.
        </p>

        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-4xl">
          Hire the best with{" "}
          <span className="text-blue animated-gradient">JobHunt4U</span>
        </h1>
        <p className="text-lg font-normal text-gray-500 lg:text-xl">
          Join thousands of companies that trust us to help them build their
          teams and grow their businesses.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
          <Link
          to="/post-job"
            className="rounded-md text-white bg-sky-700 px-3.5 py-2.5 text-sm  shadow-sm hover:bg-gray-100 hover:text-sky-900 font-bold  focus-visible:outline-2 focus-visible:outline-offset-2 "
           onClick={window.top}>
            Post a Job
          </Link>
          <a
            href="#about"
            className="text-sm font-semibold leading-6 text-black"
          >
            Learn more <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
     </div>
      <div className="flex flex-wrap justify-center">
        <h1
          id="search"
          className="mb-4 text-2xl font-extrabold text-gray-900 dark:text-black md:text-3xl lg:text-4xl"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 animated-gradient-header">
            Manage Your{" "}
          </span>
          Jobs.
        </h1>
      </div>

      <div className="md:grid grid-cols-3 gap-8 lg:px-12 px-4 py-6">
        {/* Sidebar */}
        <div className="mb-6">
          <Sidebar
            key={refreshSidebar}
            handleChange={handleChange}
            handleClick={handleClick}
            clearFilters={clearFilters}
          />
        </div>

        {/* Main Content */}
        <div className="col-span-2 bg-sky-800 p-4 rounded-lg">
          {isLoading ? (
            <p className="font-medium text-white">Loading...</p>
          ) : paginatedJobs.length > 0 ? (
            <Jobs
              result={paginatedJobs.map((data, i) => (
                <Card key={i} data={data} setShowAlert={setShowAlert} />
              ))}
              totalJobs={totalJobs}
            />
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
                Page {currentPage} of{" "}
                {Math.ceil(filteredJobs.length / itemsPerPage)}
              </span>
              <button
                onClick={nextPage}
                disabled={
                  currentPage === Math.ceil(filteredJobs.length / itemsPerPage)
                }
                className="hover:underline"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      <div>
        <About />
      </div>
      <div>
        <FootSection />
      </div>
      {showAlert &&
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
         <div
           className="bg-white rounded-lg p-8 text-center"
           style={{ backgroundImage: `url(${card_image})`, backgroundSize: "cover", backgroundPosition: "center" }}>
             <i className="fa-solid fa-file-pen text-6xl mx-auto mb-4 text-sky-700"></i>
           <p>This Jobs Application is currently under Review <br/> Please Wait!!!</p>
           <button
             onClick={()=>{setShowAlert(false)}}
             className="bg-blue-600 text-blue ring-2 mt-4 ring-blue rounded px-8 py-1 hover:bg-blue-700 transition-all duration-300">
             OK
           </button>
         </div>
       </div>
      }
    </>
  );
  }

export default Home_Emp;
