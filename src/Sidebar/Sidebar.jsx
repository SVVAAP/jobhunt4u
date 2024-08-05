import React from 'react'
import Location from './Location'
import Salary from './Salary'
import JobPostingData from './JobPostingData'
import WorkExperience from './WorkExperience'
import EmploymentType from './EmploymentType'

const Sidebar = ({ handleChange, handleClick }) => {
  return (
    <div className='p-4 md:p-6 lg:p-8 bg-sky-800 rounded-2xl'>
        <h3 className='text-lg font-bold mb-2 text-white'>Filters</h3>
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
