// components/JobEditModal.js
import React, { useState } from 'react';
import { ref, update } from 'firebase/database';
import { database } from '../firebase';

const JobEditModal = ({ job, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...job });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await update(ref(database, `jobs/${job.id}`), formData);
      onSave();
    } catch (error) {
      console.error('Error updating job:', error);
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

              {/* Required Skills Set */}
              <div className="mb-3">
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Required Skills Set</label>
                <input
                  type="text"
                  name="skills"
                  id="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="m-1 p-1 block w-full border-gray-300 rounded-sm shadow-sm"
                />
              </div>

              {/* Employment Type */}
              <div className="mb-3">
                <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700">Employment Type</label>
                <select
                  name="employmentType"
                  id="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="m-1 p-1 block w-full border-gray-300 rounded-sm shadow-sm"
                >
                  <option value="">Choose employment type</option>
                  <option value="FullTime">Full Time</option>
                  <option value="PartTime">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
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
                  <option value="Accounting/Finance">Accounting/Finance</option>
                  <option value="IT/Software">IT/Software</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>

              {/* Job Type */}
              <div className="mb-3">
                <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">Job Type</label>
                <select
                  name="jobType"
                  id="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="m-1 p-1 block w-full border-gray-300 rounded-sm shadow-sm"
                >
                  <option value="">Choose job type</option>
                  <option value="National">National</option>
                  <option value="International">International</option>
                </select>
              </div>

              {/* Work Mode */}
              <div className="mb-3">
                <label htmlFor="workMode" className="block text-sm font-medium text-gray-700">Work Mode</label>
                <select
                  name="workMode"
                  id="workMode"
                  value={formData.workMode}
                  onChange={handleChange}
                  className="m-1 p-1 block w-full border-gray-300 rounded-sm shadow-sm"
                >
                  <option value="">Choose work mode</option>
                  <option value="Remote">Remote</option>
                  <option value="OnSite">On-Site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              {/* Job Description */}
              <div className="mb-3">
                <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">Job Description</label>
                <textarea
                  name="jobDescription"
                  id="jobDescription"
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
                className="px-4 py-2 text-sm text-white bg-blue rounded hover:bg-blue"
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
