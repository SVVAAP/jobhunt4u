import React from 'react';
import { FourSquare } from 'react-loading-indicators'; 

function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <FourSquare color="#42b6d4" size="large" />
    </div>
  );
}

export default Loading;
