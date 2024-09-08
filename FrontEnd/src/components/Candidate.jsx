import React, { useEffect, useState } from 'react'
import { database, onValue, ref } from '../firebase';
import Employee_card from './Employee_card';

function Candidate() {
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
      const userRef = ref(database, "users");
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const candidatesList = Object.values(data).filter(user => user.userType === "candidate");
          setCandidates(candidatesList.reverse());
        } else {
          setCandidates([]);
        }
      });
    }, []);
  
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Candidates</h1>
        {candidates.length > 0 ? (
          <div className="">
            {candidates.map((employer, index) => (
             <Employee_card key={index} employer={employer} index={index} Candidate={true}/>
            ))}
          </div>
        ) : (
          <p>No candidates found</p>
        )}
      </div>
    );
  }

export default Candidate;