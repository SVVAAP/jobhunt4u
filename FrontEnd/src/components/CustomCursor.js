import React, { useEffect } from 'react';
import '../App';

const CustomCursor = () => {
  useEffect(() => {
    const cursor = document.createElement('div');
    const trail = document.createElement('div');
    cursor.classList.add('cursor');
    trail.classList.add('cursor-trail');

    document.body.appendChild(cursor);
    document.body.appendChild(trail);

    const handleMouseMove = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      
      trail.style.left = `${e.clientX}px`;
      trail.style.top = `${e.clientY}px`;
    };

    const handleMouseDown = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
      trail.style.width = '20px';
      trail.style.height = '20px';
      trail.style.background = 'rgba(0, 255, 128, 0.5)';
    };

    const handleMouseUp = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      trail.style.width = '10px';
      trail.style.height = '10px';
      trail.style.background = 'rgba(0, 128, 255, 0.5)';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.removeChild(cursor);
      document.body.removeChild(trail);
    };
  }, []);

  return null; // This component does not render anything itself
};

export default CustomCursor;
