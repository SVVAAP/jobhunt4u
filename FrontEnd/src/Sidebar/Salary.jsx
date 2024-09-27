import React from "react";
import Button from "./Button";
import { useMediaQuery } from 'react-responsive';

const Salary = ({ handleChange, handleClick }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <div className="bg-white rounded-lg p-2">
      <h4 className="text-lg font-medium mb-2">Salary</h4>
      <div className="mb-2">
        <Button onClickHandler={handleClick} value="" title="All" />
        <Button onClickHandler={handleClick} value="Hourly" title="Hourly" />
        <Button onClickHandler={handleClick} value="Monthly" title="Monthly" />
        <Button onClickHandler={handleClick} value="Yearly" title="Yearly" />
      </div>

      {/* {isMobile ? (
        <select onChange={handleChange} name="test2" className="form-select">
          <option value="">Any</option>
          <option value={30}>&lt; 30000k</option>
          <option value={50}>&lt; 50000k</option>
          <option value={80}>&lt; 80000k</option>
          <option value={100}>&lt; 100000k</option>
        </select>
      ) : (
        <div>
          <label className="sidebar-label-container">
            <input onChange={handleChange} type="radio" value="" name="test2" />
            <span className="checkmark"></span>Any
          </label>

          <InputField
            handleChange={handleChange}
            value={30}
            title="< 30000k"
            name="test2"
          />

          <InputField
            handleChange={handleChange}
            value={50}
            title="< 50000k"
            name="test2"
          />

          <InputField
            handleChange={handleChange}
            value={80}
            title="< 80000k"
            name="test2"
          />

          <InputField
            handleChange={handleChange}
            value={100}
            title="< 100000k"
            name="test2"
          />
        </div>
      )} */}
    </div>
  );
};

export default Salary;
