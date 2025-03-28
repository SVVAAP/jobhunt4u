import React, { useEffect, useState } from "react";
import { useJobs } from "../context/jobsContext";
import Cookies from "js-cookie";
import { signOut } from "firebase/auth";
import { auth, database, storage, ref, set, storageRef, uploadBytes, getDownloadURL } from "../firebase";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { HiPencil } from "react-icons/hi";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";
import { stateObject } from "../assets/Country+State+District-City-Data"; // Import the country-state-district data



function Profile() {
  const { user, jobs, isLoading ,isLoggedIn} = useJobs();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    workStatus: "",
    yearsOfExperience: "",
    companyNames: "",
    resume: "",
  });
  const [location, setLocation] = useState({ country: "", state: "", district: "" });

useEffect(() => {
  if (user && user.location) {
    setLocation({
      country: user.location.country || "",
      state: user.location.state || "",
      district: user.location.district || "",
    });
  }
}, [user]);

const handleCountryChange = (e) => {
  setLocation({ ...location, country: e.target.value, state: "", district: "" });
};

const handleStateChange = (e) => {
  setLocation({ ...location, state: e.target.value, district: "" });
};

const handleDistrictChange = (e) => {
  setLocation({ ...location, district: e.target.value });
};

     const countries = Object.keys(stateObject); // Get the list of countries

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        workStatus: user.workStatus || "",
        yearsOfExperience: user.yearsOfExperience || "",
        companyNames: user.companyNames || "",
        resume: user.resumeUrl || "",
      });
      const appliedJobs = user.appliedJobs || [];
      setFilteredJobs(jobs.filter((job) => appliedJobs.includes(job.id)));

      const messageShown = Cookies.get("accountCreatedMessageShown");
      if (!messageShown) {
        setShowSuccessMessage(true);
        Cookies.set("accountCreatedMessageShown", "true", { expires: 365 });
      }
    }
  }, [user, jobs]);

  const handleLogout = async () => {
    try {
      if (confirm("Are you Sure You want to logout?")) {
        await signOut(auth);
        navigate("/");
      }
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (file) {
      if (!allowedTypes.includes(file.type)) {
        setFileError("Invalid file type. Only JPG, PNG, and PDF files are allowed.");
        e.target.value = null; // Clear the input field
        return;
      }

      if (file.size > maxSize) {
        setFileError("File size exceeds 2MB. Please upload a smaller file.");
        e.target.value = null; // Clear the input field
        return;
      }

      // If valid, clear any existing error messages and update formData
      setFileError(null);
      setFormData((prev) => ({
        ...prev,
        resume: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        let resumeUrl = formData.resume instanceof File ? await uploadResume(formData.resume) : formData.resume;

        await set(ref(database, `users/${currentUser.uid}`), {
          userID:user?.userID || "",
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          workStatus: formData.workStatus,
          yearsOfExperience: formData.yearsOfExperience,
          companyNames: formData.companyNames,
          resumeUrl: resumeUrl,
          appliedJobs: currentUser.appliedJobs ?? [],
          userType: currentUser.userType ? currentUser.userType : 'candidate',
          location: location,
        });

        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating user details: ", error);
      setError("Failed to update user details.");
    }
  };

  const uploadResume = async (file) => {
    try {
      const resumeRef = storageRef(storage, `resumes/${auth.currentUser.uid}/${file.name}`);
      await uploadBytes(resumeRef, file);
      const downloadURL = await getDownloadURL(resumeRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading resume: ", error);
      setError("Failed to upload resume.");
      return "";
    }
  };

  if (isLoading) {
    return <Loading/>;
  }
  else if(!isLoggedIn){
    return <div>Not logged in</div>;
  }

  return (
    <>
    <Navbar/>
    <div className=" p-8" id="">
      <div className="container mx-auto flex justify-between content-center text-center  mb-4">
        <button
          className="flex items-center  px-2 mx-4 bg-slate-100/80 transition-transform hover:scale-105 text-red-600 ring-1 ring-red-600 rounded font-extrabold hover:bg-red-600 hover:text-white focus:outline-none "
          onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left-long  mr-2"></i>
          Back
        </button>
        <button onClick={handleLogout} className=" bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
          <i className="fa-solid fa-right-from-bracket"></i> Logout
        </button>
      </div>
      <div className="relative bg-white shadow-md rounded-lg md:m-8 p-8">
        {!isEditing && (
          <HiPencil onClick={handleEditClick} className="absolute top-4 right-4 text-blue-500 cursor-pointer text-xl" />
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-2xl font-bold mb-4">Welcome,<span className="animated-gradient">{formData.name}</span> !</h1>
          {showSuccessMessage && (
            <div className="bg-green-100 p-4 rounded-lg mb-4 flex items-center">
              <img
                src="//static.naukimg.com/s/7/104/assets/images/green-tick.49de0665.svg"
                alt="Success"
                className="w-8 h-8 mr-2"
              />
              <span className="text-green-700 text-lg font-medium">Your account is created successfully.</span>
              <span className="text-gray-700 ml-2">Let’s get started!</span>
            </div>
          )}
          <p className="text-lg mb-4">Search & apply to jobs from India&apos;s No.1 Job Site</p>
          <div className="bg-gray-100 p-4 rounded-lg space-y-4">
            <div className="formField">
              <label className="block text-gray-700 mb-1">Full name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`formInput p-2 border rounded w-full ${!isEditing ? "bg-gray-200 cursor-not-allowed" : ""}`}
                disabled={!isEditing}
              />
            </div>

            <div className="formField">
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`formInput p-2 border rounded w-full ${!isEditing ? "bg-gray-200 cursor-not-allowed" : ""}`}
                disabled={!isEditing}
              />
            </div>

            <div className="formField">
              <label className="block text-gray-700 mb-1">Mobile number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`formInput p-2 border rounded w-full ${!isEditing ? "bg-gray-200 cursor-not-allowed" : ""}`}
                disabled={!isEditing}
              />
            </div>
  {/* Country, State, District Selection */}
              <div className="formField">
                <label className="block text-gray-700 mb-1">Country</label>
                <select value={location.country} onChange={handleCountryChange}  className={`formInput p-2 border rounded w-full ${!isEditing ? "bg-gray-200 cursor-not-allowed" : ""}`}  disabled={!isEditing}>
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
                <div className="formField">
                  <label className="block text-gray-700 mb-1">State</label>
                  <select value={location.state} onChange={handleStateChange}  className={`formInput p-2 border rounded w-full ${!isEditing ? "bg-gray-200 cursor-not-allowed" : ""}`}  disabled={!isEditing}>
                    <option value="">Select State</option>
                    {location?.country? Object.keys(stateObject[location.country]).map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    )):"Select Country"}
                  </select>
                </div>
                <div className="formField">
                  <label className="block text-gray-700 mb-1">District</label>
                  <select
                    value={location.district}
                    onChange={handleDistrictChange}
                    className={`formInput p-2 border rounded w-full ${!isEditing ? "bg-gray-200 cursor-not-allowed" : ""}`}
                    disabled={!isEditing}>
                    <option value="">Select District</option>
                    {location.stete? stateObject[location.country][location.state].map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    )):"Select State"}
                  </select>
                </div>
            <div className="formField">
              <label className="block text-gray-700 mb-1">Work Status</label>
              <select
                name="workStatus"
                value={formData.workStatus}
                onChange={handleChange}
                className={`formInput p-2 border rounded w-full ${!isEditing ? "bg-gray-200 cursor-not-allowed" : ""}`}
                disabled={!isEditing}>
                <option value="fresher">I&apos;m a Fresher</option>
                <option value="experienced">I&apos;m Experienced</option>
              </select>
            </div>

            {formData.workStatus === "experienced" && (
              <>
                <div className="formField">
                  <label className="block text-gray-700 mb-1">Years of Experience</label>
                  <input
                    type="text"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    className={`formInput p-2 border rounded w-full ${!isEditing ? "bg-gray-200 cursor-not-allowed" : ""
                      }`}
                    disabled={!isEditing}
                  />
                </div>

                <div className="formField">
                  <label className="block text-gray-700 mb-1">Company Names</label>
                  <input
                    type="text"
                    name="companyNames"
                    value={formData.companyNames}
                    onChange={handleChange}
                    className={`formInput p-2 border rounded w-full ${!isEditing ? "bg-gray-200 cursor-not-allowed" : ""
                      }`}
                    disabled={!isEditing}
                  />
                </div>
              </>
            )}

            <div className="formField">
              <label className="block text-gray-700 mb-1">Resume</label>

              {!isEditing && formData.resume ? (
                <a
                  href={formData.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 mt-2 block">
                  <b>Your Resume - [<span className=" underline text-sky-500">click here to view</span>]</b>
                </a>
              ) : (
                !formData.resume && (
                  <p className="text-red-500 font-semibold mt-2">
                    Please upload your resume
                  </p>
                )
              )}

              {isEditing && (
                <>
                  {formData.resume && !(formData.resume instanceof File) && (
                    <p className="mb-2">
                      <b>Your Resume - </b>
                      <a
                        href={formData.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500">
                        {formData.resume.split('/').pop()} [click here to view]
                      </a>
                    </p>
                  )}

                  <p className="text-sm p-2 ">Only JPG, PNG, and PDF files are allowed.</p>

                  <input
                    type="file"
                    name="resume"
                    onChange={handleFileChange}
                    className="formInput p-2 border rounded w-full"
                  />
                  {fileError && (
                    <p className="text-red-500 font-semibold mt-2">
                      {fileError}
                    </p>
                  )}
                </>
              )}
            </div>



            <div className="flex justify-between">
              {isEditing && (
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="mt-8 p-4">
        <h2 className="text-xl font-semibold">Applied Jobs</h2><br></br>
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {filteredJobs.map((data, i) => (
              <Card key={i} data={data} />
            ))}
          </div>
        ) : (
          <p>No applied jobs found.</p>
        )}
      </div>
    </div>
    </>
  );
}

export default Profile;
