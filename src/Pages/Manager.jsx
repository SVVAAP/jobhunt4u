import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import JobList from '../components/JobList'

function Manager() {
    const handleLogout = async () => {
        try {
          // eslint-disable-next-line no-restricted-globals
          var conf = confirm("Are you sure you want to log out?");
          if (conf === true) {
            await logout();
            navigate('/a2z-admin');
          }
        } catch (error) {
          console.error('Failed to log out', error);
        }
      };
  return (
    <div>
        <div className='flex justify-center bg-slate-600 p-2'> 
            <h1 className='text-white text-3xl'>Admin Console</h1>
        </div>
        <div className='flex justify-center  m-5 space-x-10'>
            <Link to="/jobhunt4u-admin/" >All Jobs</Link>
            <Link to="/jobhunt4u-admin/applicants">Applicants</Link>
            <Link to="/jobhunt4u-admin/employer">Employeer Details</Link>
            <Link to="/jobhunt4u-admin/addjob">Add JObs</Link>

            <div className="absolute right-8">
            <img
              src='https://cdn2.iconfinder.com/data/icons/interface-essentials-1-2/24/logout--logout-frame-leave-exit-arrow-right-circle-512.png'
              alt='logout'
              className='float-right h-7 cursor-pointer'
              onClick={handleLogout}
            />
          </div>
        </div>
        <Outlet/>
    </div>
  )
}

export default Manager
