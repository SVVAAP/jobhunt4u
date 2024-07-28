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

  return (
    <div>
      <div key={index} className="flex justify-around bg-white shadow-lg rounded-lg p-4 border border-gray-200">
        <h2 className="text-xl font-semibold mb-2">{employer.name}</h2>
        <p className="text-gray-600 mb-2"><strong>Email:</strong> {employer.email}</p>
        <p className="text-gray-600 mb-2"><strong>Phone:</strong> {employer.phone}</p>
        <p className="text-gray-600 mb-2"><strong>Company:</strong> {employer.companyName}</p>
        <p className="text-gray-600 mb-2"><strong>Location:</strong> {employer.location}</p>
        <p className="text-gray-600 mb-2" onClick={() => setShowJobs(!showJobs)}>
          <i className={`fa-solid fa-chevron-down transition-transform duration-700 ${showJobs ? "rotate-180" : ""}`}></i>
        </p>
      </div>
      <div className={`${showJobs ? "block" : "hidden"} transition-transform duration-700`}>
        <p>Uploaded Jobs</p>
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
