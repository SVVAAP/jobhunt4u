import React, { useEffect, useState } from "react";
import Cookies from "js-cookie"; // Import the js-cookie library
import { useJobs } from "../context/jobsContext";
import { signOut } from "firebase/auth";
import { auth, database, storage, ref, set, onValue, storageRef, uploadBytes, getDownloadURL } from "../firebase";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card2";
import { HiPencil, HiDotsVertical } from "react-icons/hi";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";

function Profile() {
  const { user, jobs, isLoading, isLoggedIn } = useJobs();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [profileData, setProfileData] = useState({
    companyName: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    logoUrl: "", // Add logo URL to profile data
  });
  const [postedJobs, setPostedJobs] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [logoFile, setLogoFile] = useState(null); // State to hold selected logo file

  useEffect(() => {
    if (user) {
      setProfileData({
        companyName: user.companyName || "",
        email: user.email || "",
        phone: user.phone || "",
        website: user.website || "",
        address: user.address || "",
        logoUrl: user.logoUrl || "", // Load logo URL if available
        userType: user.userType || "",
        name: user.name || "",
      });

      // Fetch jobs posted by the employer
      const postedJobs = jobs.filter((job) => job.postedBy === user.email);
      setPostedJobs(postedJobs);

      // Check if the success message cookie is set
      const messageShown = Cookies.get("accountCreatedMessageShown");
      if (!messageShown) {
        setShowSuccessMessage(true);
        // Set a cookie so the message is not shown again
        Cookies.set("accountCreatedMessageShown", "true", { expires: 365 }); // Cookie expires in 1 year
      }
    }
  }, [user, jobs]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (file) {
      if (!allowedTypes.includes(file.type)) {
        setFileError("Invalid file type. Only JPG, PNG, and PDF files are allowed.");
        e.target.value = null;
        return;
      }

      if (file.size > maxSize) {
        setFileError("File size exceeds 2MB. Please upload a smaller file.");
        e.target.value = null;
        return;
      }

      setFileError(null);
      setLogoFile(file); // Set logo file here
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to the home page after logout
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const uploadLogo = async () => {
    if (!logoFile) return null;

    const logoStorageRef = storageRef(storage, `companyLogos/${profileData.companyName}-${logoFile.name}`);
    await uploadBytes(logoStorageRef, logoFile);
    return await getDownloadURL(logoStorageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (auth.currentUser) {
        let logoUrl = profileData.logoUrl;

        if (logoFile) {
          logoUrl = await uploadLogo();
        }

        const updatedProfileData = {
          ...profileData,
          logoUrl: logoUrl || "",
        };

        await set(ref(database, `users/${auth.currentUser.uid}`), updatedProfileData);

        await set(ref(database, `logos/${profileData.companyName}`), { logoUrl, approved: false });

        setProfileData(updatedProfileData);
        setIsEditing(false);
        setLogoFile(null);
      }
    } catch (error) {
      console.error('Error updating user details: ', error);
      setError('Failed to update user details.');
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  if (isLoading) {
    return <Loading/>;
  } else if (!isLoggedIn) {
    return <div>Not logged in</div>;
  }

  return (
    <>
      <Navbar />
      <div className="w-screen h-full p-4 px-8 ">
        <div className="container flex justify-between content-center text-center m-auto p-4">
          <button
            className="flex items-center px-2 mx-4 bg-slate-100/80 transition-transform hover:scale-105 text-red-600 ring-1 ring-red-600 rounded-md font-extrabold hover:bg-red-600 hover:text-white focus:outline-none"
            onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left-long mr-2"></i>
            Back
          </button>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
        <div className="relative bg-white shadow-md rounded-lg p-4">
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <button onClick={toggleDropdown} className={`text-blue-500 cursor-pointer text-2xl mr-4`}>
              <i
                className={`fa-solid fa-sort-down transition-transform duration-500 ${
                  showDropdown ? "rotate-180" : ""
                }`}></i>
            </button>
          </div>

          <h1 className="text-2xl font-bold mb-4">Welcome, {profileData.companyName}!</h1>
          <p className="text-lg mb-4">Manage your job postings and company profile here.</p>

          {showDropdown && (
            <form onSubmit={handleSubmit} className="space-y-4 m-4">
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

              <div className="bg-gray-100 p-4 rounded-lg space-y-4">
                {!isEditing && (
                  <div className="flex justify-between shadow-sm">
                    <p className="ml-2 font-semibold">Employer Profile </p>
                    <HiPencil
                      onClick={handleEditClick}
                      className="top-4 right-2 text-blue-500 cursor-pointer text-xl"
                    />
                  </div>
                )}
                <div className="formField">
                  <label className="block text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={profileData.companyName}
                    onChange={handleChange}
                    className={`formInput p-2 border rounded w-full ${
                      !isEditing ? "bg-gray-200 cursor-not-allowed" : ""
                    }`}
                    disabled={!isEditing}
                  />
                </div>

                <div className="formField">
                  <label className="block text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    className={`formInput p-2 border rounded w-full ${
                      !isEditing ? "bg-gray-200 cursor-not-allowed" : ""
                    }`}
                    disabled={!isEditing}
                  />
                </div>

                <div className="formField">
                  <label className="block text-gray-700 mb-1">Mobile number</label>
                  <input
                    type="text"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    className={`formInput p-2 border rounded w-full ${
                      !isEditing ? "bg-gray-200 cursor-not-allowed" : ""
                    }`}
                    disabled={!isEditing}
                  />
                </div>

                <div className="formField">
                  <label className="block text-gray-700 mb-1">Website</label>
                  <input
                    type="text"
                    name="website"
                    value={profileData.website}
                    onChange={handleChange}
                    className={`formInput p-2 border rounded w-full ${
                      !isEditing ? "bg-gray-200 cursor-not-allowed" : ""
                    }`}
                    disabled={!isEditing}
                  />
                </div>

                <div className="formField">
                  <label className="block text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleChange}
                    className={`formInput p-2 border rounded w-full ${
                      !isEditing ? "bg-gray-200 cursor-not-allowed" : ""
                    }`}
                    disabled={!isEditing}
                  />
                </div>

                {/* <div className="formField">
                  <label className="block text-gray-700 mb-1">Upload Logo</label>
                  <input
                    type="file"
                    onChange={handleLogoChange}
                    className="formInput p-2 border rounded w-full"
                    disabled={!isEditing}
                  />
                </div> */}

                <div className="formField">
                  <label className="block text-gray-700 mb-1">Upload Logo</label>
                  {isEditing ? (
                    <>
                      <p className="text-sm p-2">Only JPG, PNG, and PDF files are allowed.</p>
                      <input
                        type="file"
                        name="logo"
                        onChange={handleFileChange}
                        className="formInput p-2 border rounded w-full"
                      />
                      {fileError && <p className="text-red-500 font-semibold mt-2">{fileError}</p>}
                    </>
                  ) : profileData.logoUrl ? (
                    <a
                      href={profileData.logoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 mt-2 block">
                      <b>Your Company Logo - [click here to view]</b>
                    </a>
                  ) : (
                    <p className="text-red-500 font-semibold mt-2">Please upload your Company Logo</p>
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
          )}

          {!isEditing && (
            <a href="mailto:CustomerCare@jobhunt4u.in?subject=Support Request By Employer&body=Hello,%0D%0AI need assistance with...">
              Contact Admin - CustomerCare@jobhunt4u.in
            </a>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold">Your Posted Jobs</h2>
          {postedJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {postedJobs.map((data, i) => (
                <Card key={i} data={data} />
              ))}
            </div>
          ) : (
            <p>No posted jobs found.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;
