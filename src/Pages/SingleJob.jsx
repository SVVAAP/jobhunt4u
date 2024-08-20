import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDatabase, ref, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import { useJobs } from "../context/jobsContext";
import Navbar from "../components/Navbar";
import card_image from "../assets/card_back.png";
import background from "../assets/singlejob_background.png";
import card_bg from "../assets/card_back2.png";

const placeholderLogo = "https://cdn-icons-png.flaticon.com/128/4168/4168507.png"; // Placeholder image URL
const formatIndianCurrency = (price) => {
  let parts = price.toString().split(".");
  let lastThree = parts[0].slice(-3);
  let otherNumbers = parts[0].slice(0, -3);
  if (otherNumbers !== "") lastThree = "," + lastThree;
  let formattedPrice = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  

  if (parts[1]) {
    formattedPrice += "." + parts[1];
  }
  return formattedPrice;
};

const SuccessPopup = ({ message, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div
      className="bg-white rounded-lg p-8 text-center"
      style={{ backgroundImage: `url(${card_image})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <svg
        className="w-16 h-16 mx-auto mb-4 text-sky-700"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M22 12v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9" />
      </svg>
      <p className="mb-4 text-gray-800" dangerouslySetInnerHTML={{ __html: message }} />
      <button
        onClick={onClose}
        className="bg-blue-600 text-blue ring-2 ring-blue rounded px-8 py-1 hover:bg-blue-700 transition-all duration-300">
        OK
      </button>
    </div>
  </div>
);

const SingleJob = () => {
  const { jobs, user, uid, isLoggedIn } = useJobs();
  const { jobId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState();
  let navigate=new useNavigate();
  const database = getDatabase();
  const auth = getAuth();

  const job = jobs.find((job) => job.id === jobId);

  const [applied, setApplied] = useState(isLoggedIn && user && user.appliedJobs && user.appliedJobs.includes(jobId));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!job) {
    return <div>Loading.....</div>;
  }

  const applyJob = () => {
    if (user) {
      if (user.resume !== "") {
        if (!user.appliedJobs) {
          user.appliedJobs = [];
        }
  
        if (!user.appliedJobs.includes(jobId)) {
          const newAppliedJobs = [...user.appliedJobs, jobId];
          const userRef = ref(database, `users/${uid}`);
          update(userRef, { appliedJobs: newAppliedJobs })
            .then(() => {
              setApplied(true);
  
              const { userType, ...userWithoutType } = user; // Remove userType from user object
              const applicantWithStatus = {
                ...userWithoutType,
                applicationStatus: "pending", // Add application status as pending
              };
              const newApplicants = job.applicants ? [...job.applicants, applicantWithStatus] : [applicantWithStatus];
              const jobRef = ref(database, `jobs/${jobId}`);
              update(jobRef, { applicants: newApplicants })
                .then(() => setShowPopup(true))
                .catch((error) => console.error("Error: ", error));
            })
            .catch((error) => console.log(error));
        } else {
          alert("You have already applied for this job.");
        }
      } else {
        alert("Please Upload Your Resume.");
      }
    } else {
      if (confirm("Please login to apply for the job!")) {
        window.location.href = "/login";
      }
    }
  };
  

  const {
    companyLogo,
    jobTitle,
    companyName,
    jobLocation,
    employmentType,
    minPrice,
    maxPrice,
    postingDate,
    description,
    experienceLevel,
    skills,
    salaryType,
    Workmode,
  } = job;

  return (
    <div
   className="bg-cover bg-center bg-blend-lighten" 
       style={{ backgroundImage: `url(${background})`, backgroundSize: "cover", backgroundPosition: "center" }} >
      <Navbar className="bg-white" />
      <button
          className="flex items-center px-2 py-2 mx-4 bg-slate-100/80 transition-transform hover:scale-105 text-red-600 ring-2 ring-red-600 rounded-lg font-extrabold hover:bg-red-600 hover:text-white focus:outline-none "
          onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left-long  mr-2"></i>
          Back
        </button>
      <div className="job-detail-container p-12 min-h-screen flex items-center justify-center ">
        <div
          className="single-job bg-white shadow-lg rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-6 transition-transform duration-1000 hover:scale-105 "
          style={{ backgroundImage: `url(${card_bg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
          <img
            src={companyLogo || placeholderLogo}
            alt={jobTitle}
            className="w-20 h-20 mb-4 md:mb-0 md:mr-6 rounded-full border-2 border-gray-200"
            onError={(e) => (e.target.src = placeholderLogo)}
          />
          <div className="job-details flex-1">
            <h4 className="text-blue-600 mb-2 text-2xl font-bold">{companyName}</h4>
            <h3 className="text-gray-800 text-xl font-semibold mb-4">{jobTitle}</h3>
            <div className="text-gray-600 text-base flex flex-col md:flex-row gap-4 mb-6">
              <span className="flex items-center gap-2 text-lg">
                <FiMapPin className="text-gray-500" /> {jobLocation}
              </span>
              <span className="flex items-center gap-2 text-lg">
                <FiClock className="text-gray-500" /> {employmentType}
              </span>
              <span className="flex items-center gap-2">
                <FaRupeeSign className="text-gray-500" /> {formatIndianCurrency(minPrice)} -{" "}
                {formatIndianCurrency(maxPrice)} {salaryType}
              </span>
              <span className="flex items-center gap-2 text-lg">
                <FiCalendar className="text-gray-500" /> {postingDate}
              </span>
            </div>
            <div className="text-gray-600 text-base flex flex-col gap-2 mb-6">
              <div>
                <span className="font-semibold text-gray-700">Experience Level:</span> {experienceLevel}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Work Mode:</span> {Workmode}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Skills:</span>
                <div className="mt-1 flex flex-wrap gap-4 rounded ring-1 ring-black">
                  {skills.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-800 text-base mb-4 font-semibold">Description About Job:</p>
            <p
              className="text-base max-w-3xl text-gray-700 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
              style={{
                whiteSpace: "pre-line",
                overflowWrap: "break-word",
                wordBreak: "break-word",
              }}>
              {description}
            </p>
          </div>
          {user? (user.userType ==="candidate" &&
          <button
            onClick={applyJob}
            className={`ring-1 ${
              applied ? "ring-green-700 text-white bg-green-600" : "ring-blue text-white bg-blue"
            } rounded-lg hover:bg-green-700 hover:text-white px-5 py-3 transition-all duration-300 text-lg font-semibold`}
            disabled={applied}>
            {applied ? "Applied" : "Apply"}
          </button>):
          (  <button
            onClick={applyJob}
            className={`ring-1 ${
              applied ? "ring-green-700 text-white bg-green-600" : "ring-blue text-white bg-blue"
            } rounded-lg hover:bg-green-700 hover:text-white px-5 py-3 transition-all duration-300 text-lg font-semibold`}
            disabled={applied}>
            {applied ? "Applied" : "Apply"}
          </button>)
}
        </div>
      </div>

      {showPopup && (
        <SuccessPopup
          message="Successfully applied for the job! <br> Our team will contact you as soon as possible."
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default SingleJob;
