import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useJobs } from "../context/jobsContext";

function Carousel() {
  const { sections } = useJobs();
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true }, // Options for emblaCarousel like looping
    [Autoplay({ playOnInit: true, delay: 3000 })] // Autoplay configuration
  );

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit(); // Ensure Embla reinitializes if the API is ready
    }
  }, [emblaApi]);

  if (!sections || sections.length === 0) {
    return <p>No sections available</p>;
  }

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container flex">
          {sections.map((data, index) => (
            <div
              className="embla__slide w-full flex-shrink-0 ring-2 ring-black m-4 rounded-lg" // Ensures each slide is full width
              key={index}
            >
              <div className="p-4">
                <h2 className="text-xl font-bold">{data.heading}</h2>
                <p>{data.paragraph}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Carousel;
