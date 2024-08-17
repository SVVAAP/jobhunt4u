import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";
import Card from "../components/Card";
import { useJobs } from "../context/jobsContext";

const Home_Emp = () => {
    const { jobs, user ,isLoading } = useJobs();
  const userJobs = jobs?.filter(data => data.postedBy === user.email);

  

  return (
    <>
      <>
      {/* <div className="bg-sky-800 p-4 rounded-2xl mb-6">
          <h2 className="text-2xl font-bold text-white">Employer Dashboard</h2>
          <p className="text-white">Manage your jobs and view statistics here.</p>
        </div> */}
      <div className="max-w-screen-2xl container mx-auto xl:px-24 md:py-20 py-14 px-4">
        <h1 className="text-5xl font-bold text-primary mb-3">
          Empower Your Business with the <span className="text-blue">Best Talent</span>
        </h1>
        <p className="text-lg text-black/70 mb-8">
          Post jobs, manage applications, and find the perfect candidates to drive your company forward.
        </p>

        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
          Hire the best with <span className="text-blue">JobHunt4U</span>
        </h1>
        <p className="text-lg font-normal text-gray-500 lg:text-xl">
          Join thousands of companies that trust us to help them build their teams and grow their businesses.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
          <a
            href="#post-job"
            className="rounded-md bg-blue px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Post a Job
          </a>
          <a href="#learn-more" className="text-sm font-semibold leading-6 text-black">
            Learn more <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
      <div className="flex flex-wrap justify-center">
        <h1
          id="manage-jobs"
          className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-black md:text-5xl lg:text-6xl"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400 animated-gradient-header">
            Manage
          </span>{" "}
          Your Jobs.
        </h1>
      </div>
    </>
    <div className="flex">
      {/* Sidebar */}
      <div className="p-20"> <Sidebar />
</div>
     
      {/* Main Content */}
      <div className="flex-1 p-6">

        <div className="bg-white p-4 rounded-2xl">
          <h3 className="text-xl font-semibold mb-4">Your Uploaded Jobs</h3>
          {isLoading ? (
            <p>Loading jobs...</p>
          ) : userJobs.length > 0 ? (
            userJobs.map((job, index) => <Card key={index} data={job} />)
          ) : (
            <p>No jobs uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Home_Emp;
