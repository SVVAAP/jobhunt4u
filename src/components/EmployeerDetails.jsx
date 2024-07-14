import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';

function EmployeerDetails() {
  const [employers, setEmployers] = useState([]);

  useEffect(() => {
    const userRef = ref(database, "users");
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        console.log(data);
        const employersList = Object.values(data).filter(user => user.userType === "employer");
        setEmployers(employersList);
      } else {
        setEmployers([]);
      }
    });
  }, []);

  return (
    <div>
      <h1>Employers</h1>
      {employers.length > 0 ? (
        <ul>
          {employers.map((employer, index) => (
            <li key={index}>{employer.name}</li>
          ))}
        </ul>
      ) : (
        <p>No employers found</p>
      )}
    </div>
  );
}

export default EmployeerDetails;
