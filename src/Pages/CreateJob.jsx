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
        workmode: data.workmode
      };
      
      await set(newJobRef, jobData);
      console.log("Data saved successfully!");
      alert("Post Successful....");
      navigate("/post-job");
    } catch (error) {
      console.error("Error saving data: ", error);
    }
  };

  const options = [
    { value: "computer knowledge", label: "Computer Knowledge" },
    { value: "communication skills", label: "Communication Skills" },
    // ... other options
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
                placeholder="Ex: web developer..."
                {...register("jobTitle", { required: "This field is required. Please enter the job title." })}
                className="create-job-input"
              />
              {errors.jobTitle && <p className="text-red-500">{errors.jobTitle.message}</p>}
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Company Name</label>
              <input
                type="text"
                placeholder="Ex: Microsoft"
                {...register("companyName", { required: "This field is required. Please enter the company name." })}
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
                placeholder="--"
                {...register("minPrice")}
                className="create-job-input"
              />
              {errors.minPrice && <p className="text-red-500">{errors.minPrice.message}</p>}
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Maximum Salary</label>
              <input
                type="text"
                placeholder="--"
                {...register("maxPrice")}
                className="create-job-input"
              />
              {errors.maxPrice && <p className="text-red-500">{errors.maxPrice.message}</p>}
            </div>
          </div>
          <div className="create-job-flex">
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Salary Type</label>
              <select {...register("salaryType", { required: "This field is required. Please choose a salary type." })} className="create-job-input">
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
                defaultValue={new Date().toISOString().split('T')[0]}
                {...register("postingDate")}
                className="create-job-input"
                readOnly
              />
              {errors.postingDate && <p className="text-red-500">{errors.postingDate.message}</p>}
            </div>
            <div className="lg:w-1/2 w-full">
              <label className="block mb-2 text-lg">Experience Level</label>
              <select
                {...register("experienceLevel", { required: "This field is required. Please choose an experience level." })}
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
              <label className="block mb-2 text-lg">Company Logo (Optional)</label>
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
                {...register("employmentType", { required: "This field is required. Please choose an employment type." })}
                className="create-job-input"
              >
                <option value="">Choose your employment type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
              </select>
              {errors.employmentType && <p className="text-red-500">{errors.employmentType.message}</p>}
            </div>
          </div>
          <div>
            <label className="block mb-2 text-lg">Work Mode</label>
            <select
              {...register("workmode", { required: "This field is required. Please choose a work mode." })}
              className="create-job-input"
            >
              <option value="">Choose your work mode</option>
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            {errors.workmode && <p className="text-red-500">{errors.workmode.message}</p>}
          </div>
          <div>
            <label className="block mb-2 text-lg">Description</label>
            <textarea
              placeholder="Details about job..."
              {...register("description", { required: "This field is required. Please enter the job description." })}
              className="create-job-input h-40"
            />
            {errors.description && <p className="text-red-500">{errors.description.message}</p>}
          </div>
          <input
            type="hidden"
            {...register("postedBy")}
          />
          <div>
            <button type="submit" className="job-details-btn py-4">
              Post a Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
