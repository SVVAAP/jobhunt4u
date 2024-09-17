import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDatabase, push, ref, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import { useJobs } from "../context/jobsContext";
import Navbar from "../components/Navbar";
import card_image from "../assets/card_back.png";
import background from "../assets/singlejob_background.png";
import card_bg from "../assets/card_back2.png";
import TermsAndConditions from "../components/TermsAndConditions";

const placeholderLogo = "https://cdn-icons-png.flaticon.com/128/4168/4168507.png";

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
  const { allJobs, user, uid, isLoggedIn, userType } = useJobs();
  const { jobId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showConditions, setShowConditions] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [job, setJob] = useState(null);
  const navigate = useNavigate();
  const database = getDatabase();
  const auth = getAuth();
const [applied, setApplied] = useState(false);

 useEffect(() => {
    const foundJob = allJobs.find((job) => job.id === jobId);
    setJob(foundJob);
  
    if (foundJob && foundJob.applicants) {
      const currentUserEmail = auth.currentUser ? auth.currentUser.email : null;
  
      // Convert the applicants object to an array
      const applicantsArray = Object.values(foundJob.applicants);
  
      // Find the applicant that matches the current user's email
      const applicant = applicantsArray.find((app) => app.email === currentUserEmail);
  
      if (applicant) {
      setApplicationStatus(applicant.applicationStatus || "");
    } else{
      setApplicationStatus("declinedByAdmin");
    }
    console.log(applicationStatus || "blank")
  }
  setApplied(isLoggedIn && user && user.appliedJobs && user.appliedJobs.includes(jobId))
}, [jobId, allJobs, auth.currentUser,user,isLoggedIn]);

  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!job) {
    return <div>Loading.....</div>;
  }

  const applyJob = () => {
    setShowConditions(false);
  
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
  
            // Correcting the destructuring of the user object
            const { userType, appliedJobs, ...userWithoutTypeAndAppliedJobs } = user;
  
            const applicantWithStatus = {
              ...userWithoutTypeAndAppliedJobs,
              uid: uid, // Add uid here
              applicationStatus: "pending",
            };
  
            // Use push to store the new applicant with a unique key
            const newApplicantRef = ref(database, `jobs/${jobId}/applicants`);
            const newApplicantKey = push(newApplicantRef).key;
  
            const updates = {};
            updates[`/jobs/${jobId}/applicants/${newApplicantKey}`] = applicantWithStatus;
  
            update(ref(database), updates)
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
  };

  const candidate = user && userType === "candidate";
  const progressPercentage =
  {
    pending: 10,
    withEmployer: 66,
    approved: 100,
    declined: 100,
    declinedByAdmin: 0,
  }[applicationStatus] || 0;

const progressText =
  {
    pending: "Your Application is currently under review.",
    withEmployer: "Your Application is being reviewed by the employer.",
    approved: "Your Application was accepted.",
    declined: "Your Application was rejected by the employer.",
    //declinedByAdmin: "Your Application was declined by Admin .",
  }[applicationStatus] || "Your Application was declined by Admin";
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
    workmode,
    jobCategory,
  } = job;

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };
  return (
    <div
      className="bg-cover bg-center bg-blend-lighten"
      style={{ backgroundImage: `url(${background})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <Navbar className="bg-white" />

      <div className="job-detail-container p-5 min-h-screen flex items-center justify-center relative">
        <div
          className="single-job bg-white shadow-lg rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-6 relative"
          style={{ backgroundImage: `url(${card_bg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
          {/* Close button */}
          <button
            className="absolute top-2 right-5 text-red-600 hover:text-red-800 focus:outline-none z-10"
            onClick={() => handleBack()}>
            <i className="fa-solid fa-xmark text-2xl"></i>
          </button>

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
                <span className="font-semibold text-gray-700">Skills Required:</span> {skills && skills.join(", ")}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Work Mode:</span> {workmode}
              </div>
              <div>
                <span className="font-semibold text-gray-700">Catogery:</span> {jobCategory}
              </div>
            </div>

            <div className="text-gray-800 mb-6">
              <h4 className="text-lg font-semibold mb-2">Job Description:</h4>
              <p className="text-sm whitespace-pre-wrap">{description}</p>
            </div>
            {user ? (
              candidate && (
                <button
                  className={`px-3 py-1.5 mt-2 ${
                    applied ? "animated-gradient-header ring-2 ring-blue  " : "apply-bt"
                  } font-bold rounded-md hover:bg-blue-700 transition-all duration-300`}
                  onClick={() => {
                   applyJob();
                  }}
                  disabled={applied}>
                  {applied ? "Applied" : "Apply Now"}
                </button>
              )
            ) : (
              <button
                className={`px-3 py-1.5 mt-2 ${
                  applied ? "animated-gradient-header ring-2 ring-blue  " : "apply-bt"
                } font-bold rounded-md hover:bg-blue-700 transition-all duration-300`}
                onClick={() => {
                  if (confirm("Please login to apply for the job!")) {
                    window.location.href = "/login";
                  }
                }}
                disabled={applied}>
                {applied ? "Applied" : "Apply Now"}
              </button>
            )}
            {applied && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">Application Progress:</h4>
                {applicationStatus !== "declined" && (
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-full text-center animated-gradient-bg text-xs font-medium text-white bg-blue-600 rounded-full`}
                      style={{ width: `${progressPercentage}%` }}>
                      {progressPercentage}%
                    </div>
                  </div>
                )}
                <div className="font-bold">{progressText}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showPopup && (
        <SuccessPopup
          message="You have successfully applied for the job. <br /> Please keep track of your application status."
          onClose={() =>{ console.log(applicationStatus);
             setShowPopup(false);}}
        />
      )}
     
    </div>
  );
};

export default SingleJob;
