import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { FiCalendar, FiClock, FiDollarSign, FiMapPin } from "react-icons/fi";
import { FaRupeeSign } from 'react-icons/fa';
import { useJobs } from '../context/jobsContext';

const SingleJob = () => {
    let { jobs, user, uid, isLoggedIn ,isLoading } = useJobs();
    const { jobId } = useParams();
    if(!user){
        user=[];
    }

    const database = getDatabase();
    const auth = getAuth();

    const job = jobs.find(job => job.id === jobId);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!job) {
        return <div>Job not found</div>;
    }

    let applied = false;
    if (isLoggedIn && user && user.appliedJobs && user.appliedJobs.includes(jobId)) {
        applied = true;
    }

    const applyJob = () => {
        if (isLoggedIn) {
            if (!user.appliedJobs) {
                user.appliedJobs = [];
            }

            if (!user.appliedJobs.includes(jobId)) {
                const newAppliedJobs = [...user.appliedJobs, jobId];
                const userRef = ref(database, `users/${uid}`);
                update(userRef, { appliedJobs: newAppliedJobs })
                    .then(() => {
                        applied = true;

                        const { userType, ...userWithoutType } = user; // Remove userType from user object
                        const newApplicants = job.applicants ? [...job.applicants, userWithoutType] : [userWithoutType];
                        const jobRef = ref(database, `jobs/${jobId}`);
                        update(jobRef, { applicants: newApplicants })
                            .then(() => alert("Applied successfully!"))
                            .catch((error) => console.error("Error: ", error));
                    })
                    .catch((error) => console.log(error));
            } else {
                alert("You have already applied for this job.");
            }
        } else {
            if (confirm("Please login to apply for the job!")) {
                window.location.href = "/login";
            }
        }
    };

    const { companyLogo, jobTitle, companyName, jobLocation, employmentType, minPrice, maxPrice, postingDate, description } = job;

    return (
        <div className="single-job bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
            <img src={companyLogo} alt={jobTitle} className="w-16 h-16 mb-4 md:mb-0 md:mr-6" />
            <div className="job-details flex-1">
                <h4 className="text-primary mb-1 text-xl font-semibold">{companyName}</h4>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{jobTitle}</h3>
                <div className="text-primary/70 text-base flex flex-wrap gap-2 mb-4">
                    <span className="flex items-center gap-2"><FiMapPin className="text-gray-500" /> {jobLocation}</span>
                    <span className="flex items-center gap-2"><FiClock className="text-gray-500" /> {employmentType}</span>
                    <span className="flex items-center gap-2"><FaRupeeSign className="text-gray-500" /> {minPrice}-{maxPrice}k</span>
                    <span className="flex items-center gap-2"><FiCalendar className="text-gray-500" /> {postingDate}</span>
                </div>
                <p className="text-gray-700 text-base mb-4">Discription About Job</p>
                <p className="text-base text-primary/70 mb-4" style={{ whiteSpace: 'pre-line' }}>{description}</p>
            </div>
            <button
                onClick={applyJob}
                className={`ring-1 ${applied ? 'ring-blue text-gray-600' : 'ring-blue-600 text-blue-600'} rounded-lg hover:bg-blue-600 hover:text-white px-4 py-2 transition-all duration-300`}
                disabled={applied}
            >
                {applied ? 'Applied' : 'Apply'}
            </button>

        </div>

    );
};

export default SingleJob;
