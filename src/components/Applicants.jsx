import React, { useState, useEffect } from "react";
import { useJobs } from "../context/jobsContext";
import * as XLSX from "xlsx"; // Update this line
import Applicant_card from "./Applicant_card";

const Applicants = () => {
  const { jobs } = useJobs();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (jobs.length > 0) {
      setIsLoading(false);
    }
  }, [jobs]);

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (jobs.length === 0) {
    return <div>No jobs found</div>;
  }

  return (
    <div>
      <h1>Applicants for All Jobs</h1>
      {jobs.map((job,index) => (
       <Applicant_card key={index} job={job} downloadExcel={downloadExcel}/>
      ))}
    </div>
  );
};

export default Applicants;
