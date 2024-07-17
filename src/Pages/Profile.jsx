import React, { useEffect, useState } from 'react';
import { useJobs } from '../context/jobsContext';
import { signOut } from 'firebase/auth';
import { auth, database, storage, ref, set, onValue, storageRef, uploadBytes, getDownloadURL } from '../firebase';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { HiPencil } from 'react-icons/hi';
import { useRef } from 'react';

function Profile() {
  const { user, jobs ,isLoading } = useJobs();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    workStatus: '',
    yearsOfExperience: '',
    companyNames: '',
    resume: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        workStatus: user.workStatus || '',
        yearsOfExperience: user.yearsOfExperience || '',
        companyNames: user.companyNames || '',
        resume: user.resumeUrl || '',
      });
      const appliedJobs = user.appliedJobs || [];
      setFilteredJobs(jobs.filter((job) => appliedJobs.includes(job.id)));
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      resume: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (user) {
        let resumeUrl = formData.resume instanceof File ? await uploadResume(formData.resume) : formData.resume;

        await set(ref(database, `users/${auth.currentUser.uid}`), {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          workStatus: formData.workStatus,
          yearsOfExperience: formData.yearsOfExperience,
          companyNames: formData.companyNames,
          resumeUrl: resumeUrl, // Update resume URL if file is uploaded
          appliedJobs: user.appliedJobs,
          userType: user.userType,
        });

        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating user details: ', error);
      setError('Failed to update user details.');
    }
    setIsLoading(false);
  };

  const uploadResume = async (file) => {
    try {
      const resumeRef = storageRef(storage, `resumes/${auth.currentUser.uid}/${file.name}`);
      await uploadBytes(resumeRef, file);
      const downloadURL = await getDownloadURL(resumeRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading resume: ', error);
      setError('Failed to upload resume.');
      return '';
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* {error && <div className="text-red-500 mb-4">{error}</div>} */}
      <div className="relative bg-white shadow-md rounded-lg p-4">
        {!isEditing && (
          <HiPencil
            onClick={handleEditClick}
            className="absolute top-4 right-4 text-blue-500 cursor-pointer text-xl"
          />
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-2xl font-bold mb-4">Welcome, {formData.name}!</h1>
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
          <p className="text-lg mb-4">
            Search & apply to jobs from India&apos;s No.1 Job Site
          </p>
          <div className="bg-gray-100 p-4 rounded-lg space-y-4">
            <div className="formField">
              <label className="block text-gray-700 mb-1">Full name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
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
                value={formData.email}
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
                value={formData.phone}
                onChange={handleChange}
                className={`formInput p-2 border rounded w-full ${!isEditing ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                disabled={!isEditing}
              />
            </div>

            <div className="formField">
              <label className="block text-gray-700 mb-1">Work Status</label>
              <select
                name="workStatus"
                value={formData.workStatus}
                onChange={handleChange}
                className={`formInput p-2 border rounded w-full ${!isEditing ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                disabled={!isEditing}
              >
                <option value="fresher">I&apos;m a Fresher</option>
                <option value="experienced">I&apos;m Experienced</option>
              </select>
            </div>

            {formData.workStatus === 'experienced' && (
              <>
                <div className="formField">
                  <label className="block text-gray-700 mb-1">Years of Experience</label>
                  <input
                    type="text"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    className={`formInput p-2 border rounded w-full ${!isEditing ? 'bg-gray-200 cursor-not-allowed' : ''}`}
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
                    className={`formInput p-2 border rounded w-full ${!isEditing ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                    disabled={!isEditing}
                  />
                </div>
              </>
            )}

<div className="formField">
              <label className="block text-gray-700 mb-1">Resume</label>
              {!isEditing && formData.resume && (
                 <a
                 href={formData.resume}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-blue-500 mt-2 block"
               >
                <b>Your Resume - click here to view</b>
                </a>
              )}
              {isEditing && (
                <input
                  type="file"
                  name="resume"
                  onChange={handleFileChange}
                  className="formInput p-2 border rounded w-full"
                />
              )}
              {/* {formData.resume && (
               
                  <b>Your Resume - click here to view</b>
            
              )} */}
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
      </div>

      {/* Applied Jobs Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Applied Jobs</h2>
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
  );
}

export default Profile;
