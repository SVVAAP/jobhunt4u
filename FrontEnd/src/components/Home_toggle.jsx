import React from 'react'
import { useJobs } from '../context/jobsContext';
import Home from '../Pages/Home';
import Home_Emp from '../Pages/Home_Emp';

function Home_toggle() {
    let {user}=useJobs();

  return (
    <>
    {user? (user.userType ==="candidate" ?(
      <Home/>):(
        <Home_Emp/>
    )
    ):(<Home/>)
}
    </>
  )
}

export default Home_toggle;
