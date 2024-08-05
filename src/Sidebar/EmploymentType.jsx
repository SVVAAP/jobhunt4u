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
          <option value="full-time">Full-time</option>
          <option value="temporary">Temporary</option>
          <option value="part-time">Part-time</option>
        </select>
      ) : (
        <div>
          <label className="sidebar-label-container">
            <input onChange={handleChange} type="radio" value="" name="employmentType" />
            <span className="checkmark"></span>Any
          </label>
          <InputField
            handleChange={handleChange}
            value="full-time"
            title="Full-time"
            name="employmentType"
          />
          <InputField
            handleChange={handleChange}
            value="temporary"
            title="Temporary"
            name="employmentType"
          />
          <InputField
            handleChange={handleChange}
            value="part-time"
            title="Part-time"
            name="employmentType"
          />
        </div>
      )}
    </div>
  );
};

export default EmploymentType;
