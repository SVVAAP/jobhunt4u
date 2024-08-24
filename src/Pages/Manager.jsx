import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { getAuth, signOut } from 'firebase/auth';
import JobList from '../components/JobList'

function Manager() {
  const navigate=useNavigate();
  const auth=getAuth();
    const handleLogout = async () => {
        try {
          // eslint-disable-next-line no-restricted-globals
          var conf = confirm("Are you sure you want to log out?");
          if (conf === true) {
            signOut(auth)
            .then(() => {
              console.log('User signed out');
             navigate('/');
            })
            .catch((error) => {
              console.error('Error signing out: ', error);
            });
            
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
            <Link to="/jobhunt4u-admin/employer">Employer Details</Link>
            <Link to="/jobhunt4u-admin/candidate">Candidate Details</Link>
            <Link to="/jobhunt4u-admin/addjob">Add JObs</Link>
            <Link to="/jobhunt4u-admin/site-content">Site Content</Link>

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
