import React, { useState } from 'react';
import { useJobs } from '../context/jobsContext';
import Card from './Card2';
import { ref, update } from 'firebase/database';
import { database } from '../firebase';

function Employee_card({ employer, index }) {
  const [showJobs, setShowJobs] = useState(false);
  const { jobs, user } = useJobs();

  const handleApprove = (id) => {
    const jobRef = ref(database, `jobs/${id}`);
    update(jobRef, { status: "approved" })
      .then(() => console.log("Job approved"))
      .catch((error) => console.error("Error approving job: ", error));
  };

  const handleDecline = (id) => {
    const jobRef = ref(database, `jobs/${id}`);
    update(jobRef, { status: "declined" })
      .then(() => console.log("Job declined"))
      .catch((error) => console.error("Error declining job: ", error));
  };

  const userJobs = jobs?.filter(data => data.postedBy === employer.email);

  return  (
    <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 mb-4">
      <div key={index} className="grid grid-cols-[repeat(6,_1fr)_auto] gap-4 items-center">
        <div>
          <h2 className="text-xl font-semibold">Name</h2>
          <p>{employer.name}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Email</h2>
          <p>{employer.email}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Phone</h2>
          <p>{employer.phone}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Company</h2>
          <p>{employer.companyName}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Location</h2>
          <p>{employer.location}</p>
        </div>
        <div className="flex items-center justify-center col-span-5 md:col-span-1">
          <i
            className={`fa-solid fa-chevron-down cursor-pointer transition-transform duration-700 ${showJobs ? "rotate-180" : ""}`}
            onClick={() => setShowJobs(!showJobs)}
          ></i>
        </div>
      </div>

      <div className={`${showJobs ? "block" : "hidden"} transition-transform duration-700 mt-4`}>
        <h3 className="text-lg font-semibold mb-2">Uploaded Jobs</h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
          {userJobs && userJobs.length > 0 ? (
            userJobs.map((data, i) => (
              <Card key={i} data={data} handleApprove={handleApprove} handleDecline={handleDecline} />
            ))
          ) : (
            <p>No Jobs Uploaded....</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Employee_card;
