// Inbox.js
import React, { useState } from 'react';

const Inbox = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleInbox = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
        <i className=" text-2xl text-primary me-5 fa-solid fa-envelope" onClick={toggleInbox}></i>

      <div
        className={`fixed top-0 right-0 z-20 h-full bg-gray-800 text-white shadow-lg transition-transform transform  duration-500 ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: '25%' }}
      >
        <div className="p-4 relative">
          <button
            className="absolute top-4 right-4 text-white text-xl"
            onClick={toggleInbox}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
          <h2 className="text-lg font-bold">Inbox</h2>
          {/* Add your inbox content here */}
          <p>Your messages will appear here.</p>
        </div>
      </div>
    </>
  );
};

export default Inbox;
