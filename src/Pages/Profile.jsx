import React from 'react';
import { useJobs } from '../context/jobsContext';
import Card from '../components/Card';

function Profile() {
  const { user, jobs } = useJobs();

  // If user or jobs are not yet loaded, return a loading state or null
  if (!user || !jobs) {
    return <div>Loading...</div>;
  }

  // Filtering jobs based on user applied jobs Object.values(data).filter(user => user.userType === "employer");
  const filteredJobs = Object.values(jobs).filter((job) => user.appliedJobs.includes(job.id));
  console.log(filteredJobs);
    
  return (
    <div>
      <h1>Profile</h1>
      <h2>{user.name}</h2>
      <h3>{user.phone}</h3>
      <div>
        <h1>Applied Jobs</h1>
        {filteredJobs.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
          {filteredJobs && jobs.map((data, i) => (
              <Card key={i} data={data} />
          ))}
      </div>
        ) : (
          <p>No applied jobs found.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
