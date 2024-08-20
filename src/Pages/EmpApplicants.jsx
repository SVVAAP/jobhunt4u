import React from 'react';
import { useJobs } from '../context/jobsContext';
import { useNavigate, useParams } from 'react-router-dom';

function EmpApplicants() {
  const { jobs } = useJobs();
  const { jobId } = useParams();
  const navigate = useNavigate();
  const job = jobs.find((job) => job.id === jobId);

  const updateApplicationStatus = (applicantIndex, status) => {
    const updatedApplicants = job.applicants.map((applicant, index) => {
      if (index === applicantIndex) {
        return { ...applicant, applicationStatus: status };
      }
      return applicant;
    });

    // Optionally, update the state or persist the changes.
    // Example:
    // updateJob(jobId, { ...job, applicants: updatedApplicants });
  };

  return (
    <div>
      <h1>Emp Applicants</h1>
      <div className="transition-transform duration-700">
        {job && job.applicants && job.applicants.length > 0 ? (
          <div>
            {job.applicants.map((applicant, index) => (
              applicant.applicationStatus === "withEmployer" && (
                <div
                  key={index}
                  className="grid grid-cols-[40px_2px_1fr_2px_1fr_2px_1fr_2px_1fr_1fr] gap-2 ring-2 rounded my-2 items-center bg-white p-2"
                >
                  <p className="text-center">{index + 1}</p>
                  <div className="w-full h-full bg-green-700 rounded-xl"></div>
                  <p>Name: {applicant?.name || "N/A"}</p>
                  <div className="w-full h-full bg-green-700 rounded-xl"></div>
                  <p>Email: {applicant?.email || "N/A"}</p>
                  <div className="w-full h-full bg-green-700 rounded-xl"></div>
                  <p>Phone: {applicant?.phone || "N/A"}</p>
                  <div className="w-full h-full bg-green-700 rounded-xl"></div>
                  <p>
                    Resume:{" "}
                    <a
                      href={applicant.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-sky-700"
                    >
                      View
                    </a>
                  </p>
                  <div className="flex justify-around">
                    {applicant.applicationStatus === "withEmployer" ? (
                      <div className='space-x-4'>
                        <button
                          className="bg-green-600 rounded-lg text-white p-2"
                          onClick={() => updateApplicationStatus(index, "approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-600 rounded-lg text-white p-2"
                          onClick={() => updateApplicationStatus(index, "declined")}
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <div className="text-center font-bold text-2xl">
                        {applicant.applicationStatus}
                      </div>
                    )}
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          <p>No applicants for this job</p>
        )}
      </div>
    </div>
  );
}

export default EmpApplicants;
