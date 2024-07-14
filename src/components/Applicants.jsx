import React, { useState } from 'react';
import { useJobs } from '../context/jobsContext';

const Applicants = () => {
    const { jobs } = useJobs();
    const [isLoading, setIsLoading] = useState(false);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (jobs.length === 0) {
        return <div>No jobs found</div>;
    }

    return (
        <div>
            <h1>Applicants for All Jobs</h1>
            {jobs.map((job) => (
                <div key={job.id} className="job-applicants">
                    <h2>{job.jobTitle} at {job.companyName}</h2>
                    {job.applicants && job.applicants.length > 0 ? (
                        <ul>
                            {job.applicants.map((applicant, index) => (
                                <li key={index}>
                                    <p>Name: {applicant?.name || 'N/A'}</p>
                                    <p>Email: {applicant?.email || 'N/A'}</p>
                                    <p>Phone: {applicant?.phone || 'N/A'}</p>
                                    {/* Add more applicant details as needed */}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No applicants for this job</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Applicants;
