import React from 'react'
import Location from './Location'
import Salary from './Salary'
import JobPostingData from './JobPostingData'
import WorkExperience from './WorkExperience'
import EmploymentType from './EmploymentType'

const Sidebar = ({ handleChange, handleClick ,clearFilters }) => {
  return (
    <div className='p-4 md:p-6 lg:p-8 bg-sky-800 rounded-2xl'>
      <div className='flex justify-between'>
        <h3 className='text-2xl font-bold mb-2 text-white'>Filters</h3>
        <button onClick={clearFilters} className='text-2xl font-bold mb-2 text-white'>
        <i className="fa-brands fa-rev"></i>
            </button>
            </div>
        <div className='space-y-5'>
          <Location handleChange={handleChange}/>
          <Salary handleChange={handleChange} handleClick={handleClick}/>
          <JobPostingData handleChange={handleChange}/>
          <WorkExperience handleChange={handleChange}/>
          <EmploymentType handleChange={handleChange}/>
        </div>
    </div>
  )
}

export default Sidebar
