import React, { useState } from "react";
import { FiMapPin, FiSearch } from "react-icons/fi";
import logo from "../assets/svvaap_logo.png"
import { useJobs } from "../context/jobsContext";
import { Link } from "react-router-dom";

const FootSection = () => {
    const {user} =useJobs();

  return (
    <>
    
<div>
<footer className="bg-black rounded-lg shadow m-6 dark:bg-gray-800">
    <div className="w-full mx-auto max-w-screen-xl text-center p-2 px-6 md:flex md:items-center md:justify-between">
      <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="/" className="hover:underline">JobHunt4U</a>. All Rights Reserved.
    </span>
    <div className="flex space-x-1 justify-center items-center">
    <img src={logo} className="h-8 invert"  /><a className="text-sm text-gray-500 sm:text-center dark:text-gray-400" href="http://svvaap.in">Developed by <span className="text-white font-roboto">SVVAAP PVT. LTD.</span> </a>
    </div>
    <ul className="flex flex-wrap justify-center items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
        <li>
            <a href="#about" className="hover:underline me-4 md:me-6">About</a>
        </li>
        <li>
            <a href="#search" className="hover:underline me-4 md:me-6">Find Jobs</a>
        </li>
        {user ?
        <li>
            <Link to="/profile" className="hover:underline me-4 md:me-6">Profile</Link>
           
        </li> :
        <li>
         <Link href="/login" className="hover:underline me-4 md:me-6">Login</Link>
    </li>

         }
        <li>
            <a href="#conatct" className="hover:underline">Contact</a>
        </li>
    </ul>
    </div>
</footer>
</div>
  </>
  );
};

export default FootSection;
