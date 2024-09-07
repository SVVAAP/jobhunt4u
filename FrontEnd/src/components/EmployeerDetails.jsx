import React, { useEffect, useState } from 'react';
import { ref, onValue, remove, update } from 'firebase/database';
import { getAuth, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"; // Import required functions from Firebase Auth
import { database } from '../firebase';
import { useJobs } from '../context/jobsContext';
import Employee_card from './Employee_card';

function EmployeerDetails() {
  const [employers, setEmployers] = useState([]);
  const auth = getAuth(); // Get the Firebase Authentication instance

  useEffect(() => {
    const userRef = ref(database, "users");
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const employersList = Object.entries(data)
          .filter(([_, user]) => user.userType !== "candidate")
          .map(([id, user]) => ({ id, ...user })); // Add id to employers for future reference
        setEmployers(employersList.reverse());
      } else {
        setEmployers([]);
      }
    });
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3002/api/users/deleteUser/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        console.log("Employer deleted successfully.");
        // Update UI or state here
      } else {
        const errorData = await response.json();
        console.error("Failed to delete employer:", errorData.error);
      }
    } catch (error) {
      console.error("Error deleting employer:", error);
    }
  };
  
  const handleApproveDecline = (id, status) => {
    const employerRef = ref(database, `users/${id}`);
    update(employerRef, { approved: status }) // Update the employer's approval status
      .then(() => {
        alert(`Employer has been ${status ? "approved" : "declined"}.`);
      })
      .catch((error) => {
        console.error("Error updating employer status: ", error);
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Employers</h1>
      {employers.length > 0 ? (
        <div className="">
          {employers.map((employer, index) => (
            <Employee_card
              key={index}
              employer={employer}
              index={index}
              onDelete={handleDelete} // Pass delete handler
              onApproveDecline={handleApproveDecline} // Pass approve/decline handler
            />
          ))}
        </div>
      ) : (
        <p>No employers found</p>
      )}
    </div>
  );
}

export default EmployeerDetails;
