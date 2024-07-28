import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import { useJobs } from '../context/jobsContext';
import Employee_card from './Employee_card';

function EmployeerDetails() {
  const [employers, setEmployers] = useState([]);

  useEffect(() => {
    const userRef = ref(database, "users");
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const employersList = Object.values(data).filter(user => user.userType === "employer");
        setEmployers(employersList);
      } else {
        setEmployers([]);
      }
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Employers</h1>
      {employers.length > 0 ? (
        <div className="">
          {employers.map((employer, index) => (
           <Employee_card key={index} employer={employer} index={index}/>
          ))}
        </div>
      ) : (
        <p>No employers found</p>
      )}
    </div>
  );
}

export default EmployeerDetails;
