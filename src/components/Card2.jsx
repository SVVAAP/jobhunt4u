import React, { useState } from 'react';
import { ref, remove } from "firebase/database";
import { FiCalendar, FiClock, FiDollarSign, FiMapPin } from "react-icons/fi";
import { Link } from "react-router-dom";
import { database } from "../firebase";
import JobEditModal from '../components/JobEditModel';
import { useJobs } from '../context/jobsContext';
import { FaRubleSign, FaRupeeSign } from 'react-icons/fa';

const Card = ({ data, handleApprove, handleDecline }) => {
  const {user}=useJobs();
  const { id, companyLogo, jobTitle, companyName, jobLocation, employmentType, minPrice, maxPrice, postingDate, description, status } = data;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteJob = async () => {
    if (window.confirm("Are you sure you want to delete it?")) {
      await remove(ref(database, `jobs/${id}`));
    }
  };

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSave = () => {
    setIsModalOpen(false);
    // Optionally, trigger re-render or refetch jobs
  };

  return (
    <div>
      <section className="card bg-slate-300 relative rounded">
        <div className="absolute top-2 right-2 z-10 flex space-x-4">
          <button
            onClick={handleEdit}
            className="text-white bg-sky-500 p-2 rounded hover:bg-blue-600"
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
          <button
            onClick={deleteJob}
            className="text-white bg-red-500 p-2 rounded hover:bg-red-600"
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
        <Link to={`/singlejob/${id}`} className="flex gap-4 flex-col sm:flex-row items-start">
          <img src={companyLogo} alt={jobTitle} className="w-16 h-16 mb-4" />
          <div className="card-details">
            <h4 className="text-primary mb-1">{companyName}</h4>
            <h3 className="text-lg font-semibold mb-2">{jobTitle}</h3>
            <div className="text-primary/70 text-base flex flex-wrap gap-2 mb-2">
              <span className="flex items-center gap-2"><FiMapPin /> {jobLocation}</span>
              <span className="flex items-center gap-2"><FiClock /> {employmentType}</span>
              <span className="flex items-center gap-2"><FaRupeeSign /> {minPrice}-{maxPrice}</span>
              <span className="flex items-center gap-2"><FiCalendar /> {postingDate}</span>
            </div>
            <div className="flex justify-center bg-sky-950 rounded-lg m-2">
              <h1 className="text-gray-400">Status: {status}</h1>
            </div>
            <p className="text-base text-primary/70 ">{description.slice(0, 33) + "...Read More"}</p>
          </div>
        </Link>
        {user && user.userType==="admin" &&
        <div className="flex justify-around">
          <button
            className="bg-sky-600 hover:bg-sky-900 px-3 py-1 rounded text-white"
            onClick={() => handleApprove(id)}
          >
            Approve
          </button>
          <button
            className="bg-red-600 hover:bg-red-900 px-3 py-1 rounded text-white"
            onClick={() => handleDecline(id)}
          >
            Decline
          </button>
        </div>}
      </section>

      <JobEditModal
        job={data}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
      />
    </div>
  );
};

export default Card;
