import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useJobs } from "../context/jobsContext";

const Carousel = () => {
  const { sections } = useJobs();
  const autoplay = Autoplay({ delay: 3000, stopOnInteraction: false }); // Define the autoplay instance

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [autoplay] // Pass the autoplay instance to useEmblaCarousel
  );

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit(); // Reinitialize Embla when the API is ready
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
           className="embla__slide w-5/6 flex-shrink-0 m-4 rounded-lg shadow-2xl p-0.5 animated-gradient-bg"
           key={index}
         >
           <div className="bg-white m-auto h-full px-8 py-2 rounded-lg flex items-center justify-center align-middle ">
             <div className="py-4">
               <h2 className="text-2xl font-bold m-2 animated-gradient-text">{data.heading}</h2>
               <p className="font-medium">{data.paragraph}</p>
             </div>
           </div>
         </div>
         
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
