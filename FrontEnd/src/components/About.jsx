import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CountUp from "react-countup";
import {
  AcademicCapIcon,
  ComputerDesktopIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  ShoppingCartIcon,
  HomeIcon,
  UserGroupIcon,
  GlobeAltIcon,
  GlobeAmericasIcon,
} from "@heroicons/react/24/outline";
import { useJobs } from "../context/jobsContext";

const About = () => {
  const [stats, setStats] = useState([
    { value: 6000, label: "daily active users" },
    { value: 1000, label: "open job positions" },
    { value: 9050, label: "Placement Served" },
  ]);

  useEffect(() => {
    // Randomly select values for daily active users and open job positions
    const dailyUsers = Math.floor(Math.random() * (7000 - 6000 + 1)) + 6000;
    const openPositions = Math.floor(Math.random() * (1100 - 1000 + 1)) + 1000;

    // Update the stats with the new values
    setStats((prevStats) => [
      { value: dailyUsers, label: "daily active users" },
      { value: openPositions, label: "open job positions" },
      { value: 9050, label: "Placement Served" },
    ]);
  }, []);
  const { aboutContent, contactInfo } = useJobs();
  
  const jobCategories = [
    { name: "Fintech", description: "Finance Tech", icon: <AcademicCapIcon className="w-6 h-6 text-gray-600" /> },
    {
      name: "Technical Support",
      description: "Tech Help",
      icon: <ComputerDesktopIcon className="w-6 h-6 text-gray-600" />,
    },
    { name: "Health and Care", description: "Medical Jobs", icon: <HeartIcon className="w-6 h-6 text-gray-600" /> },
    {
      name: "Automobile",
      description: "Car Industry",
      icon: <ChatBubbleLeftRightIcon className="w-6 h-6 text-gray-600" />,
    }, // Replace with an available icon
    { name: "Edtech", description: "Learning Tools", icon: <BookOpenIcon className="w-6 h-6 text-gray-600" /> },
    { name: "E-Commerce", description: "Online Sales", icon: <ShoppingCartIcon className="w-6 h-6 text-gray-600" /> },
    { name: "Real Estate", description: "Property Sales", icon: <HomeIcon className="w-6 h-6 text-gray-600" /> },
    { name: "Human Resource", description: "HR Management", icon: <UserGroupIcon className="w-6 h-6 text-gray-600" /> },
    {
      name: "International Process",
      description: "Global Business",
      icon: <GlobeAltIcon className="w-6 h-6 text-gray-600" />,
    },
    {
      name: "Domestic Process",
      description: "Local Operations",
      icon: <GlobeAmericasIcon className="w-6 h-6 text-gray-600" />,
    },
  ];

  const clients = ["First Advantage", "KGISL", "ExpertCallers", "Concentrix", "Accenture", "Teleperformance"];

  const recruiterSteps = ["Register an account", "Create a new job listing", "Review and submit"];

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8" id="about">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 sm:text-4xl">
          <span className="animated-gradient-header"> About</span> Us
        </h2>
        <p
          className="mt-4 text-lg text-justify p-4"
          dangerouslySetInnerHTML={{ __html: aboutContent.replace(/\n/g, "<br/>") }}
        ></p>
      </div>

      <div className="mt-10">
      <div className="flex flex-wrap justify-around text-center">
        {stats.map((stat, index) => (
          <div key={index} className="p-4">
            <p className="text-4xl font-bold animated-gradient">
              <CountUp start={0} end={stat.value} duration={25 } />+
            </p>
            <p className="text-lg text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>
      </div>

      <div className="mt-10 bg-gray-100 p-8 rounded-lg shadow-md" id="contact">
      <h3 className="text-3xl font-bold text-gray-900 text-center mb-4">
        <span className="animated-gradient-header">Contact Us</span> Now
      </h3>
      <div className="text-center mb-6">
        <p className="text-lg text-gray-700 mb-2">📞 Call Us:</p>
        <a href={`tel:${contactInfo.phone || ""}`}>
          <p className="text-xl font-semibold text-gray-900">{contactInfo.phone || ''}</p>
        </a>
      </div>
      <div className="text-center mb-6">
        <p className="text-lg text-gray-700 mb-2">📧 Send Your Resume To:</p>
        <a href={`mailto:${contactInfo.email || ''}`} className="text-xl font-semibold text-blue-600 hover:underline">
          {contactInfo.email || ''}
        </a>
      </div>
      <div className="text-center">
        <p className="text-lg text-gray-700 mb-2">📍 Visit Us At:</p>
        <p className="text-xl font-semibold text-gray-900">{contactInfo.address || ''}</p>
      </div>
    </div>

      <div className="mt-10">
        <h3 className="text-2xl font-bold text-gray-900 text-center">
          <span className="animated-gradient-header">Popular Job</span> Categories
        </h3>
        <div className="flex flex-wrap justify-center mt-4 ">
          {jobCategories.map((category, index) => (
            <div key={index} className="p-4 text-center shadow m-2 bg-sky-200 rounded-lg flex flex-col items-center">
              <div className="mb-2">{category.icon}</div>
              <p className="text-lg font-semibold text-gray-900">{category.name}</p>
              <p className="text-sm text-gray-500">{category.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* <div className="mt-10">
                <h3 className="text-2xl font-bold text-gray-900 text-center">Our Clients</h3>
                <div className="flex flex-wrap justify-center mt-4">
                    {clients.map((client, index) => (
                        <div key={index} className="p-4">
                            <p className="text-lg text-gray-900">{client}</p>
                        </div>
                    ))}
                </div>
            </div> */}

      <div className="mt-10 mb-10">
        <h3 className="text-2xl font-bold text-gray-900 text-center">
          Are you an <span className="animated-gradient-header"> HR recruiter</span> looking to post a job on our job
          portal?
        </h3>
        <div className="mt-4 text-center">
          <p className="text-lg text-gray-500 mb-4">
            Look no further! By registering on our platform, you can easily post job listings and reach a wide pool of
            qualified candidates.
          </p>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 text-center">
          <span className="animated-gradient-header">How It</span> Works
        </h3>
        <div className="flex items-center justify-center mt-8  p-6 rounded-lg shadow-md bg-white font-extrabold">
          {/* Step 1 */}
          <div className="flex flex-col items-center w-1/4">
            <div className="relative mb-4">
              <div className="w-16 h-16 mx-auto bg-green-300 rounded-full text-lg text-white flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/9428/9428917.png"
                  alt="Register an account"
                  className="w-12 h-12"
                />
              </div>
            </div>
            <div className="text-sm text-center md:text-base">Register an account</div>
          </div>

          <div className="w-12 flex items-center justify-center h-full">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center w-1/4">
            <div className="relative mb-4">
              <div
                className="absolute flex align-center items-center justify-center"
                style={{ width: "calc(100% - 2.5rem - 1rem)", top: "50%", transform: "translate(-50%, -50%)" }}>
                <div className="w-full bg-gray-200 rounded flex items-center justify-center">
                  <div className="w-0 bg-green-300 py-1 rounded" style={{ width: "100%" }}></div>
                </div>
              </div>
              <div className="w-16 h-16 mx-auto bg-green-300 rounded-full text-lg text-white flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/3456/3456420.png"
                  alt="Create a new job listing"
                  className="w-12 h-12"
                />
              </div>
            </div>
            <div className="text-sm text-center md:text-base">Create a new job listing</div>
          </div>

          <div className="w-12 flex items-center justify-center h-full">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center w-1/4">
            <div className="relative mb-4">
              <div className="w-16 h-16 mx-auto bg-green-300 rounded-full text-lg text-white flex items-center justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/128/2680/2680985.png"
                  alt="Review and submit"
                  className="w-12 h-12"
                />
              </div>
            </div>
            <div className="text-sm text-center md:text-base">Review and submit</div>
          </div>
        </div>
      </div>

      <div id="map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d992841.4544403215!2d74.6143328746088!3d13.579273629093242!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbcadd9041400a3%3A0xb7c8f19bc5d97a1d!2sJob%20Hunt%204%20U!5e0!3m2!1sen!2sin!4v1720962589516!5m2!1sen!2sin"
          width="100%"
          height="450"
          style={{ border: "0" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </div>
  );
};

export default About;
