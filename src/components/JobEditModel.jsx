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
    <div className="modal fade show" style={{ display: 'block' }} aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
        <div className="modal-content bg-slate-200">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Edit Job</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSave}>
            <div className="modal-body" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
              <div className="mb-3">
                <label htmlFor="jobTitle" className="form-label">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="companyName" className="form-label">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="jobLocation" className="form-label">Job Location</label>
                <input
                  type="text"
                  name="jobLocation"
                  id="jobLocation"
                  value={formData.jobLocation}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="employmentType" className="form-label">Employment Type</label>
                <input
                  type="text"
                  name="employmentType"
                  id="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="minPrice" className="form-label">Min Price</label>
                <input
                  type="number"
                  name="minPrice"
                  id="minPrice"
                  value={formData.minPrice}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="maxPrice" className="form-label">Max Price</label>
                <input
                  type="number"
                  name="maxPrice"
                  id="maxPrice"
                  value={formData.maxPrice}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="postingDate" className="form-label">Posting Date</label>
                <input
                  type="text"
                  name="postingDate"
                  id="postingDate"
                  value={formData.postingDate}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control"
                  rows="4"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
              <button type="submit" className="btn btn-primary">Save changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobEditModal;
