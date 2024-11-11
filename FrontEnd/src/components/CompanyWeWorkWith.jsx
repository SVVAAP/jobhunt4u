import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';

const CompanyWeWorkWith = () => {
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
    <div className="relative font-inter antialiased bg-white py-10 bg-opacity-50">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        <span className="animated-gradient-header"> Featured</span> Companies
      </h2>
      <div className="overflow-hidden flex justify-center py-6 mask-gradient">
        <div className="flex animate-infinite-scroll space-x-10 ">
          {logos.length > 0 ? (
            [...logos, ...logos].map((logo, index) => (
              <div key={`${logo.id}-${index}`} className="flex-shrink-0 ">
                <img src={logo.logoUrl} alt={`${logo.id} Logo`} className="w-32 h-32 object-contain rounded-lg" />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No approved logos to display</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyWeWorkWith;
