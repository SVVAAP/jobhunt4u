// HorizontalLoop.js
import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';

gsap.registerPlugin(Observer);

const HorizontalLoop = () => {
  const containerRef = useRef(null);
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    // Fetch approved logos from Firebase
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

    // Set up loop and scrolling observer for direction
    const loop = gsap.to(containerRef.current, {
      xPercent: -50,
      repeat: -1,
      ease: "none",
      duration: logos.length * 5, // Adjust speed by logo count
    });

    const setDirection = (value) => {
      gsap.to(loop, { timeScale: value, duration: 0.3, overwrite: true });
      loop.vars.direction = value;
    };

    Observer.create({
      target: window,
      type: "wheel,scroll,touch",
      onDown: () => setDirection(1),
      onUp: () => setDirection(-1),
    });

    return () => {
      // Clean up observer on component unmount
      Observer.getAll().forEach((observer) => observer.kill());
    };
  }, [logos.length]);

    return (
        <div className="overflow-hidden">
          <div ref={containerRef} className="flex flex-row gap-6 w-[200%] select-none">
            {logos.map((logo) => (
              <div key={logo.id} className="h-[275px] w-[275px] flex items-center justify-center">
                <img src={logo.imageUrl} alt={logo.companyName} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      );
      
    }
export default HorizontalLoop;
