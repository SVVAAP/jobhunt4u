import React from 'react'
import Jobs from '../Pages/Jobs';
import { useJobs } from '../context/jobsContext';
import Card from './Card';

function MyJobs() {
    const { jobs, user, isLoading } = useJobs();
  const userJobs = jobs?.filter((data) => data.postedBy === user.email);
  return (
    <div>
         <div className="col-span-2 bg-sky-800 p-4 m-5 rounded-2xl">
          {isLoading ? (
            <p className="font-medium text-white">Loading...</p>
          ) : userJobs.length > 0 ? (
            <Jobs
              result={userJobs.map((data, i) => (
                <Card key={i} data={data} />
              ))}
              totalJobs={userJobs.length}
            />
          ) : (
            <>
              <h3 className="text-lg font-bold mb-2 text-white">0 Jobs</h3>
              <p>No data found</p>
            </>
          )}
          </div>
      
    </div>
  )
}

export default MyJobs
