import React, { useState } from 'react';
import { ref, update } from "firebase/database";
import { database } from "../firebase";
import Card from './Card2';
import { useJobs } from '../context/jobsContext';

function JobList() {
    const { jobs } = useJobs(); // Retrieve jobs from context

    // State for filters
    const [filters, setFilters] = useState({
        jobTitle: '',
        companyName: '',
        jobLocation: '',
        employmentType: '',
        status: ''
    });

    // Handle filter changes
    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    // Filter jobs based on criteria
    const filteredJobs = jobs.filter(job => {
        return (
            (filters.jobTitle === '' || job.jobTitle.toLowerCase().includes(filters.jobTitle.toLowerCase())) &&
            (filters.companyName === '' || job.companyName.toLowerCase().includes(filters.companyName.toLowerCase())) &&
            (filters.jobLocation === '' || job.jobLocation.toLowerCase().includes(filters.jobLocation.toLowerCase())) &&
            (filters.employmentType === '' || job.employmentType.toLowerCase().includes(filters.employmentType.toLowerCase())) &&
            (filters.status === '' || job.status.toLowerCase().includes(filters.status.toLowerCase()))
        );
    });

    // Define handleApprove and handleDecline functions
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
    const clearFilters = () => {
        setFilters({
            jobTitle: '',
            companyName: '',
            jobLocation: '',
            employmentType: '',
            status: ''
        });
    };


    return (
        <>
            {/* Filter UI */}
            <div className='bg-sky-900 p-3 rounded-lg m-4'>
                <div className='flex justify-between'>

                    <h1 className='text-white font-roboto font-extrabold text-2xl m-2'>
                        Filter   jobs: {filteredJobs.length}
                    </h1>

                    {/* Clear Filters Button */}
                    <button onClick={clearFilters} className='text-xl font-bold mb-2 mx-2 text-white'>
  Clear <i className="fa-brands fa-rev"></i>
</button>

                </div>


                <div className="filter-container grid grid-cols-1 md:grid-cols-5 gap-4 ">
                    <input
                        type="text"
                        name="jobTitle"
                        value={filters.jobTitle}
                        onChange={handleFilterChange}
                        placeholder="Filter by Job Title"
                        className="p-2 border rounded text-sky-950"
                    />
                    <input
                        type="text"
                        name="companyName"
                        value={filters.companyName}
                        onChange={handleFilterChange}
                        placeholder="Filter by Company Name"
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="jobLocation"
                        value={filters.jobLocation}
                        onChange={handleFilterChange}
                        placeholder="Filter by Location"
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="employmentType"
                        value={filters.employmentType}
                        onChange={handleFilterChange}
                        placeholder="Filter by Employment Type"
                        className="p-2 border rounded"
                    />
                    <input
                        type="text"
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        placeholder="Filter by Status"
                        className="p-2 border rounded"
                    />
                </div>
            </div >
            {/* Job List */}
            < div className='grid grid-cols-1 md:grid-cols-3 gap-3' >
                {filteredJobs && filteredJobs.map((data, i) => (
                    <Card key={i} data={data} handleApprove={handleApprove} handleDecline={handleDecline} />
                ))
                }
            </div >
        </>
    );
}

export default JobList;
