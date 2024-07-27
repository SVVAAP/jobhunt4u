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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {employers.map((employer, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
              <h2 className="text-xl font-semibold mb-2">{employer.name}</h2>
              <p className="text-gray-600 mb-2"><strong>Email:</strong> {employer.email}</p>
              <p className="text-gray-600 mb-2"><strong>Phone:</strong> {employer.phone}</p>
              <p className="text-gray-600 mb-2"><strong>Company:</strong> {employer.company}</p>
              <p className="text-gray-600 mb-2"><strong>Location:</strong> {employer.location}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No employers found</p>
      )}
    </div>
  );
}

export default EmployeerDetails;
