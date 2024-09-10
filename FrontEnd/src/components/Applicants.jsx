import React, { useState, useEffect } from "react";
import { useJobs } from "../context/jobsContext";
import * as XLSX from "xlsx"; // Update this line
import Applicant_card from "./Applicant_card";

const Applicants = () => {
  const { jobs } = useJobs();
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState({
    jobTitle: "",
    companyName: "",
    jobLocation: "",
    employmentType: "",
    status: "",
  });

  useEffect(() => {
    if (jobs.length > 0) {
      setIsLoading(false);
    }
  }, [jobs]);

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

  const downloadExcel = (data, name) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    // Trigger a download
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name + ".xlsx";
    link.click();
  };

  const clearFilters = () => {
    setFilters({
      jobTitle: "",
      companyName: "",
      jobLocation: "",
      employmentType: "",
      status: "",
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (jobs.length === 0) {
    return <div>No jobs found</div>;
  }

  return (
    <div className="p-1">
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
        </div>
      <h1 className="font-bold m-2">Applicants for All Jobs</h1>
      {filteredJobs.map((job, index) => (
        <Applicant_card key={index} job={job} downloadExcel={downloadExcel} />
      ))}

    </div>
  );
};

export default Applicants;
