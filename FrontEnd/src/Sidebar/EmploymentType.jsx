import React from 'react';
import InputField from '../components/InputField';
import { useMediaQuery } from 'react-responsive';

const EmploymentType = ({ handleChange }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <div className="bg-white rounded-lg p-2">
      <h4 className="text-lg font-medium mb-2">Type of employment</h4>
      {isMobile ? (
        <select onChange={handleChange} name="employmentType" className="form-select">
          <option value="" >Any</option>
          <option value="FullTime">Full Time</option>
          <option value="PartTime">Part Time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
          <option value="Remote">Remote</option>
        </select>
      ) : (
        <div>
          <label className="sidebar-label-container">
            <input onChange={handleChange} type="radio" value="" name="employmentType" />
            <span className="checkmark"></span>Any
          </label>
          <InputField
            handleChange={handleChange}
            value="FullTime"
            title="Full-time"
            name="employmentType"
          />
          
          <InputField
            handleChange={handleChange}
            value="PartTime"
            title="Part-time"
            name="employmentType"
          />
          <InputField
            handleChange={handleChange}
            value="Contract"
            title="Contract"
            name="employmentType"
          />
          <InputField
            handleChange={handleChange}
            value="Internship"
            title="Internship"
            name="employmentType"
          />
          <InputField
            handleChange={handleChange}
            value="Remote"
            title="Remote"
            name="employmentType"
          />
        </div>
      )}
    </div>
  );
};

export default EmploymentType;
