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
    if (!id) {
      console.error("Invalid employer id");
      return;
    }
  
    try {
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (user) {
        // Prompt the user to enter their password
        const password = prompt("Please enter your password to confirm deletion:");
  
        if (!password) {
          console.log("Password is required for re-authentication.");
          return;
        }
  
        // Re-authenticate with the user's password
        const credential = EmailAuthProvider.credential(user.email, password);
  
        await reauthenticateWithCredential(user, credential);
        
        // Delete the user after re-authentication
        await deleteUser(user);
        console.log("User deleted from authentication");
  
        // Proceed with deleting user from the database
        const userRef = ref(database, `users/${id}`);
        await remove(userRef);
        console.log("Employer deleted successfully.");
      } else {
        console.log("No user is currently signed in.");
      }
    } catch (error) {
      console.error("Error deleting user from authentication:", error);
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
