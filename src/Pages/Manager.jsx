import React from 'react'
import { Outlet } from 'react-router-dom'
import JobList from '../components/JobList'

function Manager() {
  return (
    <div>
        <div className='flex justify-center bg-slate-600'> 
            <h1 className='text-white text-3xl'>Manager</h1>
        </div>
        <JobList/>
        <Outlet/>
    </div>
  )
}

export default Manager
