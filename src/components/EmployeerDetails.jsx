import React from 'react'
import { useJobs } from '../context/jobsContext'

function EmployeerDetails() {
    const {user}=useJobs;
    const employer=user &&user.userType === "employer";
    console.log(employer);
  return (
    <div>
      <h1>Employeer</h1>
    </div>
  )
}

export default EmployeerDetails
