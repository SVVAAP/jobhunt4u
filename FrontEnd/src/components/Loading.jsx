import React from 'react';
import { Atom } from 'react-loading-indicators'; 

function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent">
      <Atom color="#073cce" size="medium" text="" textColor="" />
    </div>
  );
}

export default Loading;
