import React, { useState, useEffect } from 'react';
import { useJobs } from '../context/jobsContext';
import excel from '../assets/excel.png';
import * as XLSX from 'xlsx'; // Update this line

const Applicants = () => {
    const { jobs } = useJobs();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (jobs.length > 0) {
            setIsLoading(false);
        }
    }, [jobs]);

    const downloadExcel = (data, name) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        // Trigger a download
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = name + '.xlsx';
        link.click();
    };

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
                <div key={job.id} className="m-2 p-2 flex justify-between flex-col rounded ring-2">
                    <div className='flex justify-between'>
                        <div className="flex items-center">
                            <img src={job.companyLogo} alt={job.jobTitle} className="w-16 h-16 mb-4" />
                            <h2>{job.jobTitle} at {job.companyName}</h2>
                        </div>
                        <div>
                            <div onClick={() => { downloadExcel(job.applicants, job.companyName) }} className='relative right-2 top-2 bg-green-700 ring-2 m-2 ring-green-700 rounded-lg flex'>
                                <p className='bg-white text-green-700 rounded-lg p-1'>Download</p>
                                <img className="h-6 m-1" src={excel} alt="excel" />
                            </div>
                        </div>
                    </div>
                    <div>
                        {job.applicants && job.applicants.length > 0 ? (
                            <div>
                                {job.applicants.map((applicant, index) => (
                                    <div key={index} className='flex justify-evenly p-2 my-2 ring-2 rounded'>
                                        <p>{index + 1}</p>
                                        <p className='ring-2 rounded p-1'>Name: {applicant?.name || 'N/A'}</p>
                                        <p className='ring-2 rounded p-1'>Email: {applicant?.email || 'N/A'}</p>
                                        <p className='ring-2 rounded p-1'>Phone: {applicant?.phone || 'N/A'}</p>
                                        {/* Add more applicant details as needed */}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No applicants for this job</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Applicants;
 