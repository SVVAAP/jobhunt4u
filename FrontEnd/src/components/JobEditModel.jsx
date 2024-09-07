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
          <h5 className="text-lg font-medium" id="exampleModalLabel">Edit Job</h5>
          <button type="button" className="text-gray-400 hover:text-gray-600" aria-label="Close" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSave}>
          <div className="px-5 py-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="mb-3">
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Job Title</label>
              <input
                type="text"
                name="jobTitle"
                id="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                className="m-1 p-1 block w-full border-gray-300 rounded-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
              <input
                type="text"
                name="companyName"
                id="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="m-1 p-1 block w-full border-gray-300 rounded-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="jobLocation" className="block text-sm font-medium text-gray-700">Job Location</label>
              <input
                type="text"
                name="jobLocation"
                id="jobLocation"
                value={formData.jobLocation}
                onChange={handleChange}
                className="m-1 p-1 block w-full border-gray-300 rounded-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700">Employment Type</label>
              <input
                type="text"
                name="employmentType"
                id="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="m-1 p-1 block w-full border-gray-300 rounded-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">Min Price</label>
              <input
                type="number"
                name="minPrice"
                id="minPrice"
                value={formData.minPrice}
                onChange={handleChange}
                className="m-1 p-1 block w-full border-gray-300 rounded-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">Max Price</label>
              <input
                type="number"
                name="maxPrice"
                id="maxPrice"
                value={formData.maxPrice}
                onChange={handleChange}
                className="m-1 p-1 block w-full border-gray-300 rounded-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="postingDate" className="block text-sm font-medium text-gray-700">Posting Date</label>
              <input
                type="text"
                name="postingDate"
                id="postingDate"
                value={formData.postingDate}
                onChange={handleChange}
                className="m-1 p-1 block w-full border-gray-300 rounded-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                className="m-1 p-1 block w-full border-gray-300 rounded-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                rows="4"
              />
            </div>
          </div>
          <div className="flex justify-between px-5 py-3 border-t border-gray-200">
            <button type="button" className="btn btn-secondary mr-2" onClick={onClose}>Close</button>
            <button type="submit" className="btn btn-primary">Save changes</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  
  );
};

export default JobEditModal;
