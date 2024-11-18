import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';

function CompanyWeWorkWith() {
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    const logosRef = ref(database, 'logos');
    onValue(logosRef, (snapshot) => {
      const logosData = snapshot.val();
      if (logosData) {
        const approvedLogos = Object.keys(logosData)
          .filter(key => logosData[key].approved)
          .map(key => ({ id: key, ...logosData[key] }));
        setLogos(approvedLogos);
      }
    });
  }, []);

  return (
    <div className="relative overflow-hidden bg-white py-4">

      {/* Fade effect on edges */}
      <div className="absolute inset-y-0 left-0 w-1/12 bg-gradient-to-r from-white" />
      <div className="absolute inset-y-0 right-0 w-1/12 bg-gradient-to-l from-white" />
      <h2 className="text-3xl font-extrabold text-gray-900 sm:text-3xl text-center mb-3">
          <span className="animated-gradient-header"> Featured </span> Companies
        </h2>
      {/* Scrolling logo container */}
      <div className="flex justify-center items-center whitespace-nowrap">
        <div className="flex animate-marquee space-x-8">
          {/* Render two copies of logos for seamless looping */}
          {[...logos].map((logo, index) => (
            <img
              key={`${logo.id}-${index}`}
              src={logo.logoUrl}
              alt={`Logo of ${logo.id}`}
              className="w-24 h-24 object-contain"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CompanyWeWorkWith;
