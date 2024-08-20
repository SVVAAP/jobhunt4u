import React, { useState } from 'react';
import { getDatabase, ref, update } from 'firebase/database'; // Import Firebase functions
import excel from "../assets/excel.png";

function Applicant_card({ job, downloadExcel }) {
  const [showJobs, setShowJobs] = useState(false);
  const database = getDatabase(); // Initialize the Firebase database

  const updateApplicationStatus = (applicantIndex, status) => {
    const updatedApplicants = job.applicants.map((applicant, index) => {
      if (index === applicantIndex) {
        return { ...applicant, applicationStatus: status };
      }
      return applicant;
    });

    const jobRef = ref(database, `jobs/${job.id}`);
    update(jobRef, { applicants: updatedApplicants })
      .then(() => {
        alert(`Application ${status === 'withEmployer' ? 'Approved' : 'Declined'} Successfully!`);
      })
      .catch((error) => {
        console.error("Error updating status: ", error);
      });
  };

  return (
    <div className=''>
      <div key={job.id} className="m-5 p-2 flex justify-between flex-col rounded ring-2 bg-slate-300">
        <div className="flex justify-between item-center rounded-lg p-3 bg-white">
          <div className="flex items-center">
            <img src={job.companyLogo} alt={job.jobTitle} className="w-10 h-10 rounded" />
            <h2 className='ml-10 '>
              {job.jobTitle}  @  {job.companyName}
            </h2>
          </div>
          <div className="flex items-center">
            <div
              onClick={() => {
                downloadExcel(job.applicants, job.companyName);
              }}
              className="relative right-2 bg-green-700 ring-1 m-2 ring-green-700 rounded-sm flex">
              <p className="bg-white text-green-700 rounded-sm p-1">Download</p>
              <img className="h-6 m-1" src={excel} alt="excel" />
            </div>
            <p className="text-gray-600 mx-6" onClick={() => setShowJobs(!showJobs)}>
              <i
                className={`fa-solid fa-chevron-down m-4 transition-transform duration-700 ${showJobs ? "rotate-180" : ""}`}
              ></i>
            </p>
          </div>
        </div>
        <div className={`${showJobs ? "block" : "hidden"} transition-transform duration-700`}>
          {job.applicants && job.applicants.length > 0 ? (
            <div>
              {job.applicants.map((applicant, index) => (
                <div key={index} className='grid grid-cols-[40px_2px_1fr_2px_1fr_2px_1fr_2px_1fr_1fr] gap-2 ring-2 rounded my-2 items-center bg-white p-2'>
                  <p className='text-center'>{index + 1}</p>
                  <div className='w-full h-full bg-green-700 rounded-xl'></div>
                  <p>Name: {applicant?.name || "N/A"}</p>
                  <div className='w-full h-full bg-green-700 rounded-xl'></div>
                  <p>Email: {applicant?.email || "N/A"}</p>
                  <div className='w-full h-full bg-green-700 rounded-xl'></div>
                  <p>Phone: {applicant?.phone || "N/A"}</p>
                  <div className='w-full h-full bg-green-700 rounded-xl'></div>
                  <p>Resume: <a href={applicant.resumeUrl} target="_blank"
                    rel="noopener noreferrer" className=' underline text-sky-700'>View</a></p>
                  <div className='flex justify-around'>
                   {applicant.applicationStatus==="pending"? (<div> <button 
                      className='bg-green-600 rounded-lg text-white p-2'
                      onClick={() => updateApplicationStatus(index, 'withEmployer')}
                    >
                      Approve
                    </button>
                    <button 
                      className='bg-red-600 rounded-lg text-white p-2'
                      onClick={() => updateApplicationStatus(index, 'declined')}
                    >
                      Decline
                    </button>
                    </div>):(
                      <div className='text-center font-bold text-2xl'>{applicant.applicationStatus}</div>
                    )
                    }
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No applicants for this job</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Applicant_card;
