import React, { useEffect, useState } from 'react'
import Location from './Location'
import Salary from './Salary'
import JobPostingData from './JobPostingData'
import WorkExperience from './WorkExperience'
import EmploymentType from './EmploymentType'
import { useMediaQuery } from 'react-responsive';

const Sidebar = ({ handleChange, handleClick, clearFilters }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [show, setShow] = useState(true);
  useEffect(() => {
    setShow(!isMobile);
  }, [isMobile]);

  return (
    <div className='p-4 md:p-6 lg:p-8 bg-sky-700 rounded'>
      <div className='flex justify-between transition-transform duration-500'>
        <h3 className='text-2xl font-bold mb-2 text-white'>Filters</h3>
        <div className='flex items-center'>
          {isMobile ?
            (
              <button onClick={() => { setShow(!show) }} className={`text-2xl font-bold mb-2 mx-6 pb-2 transition-transform duration-500 text-white ${show ? "rotate-180" : ""} `}><i className="fa-solid fa-sort-down"></i></button>
            ) : (<></>)}
          <button onClick={clearFilters} className='text-xl font-bold mb-2 mx-2 text-white'>
            Clear <i className="fa-brands fa-rev"></i>
          </button>
        </div>
      </div>
      {show ? (<div className='space-y-5'>
        <Location handleChange={handleChange} />
        <Salary handleChange={handleChange} handleClick={handleClick} />
        <JobPostingData handleChange={handleChange} />
        <WorkExperience handleChange={handleChange} />
        <EmploymentType handleChange={handleChange} />
      </div>) : (<></>)}

    </div>
  )
}

export default Sidebar
