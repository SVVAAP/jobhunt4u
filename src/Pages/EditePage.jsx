import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { database } from '../firebase';
import { useJobs } from "../context/jobsContext";

function EditePage() {
const { isLoading,aboutContent,setAboutContent}=useJobs();

  const handleInputChange = (event) => {
    setAboutContent(event.target.value);
  };

  const handleSave = () => {
    const aboutRef = ref(database, "siteContent");
  
    // Update the content in Firebase
    update(aboutRef, { about: aboutContent })
      .then(() => {
        alert("Content updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating content: ", error);
      });
  };
  

  return (
    <div className="p-6 bg-sky-800">
      <h2 className="text-2xl font-bold mb-4">Edit About Section</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <textarea
            className="w-full h-48 p-2 border border-gray-300 rounded-lg"
            value={aboutContent}
            onChange={handleInputChange}
          ></textarea>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </>
      )}
    </div>
  );
}

export default EditePage;
