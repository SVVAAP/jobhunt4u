// components/JobEditModal.js
import React, { useState, useEffect } from 'react';
import { ref, update } from 'firebase/database';
import { database } from '../firebase';
import { useJobs } from '../context/jobsContext';
import CreatableSelect from 'react-select/creatable';


const JobEditModal = ({ job, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({});
  const { categoryList } = useJobs();
  const [selectedSkills, setSelectedSkills] = useState(
    job.skills ? job.skills.map(skill => ({ label: skill, value: skill })) : []
  );
  

  // Initialize formData with default values if job is provided
  useEffect(() => {
    if (job) {
      setFormData({
        jobID:job.jobID || '',
        jobTitle: job.jobTitle || '',
        companyName: job.companyName || '',
        minPrice: job.minPrice || '',
        maxPrice: job.maxPrice || '',
        salaryType: job.salaryType || '',
        jobLocation: job.jobLocation || '',
        experienceLevel: job.experienceLevel || '',
        skills: job.skills || '',
        employmentType: job.employmentType || '',
        jobCategory: job.jobCategory || '',
        jobType: job.jobType || '',
        workMode: job.workMode || '',
        description: job.description || '',
      });
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillsChange = (selectedOptions) => {
    setSelectedSkills(selectedOptions || []);
    setFormData((prev) => ({
      ...prev,
      skills: selectedOptions ? selectedOptions.map(option => option.value) : [],
    }));
  };
  

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (job && job.id) {
        await update(ref(database, `jobs/${job.id}`), formData);
        onSave();
      } else {
        console.error('Job ID is missing');
      }
    } catch (error) {
      console.error('Error updating job:', error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="relative w-full max-w-2xl mx-auto bg-slate-200 rounded-lg shadow-lg">
          <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200">
            <h5 className="text-lg font-medium">Edit Job</h5>
            <button type="button" className="text-gray-400 hover:text-gray-600" onClick={onClose}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSave}>
            <div className="px-5 py-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Job Title */}
              <div className="mb-3">
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="m-1 p-1 block w-full border-gray-300 rounded-sm shadow-sm"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Job ID</label>
                <input
                  type="text"
                  name="jobID"
                  id="jobID"
                  value={formData.jobID}
                  onChange={handleChange}
                  className="m-1 p-1 block w-full border-gray-300 rounded-sm shadow-sm"
                />
              </div>

              {/* Company Name */}
              <div className="mb-3">
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="m-1 p-1 block w-full border-gray-300 rounded-sm shadow-sm"
                />
              </div>

              {/* Minimum Salary */}
              <div className="mb-3">
                <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">Minimum Salary</label>
                <input
                  type="text"
                  name="minPrice"
                  id="minPrice"
                  value={formData.minPrice}
                  onChange={handleChange}
                  className="m-1 p-1 block w-full border-gray-300 rounded-sm shadow-sm"
                />
              </div>

              {/* Maximum Salary */}
              <div className="mb-3">
                <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">Maximum Salary</label>
                <input
                  type="text"
                  name="maxPrice"
                  id="maxPrice"
                  value={formData.maxPrice}
                  onChange={handleChange}
                  className="m-1 p-1 block w-full border-gray-300 rounded-sm shadow-sm"
                />
              </div>

              {/* Salary Type */}
              <div className="mb-3">
                <label htmlFor="salaryType" className="block text-sm font-medium text-gray-700">Salary Type</label>
                <select
                  name="salaryType"
                  id="salaryType"
                  value={formData.salaryType}
                  onChange={handleChange}
                  className="m-1 p-1 block w-full border-gray-300 rounded-sm shadow-sm"
                >
                  <option value="">Choose salary type</option>
                  <option value="Hourly">Hourly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>

              {/* Job Location */}
              <div className="mb-3">
                <label htmlFor="jobLocation" className="block text-sm font-medium text-gray-700">Job Location</label>
                <input
                  type="text"
                  name="jobLocation"
                  id="jobLocation"
                  value={formData.jobLocation}
                  onChange={handleChange}
                  className="m-1 p-1 block w-full border-gray-300 rounded-sm shadow-sm"
                />
              </div>

              {/* Experience Level */}
              <div className="mb-3">
                <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700">Experience Level</label>
                <select
                  name="experienceLevel"
                  id="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="m-1 p-1 block w-full border-gray-300 rounded-sm shadow-sm"
                >
                  <option value="">Choose experience level</option>
                  <option value="NoExperience">No Experience / Fresher</option>
                  <option value="Internship">Internship</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="MoreThan5Years">More than 5 years</option>
                </select>
              </div>

              {/* Job Category */}
              <div className="mb-3">
                <label htmlFor="jobCategory" className="block text-sm font-medium text-gray-700">Job Category</label>
                <select
                  name="jobCategory"
                  id="jobCategory"
                  value={formData.jobCategory}
                  onChange={handleChange}
                  className="m-1 p-1 block w-full border-gray-300 rounded-sm shadow-sm"
                >
                  <option value="">Choose job category</option>
                  {categoryList && categoryList.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* required skillset */}
              <div className="mb-3">
                <label className="block mb-2 text-sm font-medium text-gray-700">Required Skills</label>
                <CreatableSelect
                  isMulti
                  value={selectedSkills}
                  onChange={handleSkillsChange}
                  options={selectedSkills}
                  className="m-1 block w-full border-gray-300 rounded-sm shadow-sm"
                />
              </div>


              {/* Job Description */}
              <div className="mb-3">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Job Description</label>
                <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="m-1 p-1 block w-full border-gray-300 rounded-sm shadow-sm"
                  rows="4"
                ></textarea>
              </div>
            </div>

            <div className="px-5 py-3 bg-gray-100 text-right">
              <button
                type="button"
                className="px-4 py-2 mr-2 text-sm text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm text-white bg-sky-600 rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobEditModal;
