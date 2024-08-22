import React from 'react';
import { useJobs } from '../context/jobsContext';
import { useNavigate, useParams } from 'react-router-dom';
import { push, ref, update } from 'firebase/database';
import { database } from '../firebase';

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

    const jobRef = ref(database, `jobs/${job.id}`);
    update(jobRef, { applicants: updatedApplicants })
      .then(() => {
        alert(`Application ${status} Successfully!`);

        // Send a message to the applicant's inbox
        const applicant = updatedApplicants[applicantIndex];
        const applicantInboxRef = ref(database, `users/${applicant.uid}/inbox`);
        const newMessageRef = push(applicantInboxRef);

        // Create a message based on the status
        const message = {
          title: `Your application status has been updated to ${status}`,
          message: `Your application for the position of ${job.jobTitle} at ${job.companyName} has been ${status} by the Recruiter.`,
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
      })
      .catch((error) => {
        console.error("Error updating status: ", error);
      });
  };

  // Filter applicants based on status
  const nonPendingApplicants = job?.applicants?.filter(applicant => applicant.applicationStatus !== "pending");

  return (
    <div>
      <h1>Applicants for {job?.jobTitle}</h1>
      <div className="transition-transform duration-700">
        {job && job.applicants && job.applicants.length > 0 ? (
          nonPendingApplicants.length > 0 ? (
            <div className='bg-sky-900 p-2 m-5 mx-10 rounded-lg'>
              {nonPendingApplicants.map((applicant, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[40px_2px_1fr_2px_1fr_2px_1fr_2px_1fr_1fr] gap-2 ring-2 rounded my-2 mx-2 items-center bg-white p-2"
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
                        {(applicant.applicationStatus)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No approved applicants yet.</p>
          )
        ) : (
          <p>No applicants for this job.</p>
        )}
      </div>
    </div>
  );
}

export default EmpApplicants;
