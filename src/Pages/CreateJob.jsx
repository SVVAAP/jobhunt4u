import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { database, storage } from "../firebase";
import { ref, set, push } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
import { useJobs } from "../context/jobsContext";

const CreateJob = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const { user } = useJobs();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm();

  useEffect(() => {
    if (user) {
      setValue("postedBy", user.email);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    data.skills = selectedOption ? selectedOption.map(option => option.value) : [];
    data.postedBy = user ? user.email : '';
    const newJobRef = push(ref(database, 'jobs'));

    // Set default values for optional fields
    data.minPrice = data.minPrice || "--";
    data.maxPrice = data.maxPrice || "--";
    data.status = "review";

    try {
      // Upload logo if provided
      if (logoFile) {
        const logoStorageRef = storageRef(storage, `logos/${logoFile.name}`);
        await uploadBytes(logoStorageRef, logoFile);
        const logoURL = await getDownloadURL(logoStorageRef);
        data.companyLogo = logoURL;
      } else {
        data.companyLogo = "https://cdn-icons-png.flaticon.com/128/4168/4168507.png";  // Default value if no logo is provided
      }

      // Save data to Firebase Database
      const jobData = {
        jobTitle: data.jobTitle,
        companyName: data.companyName,
        minPrice: data.minPrice,
        maxPrice: data.maxPrice,
        salaryType: data.salaryType,
        jobLocation: data.jobLocation,
        postingDate: data.postingDate,
        experienceLevel: data.experienceLevel,
        skills: data.skills,
        employmentType: data.employmentType,
        description: data.description,
        postedBy: data.postedBy,
        companyLogo: data.companyLogo,
        workmode: data.workmode,
        jobCategory: data.jobCategory,   // Added jobCategory field
        jobType: data.jobType,           // Added jobType field
        status: data.status
      };

      await set(newJobRef, jobData);
      console.log("Data saved successfully!");
      setShowPopup(true);
    } catch (error) {
      console.error("Error saving data: ", error);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    navigate("/");
  };

  const options = [
    { value: "computer knowledge", label: "Computer Knowledge" },
    { value: "communication skills", label: "Communication Skills" },
    { value: "teamwork", label: "Teamwork" },
    { value: "problem-solving", label: "Problem-Solving" },
    { value: "time management", label: "Time Management" },
    { value: "adaptability", label: "Adaptability" },
    { value: "critical thinking", label: "Critical Thinking" },
    { value: "customer service", label: "Customer Service" },
    { value: "project management", label: "Project Management" },
    { value: "data analysis", label: "Data Analysis" },
    { value: "interpersonal skills", label: "Interpersonal Skills" },
    { value: "leadership", label: "Leadership" },
    { value: "organizational skills", label: "Organizational Skills" },
    { value: "attention to detail", label: "Attention to Detail" },
    { value: "creativity", label: "Creativity" },
    { value: "multitasking", label: "Multitasking" },
    { value: "technical skills", label: "Technical Skills" },
    { value: "emotional intelligence", label: "Emotional Intelligence" },
    { value: "negotiation skills", label: "Negotiation Skills" },
    { value: "decision making", label: "Decision Making" },
    { value: "financial literacy", label: "Financial Literacy" },
    { value: "writing skills", label: "Writing Skills" },
  ];

  if(!user.approved){
    return(
      <div className="text-center mt-5">
      <h1>You Are currently Under Verification By admin&apos;s</h1>
      </div>
    )
  }

  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4" id="">
      <div className="bg-sky-900/80 rounded-xl mt-5 text-white py-10 px-4 lg:px-16">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Job Title</label>
              <input
                type="text"
                placeholder="Ex: web developer..."
                {...register("jobTitle", { required: "This field is required. Please enter the job title." })}
                className="create-job-input rounded-md"
              />
              {errors.jobTitle && <p className="text-red-500">{errors.jobTitle.message}</p>}
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Company Name</label>
              <input
                type="text"
                placeholder="Ex: Microsoft"
                {...register("companyName", { required: "This field is required. Please enter the company name." })}
                className="create-job-input rounded-md"
              />
              {errors.companyName && <p className="text-red-500">{errors.companyName.message}</p>}
            </div>
          </div>
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Minimum Salary <span className=" text-sm">[optional]</span></label>
              <input
                type="text"
                placeholder="₹..."
                {...register("minPrice")}
                className="create-job-input rounded-md"
              />
              {errors.minPrice && <p className="text-red-500">{errors.minPrice.message}</p>}
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Maximum Salary <span className=" text-sm">[optional]</span></label>
              <input
                type="text"
                placeholder="₹..."
                {...register("maxPrice")}
                className="create-job-input rounded-md"
              />
              {errors.maxPrice && <p className="text-red-500">{errors.maxPrice.message}</p>}
            </div>
          </div>
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Salary Type</label>
              <select {...register("salaryType", { required: "This field is required. Please choose a salary type." })} className="create-job-input rounded-md">
                <option value="">Choose your salary</option>
                <option value="Hourly">Hourly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
              {errors.salaryType && <p className="text-red-500">{errors.salaryType.message}</p>}
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Job Location</label>
              <input
                type="text"
                placeholder="Ex: Mumbai,Bangalore,...."
                {...register("jobLocation", { required: "This field is required. Please enter the job location." })}
                className="create-job-input rounded-md"
              />
              {errors.jobLocation && <p className="text-red-500">{errors.jobLocation.message}</p>}
            </div>
          </div>
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Job Posting Date</label>
              <input
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                {...register("postingDate")}
                className="create-job-input rounded-md"
                readOnly
              />
              {errors.postingDate && <p className="text-red-500">{errors.postingDate.message}</p>}
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Experience Level</label>
              <select
                {...register("experienceLevel", { required: "This field is required. Please choose an experience level." })}
                className="create-job-input rounded-md"
              >
                <option value="">Choose your experience</option>
                <option value="NoExperience">No Experience / Fresher</option>
                <option value="Internship">Internship</option>
                <option value="1-2 years">1-2 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="MoreThan5Years">More Than 5 years</option>
              </select>
              {errors.experienceLevel && <p className="text-red-500">{errors.experienceLevel.message}</p>}
            </div>
          </div>
          <div>
            <label className="block mb-2 text-lg">Required Skills Set</label>
            <CreatableSelect
              className="create-job-input rounded-md py-4"
              defaultValue={selectedOption}
              onChange={setSelectedOption}
              options={options}
              isMulti
            />
          </div>
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Company Logo (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files[0])}
                className="create-job-input rounded-md"
              />
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Employment Type</label>
              <select
                {...register("employmentType", { required: "This field is required. Please choose an employment type." })}
                className="create-job-input rounded-md"
              >
                <option value="">Choose employment type</option>
                <option value="FullTime">Full Time</option>
                <option value="PartTime">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
              {errors.employmentType && <p className="text-red-500">{errors.employmentType.message}</p>}
            </div>
          </div>
          <div className="flex space-x-5">
           {/* New Job Category Field */}
           <div className="lg:w-full w-full">
            <label className="block mb-2 text-lg">Job Category</label>
            <select
              {...register("jobCategory", { required: "This field is required. Please select a job category." })}
              className="create-job-input rounded-md"
            >
              <option value="">Choose job category</option>
              <option value="Accounting/Finance">Accounting/Finance</option>
              <option value="IT/Software">IT/Software</option>
              <option value="Marketing">Marketing</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Sales">Sales</option>
            </select>
            {errors.jobCategory && <p className="text-red-500">{errors.jobCategory.message}</p>}
          </div>
          {/* New Job Type Field */}
          <div className="lg:w-full w-full">
            <label className="block mb-2 text-lg">Job Type</label>
            <select
              {...register("jobType", { required: "This field is required. Please select a job type." })}
              className="create-job-input rounded-md"
            >
              <option value="">Choose job type</option>
              <option value="National">National</option>
              <option value="International">International</option>
            </select>
            {errors.jobType && <p className="text-red-500">{errors.jobType.message}</p>}
          </div>
          </div>
          <div>
            <label className="block mb-2 text-lg">Job Description</label>
            <textarea
              rows="4"
              {...register("description", { required: "This field is required. Please enter the job description." })}
              className="create-job-input rounded-md"
              placeholder="Job Description..."
            ></textarea>
            {errors.description && <p className="text-red-500">{errors.description.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-lg">Work Mode</label>
            <select
              {...register("workmode", { required: "This field is required. Please choose a work mode." })}
              className="create-job-input rounded-md"
            >
              <option value="">Choose work mode</option>
              <option value="onsite">On-Site</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
            {errors.workmode && <p className="text-red-500">{errors.workmode.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-lg">Posted By</label>
            <input
              type="text"
              {...register("postedBy")}
              className="create-job-input rounded-md"
              defaultValue={user ? user.email : ""}
              readOnly
            />
          </div>
          <div>
            <button type="submit" className="create-job-btn bg-blue text-white px-4 py-2 rounded hover:bg-black">Create Job</button>
          </div>
        </form>
        {showPopup && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
      <h2 className="text-xl font-semibold mb-4 text-black">Job Created Successfully!</h2>
      <p className="mb-4 text-black">Your job has been posted. Our team will review it, and it will be updated on the portal within 24 hours.</p>
      <div className="flex justify-end">
        <button
          onClick={handleClosePopup}
          className="bg-blue text-white px-4 py-2 rounded hover:bg-blue"
        >
          Continue Hunting
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default CreateJob;
