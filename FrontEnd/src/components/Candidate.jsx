import React, { useEffect, useState } from "react";
import { database, onValue, ref } from "../firebase";
import User_card from "./User_card";

function Candidate() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const userRef = ref(database, "users");
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const candidatesList = Object.entries(data)
          .filter(([_, user]) => user.userType === "candidate")
          .map(([id, user]) => ({ id, ...user })); // Ensure id is correctly added to the user object
        setCandidates(candidatesList.reverse());
       // console.log(candidatesList.length);
      } else {
        setCandidates([]);
        
      }
  }, []);
});

  const handleDelete = async (id) => {
    // Prompt the user to confirm deletion
    const isConfirmed = window.confirm("Are you sure you want to delete this Candidate? This action cannot be undone.");

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
        window.alert("Candidate deleted successfully.");
        // Update UI or state here if needed
      } else {
        const errorData = await response.json();
        window.alert(`Failed to delete Candidate: ${errorData.error}`);
      }
    } catch (error) {
      window.alert("An error occurred while deleting the candidate. Please try again.");
      console.log(error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Candidates</h1>
      {candidates.length > 0 ? (
        <div className="">
          {candidates.map((user, index) => (
            <User_card key={index} user={user} index={index} onDelete={handleDelete} Candidate={true} />
          ))}
        </div>
      ) : (
        <p>No candidates found</p>
      )}
    </div>
  );
}

export default Candidate;
