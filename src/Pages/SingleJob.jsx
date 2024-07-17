import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";
import { FaRupeeSign } from 'react-icons/fa';
import { useJobs } from '../context/jobsContext';

const placeholderLogo = 'https://cdn-icons-png.flaticon.com/128/4168/4168507.png'; // Placeholder image URL

const SuccessPopup = ({ message, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4" />
                <path d="M22 12v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9" />
            </svg>
            <p className="mb-4 text-gray-800">{message}</p>
            <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-300">OK</button>
        </div>
    </div>
);

const SingleJob = () => {
    const { jobs, user, uid, isLoggedIn } = useJobs();
    const { jobId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const database = getDatabase();
    const auth = getAuth();

    const job = jobs.find(job => job.id === jobId);

    const [applied, setApplied] = useState(isLoggedIn && user && user.appliedJobs && user.appliedJobs.includes(jobId));

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!job) {
        return <div>Job not found</div>;
    }

    const applyJob = () => {
        if (user) {
            if (!user.appliedJobs) {
                user.appliedJobs = [];
            }

            if (!user.appliedJobs.includes(jobId)) {
                const newAppliedJobs = [...user.appliedJobs, jobId];
                const userRef = ref(database, `users/${uid}`);
                update(userRef, { appliedJobs: newAppliedJobs })
                    .then(() => {
                        setApplied(true);

                        const { userType, ...userWithoutType } = user; // Remove userType from user object
                        const newApplicants = job.applicants ? [...job.applicants, userWithoutType] : [userWithoutType];
                        const jobRef = ref(database, `jobs/${jobId}`);
                        update(jobRef, { applicants: newApplicants })
                            .then(() => setShowPopup(true))
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
        <>
            <div className="single-job bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
                <img src={companyLogo || placeholderLogo} alt={jobTitle} className="w-16 h-16 mb-4 md:mb-0 md:mr-6" onError={(e) => e.target.src = placeholderLogo} />
                <div className="job-details flex-1">
                    <h4 className="text-primary mb-1 text-xl font-semibold">{companyName}</h4>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">{jobTitle}</h3>
                    <div className="text-primary/70 text-base flex flex-wrap gap-2 mb-4">
                        <span className="flex items-center gap-2"><FiMapPin className="text-gray-500" /> {jobLocation}</span>
                        <span className="flex items-center gap-2"><FiClock className="text-gray-500" /> {employmentType}</span>
                        <span className="flex items-center gap-2"><FaRupeeSign className="text-gray-500" /> {minPrice}-{maxPrice}k</span>
                        <span className="flex items-center gap-2"><FiCalendar className="text-gray-500" /> {postingDate}</span>
                    </div>
                    <p className="text-gray-700 text-base mb-4">Description About Job</p>
                    <p className="text-base text-primary/70 mb-4 p-5" style={{ whiteSpace: 'pre-line' }}>{description}</p>
                </div>
                <button
                    onClick={applyJob}
                    className={`ring-1 ${applied ? 'ring-green-700 text-white bg-green-600' : 'ring-blue text-white bg-blue'} rounded-lg hover:bg-transparent hover:text-black px-4 py-2 transition-all duration-300`}
                    disabled={applied}
                >
                    {applied ? 'Applied' : 'Apply'}
                </button>
            </div>
            {showPopup && (
                <SuccessPopup 
                    message="Successfully applied for the job! Our team will contact you as soon as possible."
                    onClose={() => setShowPopup(false)}
                />
            )}
        </>
    );
};

export default SingleJob;
