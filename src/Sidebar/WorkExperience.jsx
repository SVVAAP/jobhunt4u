import React from 'react';
import InputField from '../components/InputField';
import { useMediaQuery } from 'react-responsive';

const WorkExperience = ({ handleChange }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <div>
      <h4 className="text-lg font-medium mb-2">Work experience</h4>
      {isMobile ? (
        <select onChange={handleChange} name="test" className="form-select">
          <option value="">Any experience</option>
          <option value="NoExperience">No Experience / Fresher</option>
          <option value="Internship">Internship</option>
          <option value="1-2 years">1-2 years</option>
          <option value="3-5 years">3-5 years</option>
          <option value="MoreThan5Years">More Than 5 years</option>
        </select>
      ) : (
        <div>
          <label className="sidebar-label-container">
            <input onChange={handleChange} type="radio" value="" name="test" />
            <span className="checkmark"></span>Any experience
          </label>
          <InputField
            handleChange={handleChange}
            value="NoExperience"
            title="No Experience / Fresher"
            name="test"
          />
          <InputField
            handleChange={handleChange}
            value="Internship"
            title="Internship"
            name="test"
          />
          <InputField
            handleChange={handleChange}
            value="1-2 years"
            title="1-2 years"
            name="test"
          />
          <InputField
            handleChange={handleChange}
            value="3-5 years"
            title="3-5 years"
            name="test"
          />
          <InputField
            handleChange={handleChange}
            value="MoreThan5Years"
            title="More Than 5 years"
            name="test"
          />
        </div>
      )}
    </div>
  );
};

export default WorkExperience;
