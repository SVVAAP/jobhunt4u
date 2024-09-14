import React, { useState } from "react";
import { useJobs } from "../context/jobsContext";
import Card from "./Card";
import Card2 from "./Card2";
import { ref, update } from "firebase/database";
import { database } from "../firebase";

function UserCard({ user, index, Candidate, onDelete, onApproveDecline }) {
  const [showJobs, setShowJobs] = useState(false);
  const { jobs } = useJobs();

  // Get jobs applied by the user
  const applied =
    user?.appliedJobs && Array.isArray(user.appliedJobs) ? jobs.filter((job) => user.appliedJobs.includes(job.id)) : [];

  // Approve job handler
  const handleApprove = (id) => {
    const jobRef = ref(database, `jobs/${id}`);
    update(jobRef, { status: "approved" })
      .then(() => console.log("Job approved"))
      .catch((error) => console.error("Error approving job: ", error));
  };

  // Decline job handler
  const handleDecline = (id) => {
    const jobRef = ref(database, `jobs/${id}`);
    update(jobRef, { status: "declined" })
      .then(() => console.log("Job declined"))
      .catch((error) => console.error("Error declining job: ", error));
  };

  const userJobs = jobs?.filter((data) => data.postedBy === user.email);

  return (
    <div className="relative">
    <div className="bg-white shadow-lg rounded-lg p-4 border text-sm border-gray-200 mb-4">
      <div key={index} className={`grid ${!Candidate? 'grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_auto_auto]':"grid-cols-[1fr_1fr_1fr_1fr_auto_auto]"} gap-5 items-center`}>
        <div className="w-1/6">
          <h2 className="text-lg font-semibold">Name</h2>
          <p>{user.name}</p>
        </div>
        <div className="w-1/4">
          <h2 className="text-lg font-semibold">Email</h2>
          <p>{user.email}</p>
        </div>
        <div className="w-1/6">
          <h2 className="text-lg font-semibold">Phone</h2>
          <p >{user.phone}</p>
        </div>
       {!Candidate && <div className="w-1/6">
          <h2 className="text-lg font-semibold">Company</h2>
          <p>{user.companyName}</p>
        </div>}
        <div className="w-1/6">
          <h2 className="text-lg font-semibold">Location</h2>
          <p >{user.location}</p>
        </div>
        {!Candidate && <div className="w-1/6">
          <h2 className="text-lg font-semibold">Status</h2>
          <p>{user.status}</p>
        </div>}
        {/* Action Buttons */}
        <div className="text-white text-lg space-x-4 flex justify-center">
          {!Candidate && (
            <>
              <button className="bg-green-500 rounded-md p-2" onClick={() => onApproveDecline(user.id, true)}>
                <i className="fa-solid fa-check"></i>
              </button>
              <button className="bg-red-500 rounded-md p-2" onClick={() => onApproveDecline(user.id, false)}>
                <i className="fa-solid fa-x"></i>
              </button>
            </>
          )}
          <button
            className="bg-sky-500 rounded-md p-2"
            onClick={() => {
              onDelete(user.id);
            }}
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
        <div className="flex items-center justify-center">
          <i
            className={`fa-solid fa-chevron-down cursor-pointer transition-transform duration-700 ${showJobs ? "rotate-180" : ""}`}
            onClick={() => setShowJobs(!showJobs)}
          ></i>
        </div>
      </div>
      {/* Uploaded Jobs Section */}
      {!Candidate ? (
        <div className={`${showJobs ? "block" : "hidden"} transition-transform duration-700 mt-4`}>
          <h3 className="text-lg font-semibold mb-2">Uploaded Jobs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {userJobs && userJobs.length > 0 ? (
              userJobs.map((data, i) => (
                <Card2 key={i} data={data} handleApprove={handleApprove} handleDecline={handleDecline} />
              ))
            ) : (
              <p>No Jobs Uploaded....</p>
            )}
          </div>
        </div>
      ) : (
        <div className={`${showJobs ? "block" : "hidden"} transition-transform duration-700 mt-4`}>
          <h3 className="text-lg font-semibold mb-2">Applied Jobs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {applied && applied.length > 0 ? (
              applied.map((data, i) => <Card key={i} data={data} />)
            ) : (
              <p>No Jobs Applied....</p>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
  
  );
}

export default UserCard;
