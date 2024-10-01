import React from "react";
import a2z from "../assets/a2zpremiumdeals_logo.png";
import alphonsomatrimony from "../assets/alphonsomatrimony.png";
import Alphonsocyberservices from "../assets/alphonsoCyberService.png";

const companies = [
  {
    id: 1,
    name: "A2Z Premium Deals",
    logo: a2z,
    link: "https://a2zpremiumdeals.com",
    description: "Get Your Dream Home Now! Buy-Sell-Rent",
  },
  {
    id: 2,
    name: "Alphonso Cyber Services",
    logo: Alphonsocyberservices,
    link: "https://companyc.com",
    description: "We handle All the gov. paper works here ..",
  },
  {
    id: 3,
    name: "Alphonso Matrimony",
    logo: alphonsomatrimony,
    link: "https://alphonsomatrimony.com",
    description: "Bringing families together with trusted matrimonial services.",
  },
];

const CompanyCarousel = () => {
  return (
    <div className="w-full py-6 mt-5">
      <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
      <span className="animated-gradient-header"> Our Other </span>Services
      </h2>
      <div className="flex overflow-x-auto  space-x-6 py-4 scrollbar-hide justify-around">
        {companies.map((company) => (
          <a
            key={company.id}
            href={company.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-none transform transition-transform duration-300 hover:scale-105">
            <div className="flex flex-col items-center text-center shadow-sm p-2">
              <img
                src={company.logo}
                alt={company.name}
                className="h-16 object-cover rounded-lg mb-2"
              />
              <span className="text-sm font-semibold text-gray-700">
                {company.name}
              </span>
              <p className="text-xs text-gray-500 mt-1">{company.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default CompanyCarousel;
