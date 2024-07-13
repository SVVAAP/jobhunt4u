import React, { useEffect, useState } from 'react'
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";
import Card from './Card2';

function JobList() {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const jobRef = ref(database, "jobs");
      onValue(jobRef, (snapshot) => {
        const jobsData = snapshot.val();
        const loadedJobs = [];
        for (const id in jobsData) {
        //  if (jobsData[id].status === "approved") {
            loadedJobs.push({ id, ...jobsData[id] });
         // }
        }
        setJobs(loadedJobs);
        setIsLoading(false);
      });
    }, []);
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
      {jobs && jobs.map((data, i) => <Card key={i} data={data} />)};
    </div>
  )
}

export default JobList
