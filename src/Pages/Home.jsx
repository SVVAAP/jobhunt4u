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
  const [isLoading, setIsLoading] = useState(true);

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
          postingDate === selected ||
          parseInt(maxPrice) <= parseInt(selected) ||
          salaryType.toLowerCase() === selected.toLowerCase() ||
          experienceLevel.toLowerCase() === selected.toLowerCase() ||
          employmentType.toLowerCase() === selected.toLowerCase()
      );
    }

    const { startIndex, endIndex } = calculatePageRange();
    filteredJobs = filteredJobs.slice(startIndex, endIndex);

    return filteredJobs.map((data, i) => <Card key={i} data={data} />);
  };

  const result = filteredData(jobs, selectedCategory, query);

  return (
    <>
      <div>
        <Banner query={query} handleInputChange={handleInputChange} />
        <div className=" md:grid grid-cols-3 gap-8 lg:px-24 px-4 py-12">
          <div className="bg-white p-4 rounded">
            <Sidebar handleChange={handleChange} handleClick={handleClick} />
          </div>

          <div className="col-span-2 bg-white from-sky-400 p-4 rounded">
            {isLoading ? (
              <p className="font-medium">Loading...</p>
            ) : result.length > 0 ? (
              <Jobs result={result} />
            ) : (
              <>
                <h3 className="text-lg font-bold mb-2">{result.length} Jobs</h3>
                <p>No data found</p>
              </>
            )}
            {result.length > 0 && (
              <div className="flex justify-center mt-4 space-x-8">
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
