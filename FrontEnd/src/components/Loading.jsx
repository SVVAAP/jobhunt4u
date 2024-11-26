import React from 'react';
import { Atom } from 'react-loading-indicators'; 
import Logo from '../assets/logo.png'; // Ensure the correct import path for the logo

function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-transparent">
      {/* Center the logo */}
      <img src={Logo} alt="Loading Logo" className="h-20 w-auto mb-6" />
      {/* Place the spinner below the logo */}
      <Atom color="#073cce" size="medium" />
    </div>
  );
}

export default Loading;
