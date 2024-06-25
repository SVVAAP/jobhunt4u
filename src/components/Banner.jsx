import React, { useState } from "react";
import { FiMapPin, FiSearch } from "react-icons/fi";

const Banner = ({ handleInputChange, query }) => {

  return (
    <>
    <div className="max-w-screen-2xl container mx-auto xl:px-24 md:py-20 py-14 px-4">
      <h1 className="text-5xl font-bold text-primary mb-3">
        Find your <span className="text-blue">Dream job</span> today
      </h1>
      <p className="text-lg text-black/70 mb-8">

      </p>


      <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">Get back to growth with <span className=" text-blue dark:text-blue-500">the world's #1</span> JobHunt</h1>
      <p class="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">Jobhunt4U Agency in Karnataka: Empowering careers, transforming lives, and shaping futures with dedication and excellence.</p>
      <div class="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
        <a href="#" class="rounded-md bg-blue px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Get started</a>
        <a href="#" class="text-sm font-semibold leading-6 text-black">Learn more <span aria-hidden="true">→</span></a>
      </div>
      
    </div>
    <div className="flex flex-wrap justify-center">
    <h1 class="mb-4 text-3xl font-extrabold text-gray-900 dark:text-black md:text-5xl lg:text-6xl "><span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Featured</span> Jobs.</h1>
  </div>
  </>
  );
};

export default Banner;
