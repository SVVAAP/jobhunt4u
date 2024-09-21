import React, { useEffect, useState } from "react";
import { getDatabase, onValue, push, ref, update } from "firebase/database";
import { database } from "../firebase";
import Card from "./Card2";
import { useJobs } from "../context/jobsContext";

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const database = getDatabase();
    const jobRef = ref(database, "jobs");
    const unsubscribeJobs = onValue(jobRef, (snapshot) => {
      const jobsData = snapshot.val();
      const loadedJobs = [];
      for (const id in jobsData) {
        loadedJobs.push({ id, ...jobsData[id] });
      }
      const reversedJobs = loadedJobs.reverse();
      setJobs(reversedJobs);
      setIsLoading(false);
    });
  }, []);
  // const { jobs } = useJobs(); // Retrieve jobs from context

  // State for filters
  const [filters, setFilters] = useState({
    jobTitle: "",
    companyName: "",
    jobLocation: "",
    employmentType: "",
    status: "",
  });

  const [activeTab, setActiveTab] = useState("new");

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };
  // Handle status filter button clicks
  const handleStatusFilter = (status) => {
    setFilters({
      ...filters,
      status: status,
    });
  };

  // Filter jobs based on criteria
  const filteredJobs = jobs.filter((job) => {
    return (
      (filters.jobTitle === "" || job.jobTitle.toLowerCase().includes(filters.jobTitle.toLowerCase())) &&
      (filters.companyName === "" || job.companyName.toLowerCase().includes(filters.companyName.toLowerCase())) &&
      (filters.jobLocation === "" || job.jobLocation.toLowerCase().includes(filters.jobLocation.toLowerCase())) &&
      (filters.employmentType === "" ||
        job.employmentType.toLowerCase().includes(filters.employmentType.toLowerCase())) &&
      (filters.status === "" || job.status.toLowerCase().includes(filters.status.toLowerCase()))
    );
  });

  // Define handleApprove and handleDecline functions
  const handleApprove = (id,jobTitle,uid) => {
    const jobRef = ref(database, `jobs/${id}`);
    update(jobRef, { status: "approved" })
      .then(() => notify(jobTitle,"Approved",uid))
      .catch((error) => console.error("Error approving job: ", error));
  };

  const handleDecline = (id,jobTitle,uid) => {
    const jobRef = ref(database, `jobs/${id}`);
    update(jobRef, { status: "declined" })
      .then(() => notify(jobTitle,"Declined",uid))
      .catch((error) => console.error("Error declining job: ", error));
  };

  const notify=(jobTitle,status,uid)=>{
    const applicantInboxRef = ref(database, `users/${uid}/inbox`);
        const newMessageRef = push(applicantInboxRef);

        // Create a message based on the status
        const message = {
          title: `Your Job ${jobTitle}`,
          message: `Your Job ${jobTitle} Has Been ${status}`,
          timestamp: Date.now()
        };

        // Save the message to the applicant's inbox
        update(newMessageRef, message)
          .then(() => {
            console.log('Message sent to applicant inbox');
          })
          .catch((error) => {
            console.error('Error sending message: ', error);
          });
        }
  const clearFilters = () => {
    setFilters({
      jobTitle: "",
      companyName: "",
      jobLocation: "",
      employmentType: "",
      status: "",
    });
  };

  return (
    <>
      {/* Filter UI */}
      <div className="bg-sky-900 p-3 rounded-lg m-4">
        <div className="flex justify-between">
          <h1 className="text-white font-roboto font-extrabold text-2xl m-2">Filter jobs: {filteredJobs.length}</h1>

          {/* Clear Filters Button */}
          <button onClick={clearFilters} className="text-xl font-bold mb-2 mx-2 text-white">
            Clear <i className="fa-brands fa-rev"></i>
          </button>
        </div>

        <div className="filter-container grid grid-cols-1 md:grid-cols-4 gap-4 ">
          <input
            type="text"
            name="jobTitle"
            value={filters.jobTitle}
            onChange={handleFilterChange}
            placeholder="Filter by Job Title"
            className="p-2 border rounded text-sky-950"
          />
          <input
            type="text"
            name="companyName"
            value={filters.companyName}
            onChange={handleFilterChange}
            placeholder="Filter by Company Name"
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="jobLocation"
            value={filters.jobLocation}
            onChange={handleFilterChange}
            placeholder="Filter by Location"
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="employmentType"
            value={filters.employmentType}
            onChange={handleFilterChange}
            placeholder="Filter by Employment Type"
            className="p-2 border rounded"
          />
        </div>
        <div className="status-filter flex mt-3 space-x-5 justify-center bg-sky-800 p-2">
          <p
            className={`px-4 cursor-pointer rounded-lg text-white ${filters.status === "review" ? "bg-gray-200/30" : ""}`}
            onClick={() => handleStatusFilter("review")}>
            New
          </p>
          <p
            className={`px-4 cursor-pointer  rounded-lg text-white ${filters.status === "approved" ? "bg-gray-200/30" : ""}`}
            onClick={() => handleStatusFilter("approved")}>
            Approved
          </p>
          <p
            className={`px-4 cursor-pointer  rounded-lg text-white ${filters.status === "declined" ? "bg-gray-200/30" : ""}`}
            onClick={() => handleStatusFilter("declined")}>
            Declined
          </p>
        </div>
      </div>
      \{/* Job List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {filteredJobs &&
          filteredJobs.map((data, i) => (
            <Card key={i} data={data} handleApprove={handleApprove} handleDecline={handleDecline} />
          ))}
      </div>
    </>
  );
}

export default JobList;
