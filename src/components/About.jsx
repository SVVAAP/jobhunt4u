import React from 'react';

const About = () => {
  const stats = [
    { value: "6k", label: "daily active users" },
    { value: "1,000Plus", label: "open job positions" },
    { value: "9k", label: "Placement Served" }
  ];

  const jobCategories = [
    { name: "Fintech", positions: 2104 },
    { name: "Technical Support", positions: 6483 },
    { name: "Health and Care", positions: 0 },
    { name: "Automobile", positions: 0 },
    { name: "Edtech", positions: 1383 },
    { name: "E-Commerce", positions: 5182 },
    { name: "Real Estate", positions: 23 },
    { name: "Human Resource", positions: 425 },
    { name: "International Process", positions: 1737 },
    { name: "Domestic Process", positions: 6733 }
  ];

  const clients = [
    "First Advantage", "KGISL", "ExpertCallers", "Concentrix", "Accenture", "Teleperformance"
  ];

  const steps = [
    "Register an account to start",
    "Explore over thousands of resumes",
    "Find the most suitable candidate"
  ];

  const recruiterSteps = [
    "Register an account",
    "Create a new job listing",
    "Review and submit"
  ];

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          About Us
        </h2>
        <p className="mt-4 text-lg text-gray-500">
        Welcome to JobHunt4U! Discover your dream job with us – the top destination for reliable job listings and career opportunities in India.
        </p>
      </div>

      <div className="mt-10">
        <div className="flex flex-wrap justify-around text-center">
          {stats.map((stat, index) => (
            <div key={index} className="p-4">
              <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-lg text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-bold text-gray-900 text-center">Popular Job Categories</h3>
        <div className="flex flex-wrap justify-center mt-4">
          {jobCategories.map((category, index) => (
            <div key={index} className="p-4 text-center">
              <p className="text-lg font-semibold text-gray-900">{category.name}</p>
              <p className="text-sm text-gray-500">{category.positions} open positions</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-bold text-gray-900 text-center">Our Clients</h3>
        <div className="flex flex-wrap justify-center mt-4">
          {clients.map((client, index) => (
            <div key={index} className="p-4">
              <p className="text-lg text-gray-900">{client}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-bold text-gray-900 text-center">Find Jobs with 3 easy steps</h3>
        <div className="mt-4 text-center">
          <ol className="list-decimal list-inside">
            {steps.map((step, index) => (
              <li key={index} className="mt-2 text-lg text-gray-500">{step}</li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-bold text-gray-900 text-center">Are you an HR recruiter looking to post a job on our job portal?</h3>
        <div className="mt-4 text-center">
          <p className="text-lg text-gray-500 mb-4">Look no further! By registering on our platform, you can easily post job listings and reach a wide pool of qualified candidates.</p>
          <ol className="list-decimal list-inside">
            {recruiterSteps.map((step, index) => (
              <li key={index} className="mt-2 text-lg text-gray-500">{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default About;
