import React from 'react';
import { useJobs } from '../context/jobsContext';
import Card from '../components/Card';
import profpic from '../assets/profile.png'; // Ensure you have a placeholder profile image

function Profile() {
  const { user, jobs } = useJobs();

  // If user or jobs are not yet loaded, return a loading state or null
  if (!user || !jobs) {
    return <div>Loading...</div>;
  }

  // Filtering jobs based on user applied jobs
  const filteredJobs = Object.values(jobs).filter((job) => user.appliedJobs.includes(job.id));

  return (
    <div className="container mx-auto py-8">
      {/* Profile Details Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex items-center">
          <img src={profpic} alt="Profile" className="w-24 h-24 rounded-full mr-6" />
          <div>
            <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">{user.phone}</p>
            <p className="text-gray-600">{user.address}</p>
            <p className="text-gray-600">{user.city}, {user.state}</p>
          </div>
        </div>
      </div>

      {/* Applied Jobs Section */}
      <div>
        <h1 className="text-xl font-bold mb-4">Applied Jobs</h1>
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredJobs.map((job, i) => (
              <Card key={i} data={job} />
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
