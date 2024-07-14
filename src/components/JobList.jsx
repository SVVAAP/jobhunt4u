import React from 'react';
import { ref, update } from "firebase/database";
import { database } from "../firebase";
import Card from './Card2';
import { useJobs } from '../context/jobsContext';

function JobList() {
    const { jobs } = useJobs(); // Retrieve jobs from context

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
 // useEffect(() => {
    //   const jobRef = ref(database, "jobs");
    //   onValue(jobRef, (snapshot) => {
    //     const jobsData = snapshot.val();
    //     const loadedJobs = [];
    //     for (const id in jobsData) {
    //     //  if (jobsData[id].status === "approved") {
    //         loadedJobs.push({ id, ...jobsData[id] });
    //      // }
    //     }
    //     setJobs(loadedJobs);
    //     setIsLoading(false);
    //   });
    // }, []);
    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
            {jobs && jobs.map((data, i) => (
                <Card key={i} data={data} handleApprove={handleApprove} handleDecline={handleDecline} />
            ))}
        </div>
    );
}

export default JobList;
