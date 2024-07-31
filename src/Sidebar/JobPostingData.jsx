import React from "react";
import InputField from "../components/InputField";
import { useMediaQuery } from 'react-responsive';

const JobPostingData = ({ handleChange }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const now = new Date();
  const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);
  const SevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const ThirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

  const twentyFourHoursAgoDate = twentyFourHoursAgo.toISOString().slice(0, 10);
  const SevenDaysAgoDate = SevenDaysAgo.toISOString().slice(0, 10);
  const ThirtyDaysAgoDate = ThirtyDaysAgo.toISOString().slice(0, 10);

  return (
    <div className="bg-white rounded-lg">
      <h4 className="text-lg font-medium mb-2">Date of posting</h4>
      {isMobile ? (
        <select onChange={handleChange} name="test" className="form-select">
          <option value="">All time</option>
          <option value={twentyFourHoursAgoDate}>Last 24 hours</option>
          <option value={SevenDaysAgoDate}>Last 7 days</option>
          <option value={ThirtyDaysAgoDate}>Last Month</option>
        </select>
      ) : (
        <div>
          <label className="sidebar-label-container">
            <input onChange={handleChange} type="radio" value="" name="test" />
            <span className="checkmark"></span>All time
          </label>
          <InputField
            handleChange={handleChange}
            value={twentyFourHoursAgoDate}
            title="Last 24 hours"
            name="test"
          />
          <InputField
            handleChange={handleChange}
            value={SevenDaysAgoDate}
            title="Last 7 days"
            name="test"
          />
          <InputField
            handleChange={handleChange}
            value={ThirtyDaysAgoDate}
            title="Last Month"
            name="test"
          />
        </div>
      )}
    </div>
  );
};

export default JobPostingData;
