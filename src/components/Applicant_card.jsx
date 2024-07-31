import React, { useState } from 'react'
import excel from "../assets/excel.png";

function Applicant_card({ job, downloadExcel }) {

  const [showJobs, setShowJobs] = useState(false);
  return (
    <div>
      <div key={job.id} className="m-2 p-2 flex justify-between flex-col rounded ring-2">
        <div className="flex justify-between align-center">
          <div className="flex items-center">
            <img src={job.companyLogo} alt={job.jobTitle} className="w-10 h-10 rounded" />
            <h2 className='ml-10'>
              {job.jobTitle} at {job.companyName}
            </h2>
          </div>
          <div className="flex items-center">
            <div
              onClick={() => {
                downloadExcel(job.applicants, job.companyName);
              }}
              className="relative right-2 top-2 bg-green-700 ring-1 m-2 ring-green-700 rounded-sm flex">
              <p className="bg-white text-green-700 rounded-sm p-1">Download</p>
              <img className="h-6 m-1" src={excel} alt="excel" />
            </div>
            <p className="text-gray-600 mx-6" onClick={() => setShowJobs(!showJobs)}>
              <i
                className={`fa-solid fa-chevron-down m-4 transition-transform duration-700 ${showJobs ? "rotate-180" : ""
                  }`}></i>
            </p>
          </div>
        </div>
        <div className={`${showJobs ? "block" : "hidden"} transition-transform duration-700`}>
          {job.applicants && job.applicants.length > 0 ? (
            <div>
              {job.applicants.map((applicant, index) => (
                <div key={index} className='flex justify-between ring-2 rounded my-2 items-center'>
                  <div className="flex justify-start p-2  ">
                    <p className='mx-4'>{index + 1}</p>
                    <div className=' w-0.5 rounded-xl bg-green-700'></div>
                    <p className=" p-1 mx-4">Name: {applicant?.name || "N/A"}</p>
                    <div className=' w-0.5 rounded-xl bg-green-700'></div>
                    <p className=" p-1 mx-4">Email: {applicant?.email || "N/A"}</p>
                    <div className=' w-0.5 bg-green-700 rounded-xl'></div>
                    <p className=" p-1 mx-4">Phone: {applicant?.phone || "N/A"}</p>
                    {/* Add more applicant details as needed */}
                  </div>
                  {/* <div className='mx-5'>
                    <button className="bg-red-600 rounded-xl p-1 text-white">Delete</button>
                  </div> */}
                </div>
              ))}
            </div>
          ) : (
            <p>No applicants for this job</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Applicant_card
