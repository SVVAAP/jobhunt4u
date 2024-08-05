import React, { useEffect, useState } from 'react';
import Banner from '../components/Banner';
import Card from "../components/Card";
import Jobs from './Jobs';
import FootSection from '../components/footSection';
import About from '../components/About';
import Sidebar from '../Sidebar/Sidebar';
import Newsletter from '../components/Newsletter';
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [totalJobs,setTotalJobs]=useState(0)
  const [isLoading, setIsLoading] = useState(true); 
  // const [filters, setFilters] = useState({
  //   location: "",
  //   employmentType: "",
  //   postingDate: "",
  //   salaryType: "",
  //   experience: "",
  // });

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

const [query, setQuery] = useState("");
  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  // const handleChange = (event) => {
  //   const { name, value } = event.target;
  //   setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  // };

  // const handleClick = (event) => {
  //   const { name, value } = event.target;
  //   setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  // };

  const filteredItems = jobs.filter(
    (job) => job.jobTitle.toLowerCase().indexOf(query.toLowerCase()) !== -1
  );
  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleClick = (event) => {
    setSelectedCategory(event.target.value);
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

  const filteredData = (jobs, selected, query) => {
    let filteredJobs = jobs;

    if (query) {
      filteredJobs = filteredItems;
    }

    if (selected) {
      filteredJobs = filteredJobs.filter(
        ({
          jobLocation,
          salaryType,
          experienceLevel,
          maxPrice,
          postingDate,
          employmentType,
        }) =>
          jobLocation.toLowerCase() === selected.toLowerCase() ||
          postingDate >= selected ||
          parseInt(maxPrice) <= parseInt(selected) ||
          salaryType.toLowerCase() === selected.toLowerCase() ||
          experienceLevel.toLowerCase() === selected.toLowerCase() ||
          employmentType.toLowerCase() === selected.toLowerCase()
      );
    }

    // if (filters.location) {
    //   filteredJobs = filteredJobs.filter((job) => job.jobLocation.toLowerCase().includes(filters.location.toLowerCase()));
    // }

    // if (filters.employmentType) {
    //   filteredJobs = filteredJobs.filter((job) => job.employmentType === filters.employmentType);
    // }

    // if (filters.postingDate) {
    //   filteredJobs = filteredJobs.filter((job) => new Date(job.postingDate) >= new Date(filters.postingDate));
    // }

    // if (filters.salaryType) {
    //   filteredJobs = filteredJobs.filter((job) => job.salaryType === filters.salaryType);
    // }

    // if (filters.experience) {
    //   filteredJobs = filteredJobs.filter((job) => job.experience === filters.experience);
    // }

    // if (query) {
    //   filteredJobs = filteredJobs.filter((job) => job.jobTitle.toLowerCase().includes(query.toLowerCase()));
    // }

    const totalFilteredJobs = filteredJobs.length;

    const { startIndex, endIndex } = calculatePageRange();
    filteredJobs = filteredJobs.slice(startIndex, endIndex);
  
    return {
      result: filteredJobs.map((data, i) => <Card key={i} data={data} />),
      totalLength: totalFilteredJobs,
    };
  };
  
  const { result, totalLength } = filteredData(jobs, selectedCategory, query, calculatePageRange);
  
  useEffect(() => {
    setTotalJobs(totalLength);
  }, [totalLength]);
  return (
    <>
      <div>
        <Banner query={query} handleInputChange={handleInputChange} />
        <div className=" md:grid grid-cols-3 gap-8 lg:px-12 px-4 py-6">
          <div className="rounded">
            <Sidebar handleChange={handleChange} handleClick={handleClick} />
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
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="hover:underline"
                >
                  Previous
                </button>
                <span className="mx-2">
                  Page {currentPage} of{" "}
                  {Math.ceil(filteredItems.length / itemsPerPage)}
                </span>
                <button
                  onClick={nextPage}
                  disabled={
                    currentPage === Math.ceil(filteredItems.length / itemsPerPage)
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
