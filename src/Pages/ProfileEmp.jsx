import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie'; // Import the js-cookie library
import { useJobs } from '../context/jobsContext';
import { signOut } from 'firebase/auth';
import { auth, database, storage, ref, set, onValue, storageRef, uploadBytes, getDownloadURL } from '../firebase';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { HiPencil } from 'react-icons/hi';

function Profile() {
  const { user, jobs, isLoading } = useJobs();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    companyName: '',
    email: '',
    phone: '',
    website: '',
    address: '',
  });
  const [postedJobs, setPostedJobs] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        companyName: user.companyName || '',
        email: user.email || '',
        phone: user.phone || '',
        website: user.website || '',
        address: user.address || '',
      });

      // Fetch jobs posted by the employer
      const postedJobs = jobs.filter(job => job.postedBy === user.email);
      setPostedJobs(postedJobs);

      // Check if the success message cookie is set
      const messageShown = Cookies.get('accountCreatedMessageShown');
      if (!messageShown) {
        setShowSuccessMessage(true);
        // Set a cookie so the message is not shown again
        Cookies.set('accountCreatedMessageShown', 'true', { expires: 365 }); // Cookie expires in 1 year
      }
    }
  }, [user, jobs]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirect to the home page after logout
    } catch (error) {
      console.error('Error signing out: ', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (user) {
        await set(ref(database, `users/${auth.currentUser.uid}`), {
          companyName: profileData.companyName,
          email: profileData.email,
          phone: profileData.phone,
          website: profileData.website,
          address: profileData.address,
        });

        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating user details: ', error);
      setError('Failed to update user details.');
    }
  };

  const handleContactAdmin = () => {
    // Implement the functionality to contact the admin (e.g., open a contact form or send an email)
    alert("Contact Admin functionality not yet implemented.");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="relative bg-white shadow-md rounded-lg p-4">
        {!isEditing && (
          <HiPencil
            onClick={handleEditClick}
            className="absolute top-4 right-4 text-blue-500 cursor-pointer text-xl"
          />
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-2xl font-bold mb-4">Welcome, {profileData.companyName}!</h1>
          {showSuccessMessage && (
            <div className="bg-green-100 p-4 rounded-lg mb-4 flex items-center">
              <img
                src="//static.naukimg.com/s/7/104/assets/images/green-tick.49de0665.svg"
                alt="Success"
                className="w-8 h-8 mr-2"
              />
              <span className="text-green-700 text-lg font-medium">
                Your account is created successfully.
              </span>
              <span className="text-gray-700 ml-2">Let’s get started!</span>
            </div>
          )}
          <p className="text-lg mb-4">
            Manage your job postings and company profile here.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg space-y-4">
            <div className="formField">
              <label className="block text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={profileData.companyName}
                onChange={handleChange}
                className={`formInput p-2 border rounded w-full ${!isEditing ? 'bg-gray-200 cursor-not-allowed' : ''}`}
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
                className={`formInput p-2 border rounded w-full ${!isEditing ? 'bg-gray-200 cursor-not-allowed' : ''}`}
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
                className={`formInput p-2 border rounded w-full ${!isEditing ? 'bg-gray-200 cursor-not-allowed' : ''}`}
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
                className={`formInput p-2 border rounded w-full ${!isEditing ? 'bg-gray-200 cursor-not-allowed' : ''}`}
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
                className={`formInput p-2 border rounded w-full ${!isEditing ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                disabled={!isEditing}
              />
            </div>

            <div className="flex justify-between">
              {isEditing && (
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Logout Button */}
        {!isEditing && (
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        )}

        {/* Contact Admin Button */}
        {!isEditing && (
          <button
            onClick={handleContactAdmin}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Contact Admin
          </button>
        )}
      </div>

      {/* Posted Jobs Section */}
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
  );
}

export default Profile;
