import React, { useEffect, useState } from "react";
import { ref, onValue,update } from "firebase/database";
import { getAuth } from "firebase/auth"; // Import required functions from Firebase Auth
import { database } from "../firebase";
import User_card from "./User_card";
import { useJobs } from "../context/jobsContext";
import Loading from "./Loading";

function EmployeerDetails() {
  const [employers, setEmployers] = useState([]);
  const auth = getAuth(); // Get the Firebase Authentication instance
  const {isLoading}=useJobs();

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
    // Prompt the user to confirm deletion
    const isConfirmed = window.confirm("Are you sure you want to delete this employer? This action cannot be undone.");

    if (!isConfirmed) {
      return; // Exit if the user does not confirm
    }

    try {
      const response = await fetch(`https://jobhunt4u-backend.vercel.app/api/users/deleteUser/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        window.alert("Employer deleted successfully.");
        console.log("Employer deleted successfully.");
        // Update UI or state here if needed
      } else {
        const errorData = await response.json();
        window.alert(`Failed to delete employer: ${errorData.error}`);
        console.error("Failed to delete employer:", errorData.error);
      }
    } catch (error) {
      window.alert("An error occurred while deleting the employer. Please try again.");
      console.error("Error deleting employer:", error);
    }
  };

  const handleApproveDecline = (id, cstatus) => {
    const employerRef = ref(database, `users/${id}`);
    // Correctly update the status without extra concatenation
    update(employerRef, { status: cstatus ? "approved" : "declined" }) // Update the employer's approval status
      .then(() => {
        
        alert(`Employer has been ${cstatus ? "approved" : "declined"}.`);
      })
      .catch((error) => {
        console.error("Error updating employer status: ", error);
      });
  };

  if(isLoading){
    return <Loading/>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Employers</h1>
      {employers.length > 0 ? (
        <div className="">
          {employers.map((employer, index) => (
            <User_card
              key={index}
              user={employer}
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
