import React, { useEffect, useState } from 'react'
import Location from './Location'
import Salary from './Salary'
import JobPostingData from './JobPostingData'
import WorkExperience from './WorkExperience'
import EmploymentType from './EmploymentType'
import { useMediaQuery } from 'react-responsive';
import Category from './Category'

const Sidebar = ({ handleChange, handleClick, clearFilters }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [show, setShow] = useState(true);
  useEffect(() => {
    setShow(!isMobile);
  }, [isMobile]);

  return (
    <div className='p-4 md:p-6 lg:p-8 bg-sky-700 rounded-lg'>
      <div className='flex justify-between transition-transform duration-500'>
        <h3 className='text-2xl font-bold mb-2 text-white'>Filters {isMobile ?
            (
              <button onClick={() => { setShow(!show) }} className={`text-2xl font-bold  mx-1 transition-transform duration-500 text-white ${show ? "rotate-180" : ""} `}><i className="fa-solid fa-sort-down"></i></button>
            ) : (<></>)}</h3>
        
        <div className='flex items-center'>
          
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
        <Category handleChange={handleChange}/>
      </div>) : (<></>)}

    </div>
  )
}

export default Sidebar
