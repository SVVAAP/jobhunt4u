import React from "react";
import InputField from "../components/InputField";
import { useMediaQuery } from 'react-responsive';

const JobPostingData = ({ handleChange }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const now = new Date();
  const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

  const twentyFourHoursAgoDate = twentyFourHoursAgo.toISOString();
  const sevenDaysAgoDate = sevenDaysAgo.toISOString();
  const thirtyDaysAgoDate = thirtyDaysAgo.toISOString();

  return (
    <div className="bg-white rounded-lg p-2">
      <h4 className="text-lg font-medium mb-2">Date of posting</h4>
      {isMobile ? (
        <select onChange={handleChange} name="postingDate" className="form-select">
          <option value="">All time</option>
          <option value={twentyFourHoursAgoDate}>Last 24 hours</option>
          <option value={sevenDaysAgoDate}>Last 7 days</option>
          <option value={thirtyDaysAgoDate}>Last Month</option>
        </select>
      ) : (
        <div>
          <label className="sidebar-label-container">
            <input onChange={handleChange} type="radio" value="" name="postingDate" />
            <span className="checkmark"></span>All time
          </label>
          <InputField
            handleChange={handleChange}
            value={twentyFourHoursAgoDate}
            title="Last 24 hours"
            name="postingDate"
          />
          <InputField
            handleChange={handleChange}
            value={sevenDaysAgoDate}
            title="Last 7 days"
            name="postingDate"
          />
          <InputField
            handleChange={handleChange}
            value={thirtyDaysAgoDate}
            title="Last Month"
            name="postingDate"
          />
        </div>
      )}
    </div>
  );
};

export default JobPostingData;
