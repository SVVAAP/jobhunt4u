import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FiCalendar, FiClock, FiDollarSign, FiMapPin } from "react-icons/fi";
import { useJobs } from '../context/jobsContext';

const SingleJob = () => {
    const { jobs, user, uid ,isLoggedIn } = useJobs();
    const { jobId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [applied, setApplied] = useState(false);
    const database = getDatabase();
    const auth = getAuth();
    
    const job = jobs.find(job => job.id === jobId);
    console.log("error:"+job);
    if(isLoggedIn){
    if (user.appliedJobs && user.appliedJobs.includes(jobId)) {
        setApplied(true);
    }
    }
  //  useEffect(() => {
    //     const jobRef = ref(database, `jobs/${jobId}`);
    //     onValue(jobRef, (snapshot) => {
    //         const jobData = snapshot.val();
    //         setJob(jobData);
    //         setIsLoading(false);
    //     });

    

    //     const unsubscribe = onAuthStateChanged(auth, (user) => {
    //         if (user) {
    //             setIsLoggedIn(true);
    //             setUid(user.uid);
    //             const userRef = ref(database, `users/${user.uid}`);
    //             onValue(userRef, (snapshot) => {
    //                 const userData = snapshot.val();
    //                 setUser(userData);
    //                 if (userData.appliedJobs && userData.appliedJobs.includes(jobId)) {
    //                     setApplied(true);
    //                 }
    //             });
    //         }
    //     });

    //     return () => unsubscribe();
    // }, [jobId, auth, database]);

    const applyJob = () => {
        if (user) {
            if (!user.appliedJobs) {
                user.appliedJobs = [];
            }

            if (!user.appliedJobs.includes(jobId)) { 
                const newAppliedJobs = [...user.appliedJobs, jobId];
                const userRef = ref(database, `users/${uid}`);
                update(userRef, { appliedJobs: newAppliedJobs })
                    .then(() => setApplied(true))
                    .catch((error) => console.log(error));
                    
                const newApplicants = job.applicants ? [...job.applicants,user] : [user];
                const jobRef = ref(database, `jobs/${jobId}`);
                update(jobRef, { applicants: newApplicants })
                    .then(() => alert("Applied successfully!"))
                    .catch((error) => console.error("Error: ", error));
            } else {
                alert("You have already applied for this job.");
            }
        } else {
            if (confirm("Please login to apply for the job!")) {
                window.location.href = "/login";
            }
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!job) {
        return <div>Job not found</div>;
    }

    const { companyLogo, jobTitle, companyName, jobLocation, employmentType, minPrice, maxPrice, postingDate, description } = job;

    return (
        <div className="single-job">
            <img src={companyLogo} alt={jobTitle} className="w-16 h-16 mb-4" />
            <div className="job-details">
                <h4 className="text-primary mb-1">{companyName}</h4>
                <h3 className="text-lg font-semibold mb-2">{jobTitle}</h3>
                <div className="text-primary/70 text-base flex flex-wrap gap-2 mb-2">
                    <span className="flex items-center gap-2"><FiMapPin /> {jobLocation}</span>
                    <span className="flex items-center gap-2"><FiClock /> {employmentType}</span>
                    <span className="flex items-center gap-2"><FiDollarSign /> {minPrice}-{maxPrice}k</span>
                    <span className="flex items-center gap-2"><FiCalendar /> {postingDate}</span>
                </div>
                <p className="text-base text-primary/70">{description}</p>
            </div>
            <button 
                onClick={applyJob} 
                className={`ring-2 ${applied ? 'ring-gray-600 text-gray-600' : 'ring-green-600 text-green-600'} rounded hover:bg-green-600 hover:text-white px-3 py-1`} 
                disabled={applied}
            >
                {applied ? 'Applied' : 'Apply'}
            </button>
        </div>
    );
};

export default SingleJob;
