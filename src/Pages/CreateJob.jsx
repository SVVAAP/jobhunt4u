import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { database, storage } from "../firebase";
import { ref, set, push } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';

const CreateJob = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    data.skills = selectedOption ? selectedOption.map(option => option.value) : [];
    const newJobRef = push(ref(database, 'jobs'));

    try {
      // Upload logo if provided
      if (logoFile) {
        const logoStorageRef = storageRef(storage, `logos/${logoFile.name}`);
        await uploadBytes(logoStorageRef, logoFile);
        const logoURL = await getDownloadURL(logoStorageRef);
        data.companyLogo = logoURL;
      } else {
        delete data.companyLogo;  // Remove companyLogo if no file is provided
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
        Workmode: data.workmode
      };

      await set(newJobRef, jobData);
      console.log("Data saved successfully!");
      alert("Post Successful....");
      navigate("/");
    } catch (error) {
      console.error("Error saving data: ", error);
    }
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


  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
      <div className="bg-[#FAFAFA] py-10 px-4 lg:px-16">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Job Title</label>
              <input
                type="text"
                {...register("jobTitle", { required: "Job Title is required" })}
                className="create-job-input"
              />
              {errors.jobTitle && <p className="text-red-500">{errors.jobTitle.message}</p>}
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Company Name</label>
              <input
                type="text"
                placeholder="Ex: Microsoft"
                {...register("companyName", { required: "Company Name is required" })}
                className="create-job-input"
              />
              {errors.companyName && <p className="text-red-500">{errors.companyName.message}</p>}
            </div>
          </div>
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Minimum Salary</label>
              <input
                type="text"
                placeholder="$20K"
                {...register("minPrice", { required: "Minimum Salary is required" })}
                className="create-job-input"
              />
              {errors.minPrice && <p className="text-red-500">{errors.minPrice.message}</p>}
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Maximum Salary</label>
              <input
                type="text"
                placeholder="$120k"
                {...register("maxPrice", { required: "Maximum Salary is required" })}
                className="create-job-input"
              />
              {errors.maxPrice && <p className="text-red-500">{errors.maxPrice.message}</p>}
            </div>
          </div>
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Salary type</label>
              <select {...register("salaryType", { required: "Salary Type is required" })} className="create-job-input">
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
                placeholder="Ex: India"
                {...register("jobLocation", { required: "Job Location is required" })}
                className="create-job-input"
              />
              {errors.jobLocation && <p className="text-red-500">{errors.jobLocation.message}</p>}
            </div>
          </div>
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Job Posting Date</label>
              <input
                type="date"
                {...register("postingDate", { required: "Posting Date is required" })}
                className="create-job-input"
              />
              {errors.postingDate && <p className="text-red-500">{errors.postingDate.message}</p>}
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Experience Level</label>
              <select
                {...register("experienceLevel", { required: "Experience Level is required" })}
                className="create-job-input"
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
              className="create-job-input py-4"
              defaultValue={selectedOption}
              onChange={setSelectedOption}
              options={options}
              isMulti
            />
          </div>
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Company logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files[0])}
                className="create-job-input"
              />
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Employment Type</label>
              <select
                {...register("employmentType", { required: "Employment Type is required" })}
                className="create-job-input"
              >
                <option value="">Choose your experience</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Temporary">Temporary</option>
              </select>
              {errors.employmentType && <p className="text-red-500">{errors.employmentType.message}</p>}
            </div>
          </div>
          <div className="lg:w-1/2 w-full">
            <label className="block mb-2 text-lg">Work Mode</label>
            <select
              {...register("workMode", { required: "Work Mode is required" })}
              className="create-job-input"
            >
              <option value="">Choose your work mode</option>
              <option value="Office">Work from Office</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            {errors.workMode && <p className="text-red-500">{errors.workMode.message}</p>}
          </div>

          <div className="w-full">
            <label className="block mb-2 text-lg">Job Description</label>
            <textarea
              {...register("description", { required: "Job Description is required" })}
              className="w-full pl-3 py-1.5 focus:outline-none placeholder:text-gray-400"
              rows={6}
              placeholder="Describe the job..."
            />
            {errors.description && <p className="text-red-500">{errors.description.message}</p>}
          </div>
          <div className="w-full">
            <label className="block mb-2 text-lg">Job Posted by</label>
            <input
              type="email"
              placeholder="your email"
              {...register("postedBy", { required: "Posted By is required" })}
              className="create-job-input"
            />
            {errors.postedBy && <p className="text-red-500">{errors.postedBy.message}</p>}
          </div>
          <input
            type="submit"
            className=" block mt-12 bg-blue-600 ring-2 ring-black text-black font-semibold px-8 py-2 rounded-md cursor-pointer"
          />
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
