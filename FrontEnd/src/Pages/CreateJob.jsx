import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { database, storage } from "../firebase";
import { ref, set, push, update, get } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useJobs } from "../context/jobsContext";
import { getAuth } from "firebase/auth";
import Loading from "../components/Loading";

const CreateJob = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const { user, isLoading, categoryList } = useJobs();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const generateJobID = async () => {
    const jobCounterRef = ref(database, "jobCounter");
  
    try {
      const snapshot = await get(jobCounterRef);
      let jobNumber = 1; // Default starting job number
  
      if (snapshot.exists()) {
        jobNumber = snapshot.val() + 1;
      }
      // Increment the counter in the database
      await set(jobCounterRef, jobNumber);
  
      // Format the job number into a job ID, e.g., "JV001"
      return `JV00${String(jobNumber).padStart(3, "0")}`;
    } catch (error) {
      console.error("Error generating job ID:", error);
      return null;
    }
  };
  

  useEffect(() => {
    if (user) {
      setValue("postedBy", user.email);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    data.skills = selectedOption ? selectedOption.map((option) => option.value) : [];
    data.postedBy = user ? user.email : "";
    const newJobRef = push(ref(database, "jobs"));

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
      } else if (user.logo) {
        data.companyLogo = user.logo;
      } else {
        data.companyLogo = "https://cdn-icons-png.flaticon.com/128/4168/4168507.png"; // Default value if no logo is provided
      }
      const jobID = await generateJobID();
      if (!jobID) {
        console.error("Failed to generate job ID.");
        return;
      }

      // Save data to Firebase Database
      const jobData = {
        jobID:jobID,
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
        jobCategory: data.jobCategory, // Added jobCategory field
        jobType: data.jobType, // Added jobType field
        status: data.status,
        uid: user.uid,
      };

      await set(newJobRef, jobData);
      const applicantInboxRef = ref(database, `users/${user.uid}/inbox`);
      const newMessageRef = push(applicantInboxRef);

      // Create a message based on the status
      const message = {
        title: `Your Job ${data.jobTitle}`,
        message: `Your recently Uploaded Job ${data.jobTitle} is under Review`,
        timestamp: Date.now(),
      };

      // Save the message to the applicant's inbox
      update(newMessageRef, message)
        .then(() => {
          console.log("Message sent to applicant inbox");
        })
        .catch((error) => {
          console.error("Error sending message: ", error);
        });
      console.log("Data saved successfully!");
      setShowPopup(true);
    } catch (error) {
      console.error("Error saving data: ", error);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    window.location.reload(); // Refresh the page
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
  if (isLoading && !user) {
    return <Loading/>;
  } else {
    if (user && user.status && user.status === "approved") {
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
                  <label className="block mb-2 text-lg">
                    Minimum Salary <span className=" text-sm">[optional]</span>
                  </label>
                  <input
                    type="text"
                    placeholder="₹..."
                    {...register("minPrice")}
                    className="create-job-input rounded-md"
                  />
                  {errors.minPrice && <p className="text-red-500">{errors.minPrice.message}</p>}
                </div>
                <div className="lg:w-1/2 w-full">
                  <label className="block mb-2 text-lg">
                    Maximum Salary <span className=" text-sm">[optional]</span>
                  </label>
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
                  <select
                    {...register("salaryType", { required: "This field is required. Please choose a salary type." })}
                    className="create-job-input rounded-md">
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
                    defaultValue={new Date().toISOString().split("T")[0]}
                    {...register("postingDate")}
                    className="create-job-input rounded-md"
                    readOnly
                  />
                  {errors.postingDate && <p className="text-red-500">{errors.postingDate.message}</p>}
                </div>
                <div className="lg:w-1/2 w-full">
                  <label className="block mb-2 text-lg">Experience Level</label>
                  <select
                    {...register("experienceLevel", {
                      required: "This field is required. Please choose an experience level.",
                    })}
                    className="create-job-input rounded-md">
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
                {!user.logo && (
                  <div className="lg:w-1/2 w-full">
                    <label className="block mb-2 text-lg">Company Logo (Optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setLogoFile(e.target.files[0])}
                      className="create-job-input rounded-md"
                    />
                  </div>
                )}
                <div className="lg:w-1/2 w-full">
                  <label className="block mb-2 text-lg">Employment Type</label>
                  <select
                    {...register("employmentType", {
                      required: "This field is required. Please choose an employment type.",
                    })}
                    className="create-job-input rounded-md">
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
                    className="create-job-input rounded-md">
                    <option value="">Choose job category</option>
                    {categoryList.map((cat, index) => (
                      <option key={index} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.jobCategory && <p className="text-red-500">{errors.jobCategory.message}</p>}
                </div>
                {/* New Job Type Field */}
                <div className="lg:w-full w-full">
                  <label className="block mb-2 text-lg">Job Type</label>
                  <select
                    {...register("jobType", { required: "This field is required. Please select a job type." })}
                    className="create-job-input rounded-md">
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
                  {...register("description", {
                    required: "This field is required. Please enter the job description.",
                  })}
                  className="create-job-input rounded-md"
                  placeholder="Job Description..."></textarea>
                {errors.description && <p className="text-red-500">{errors.description.message}</p>}
              </div>
              <div>
                <label className="block mb-2 text-lg">Work Mode</label>
                <select
                  {...register("workmode", { required: "This field is required. Please choose a work mode." })}
                  className="create-job-input rounded-md">
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
                <button type="submit" className="create-job-btn bg-sky-400 text-white px-4 py-2 rounded hover:bg-black">
                  Create Job
                </button>
              </div>
            </form>
            {showPopup && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                  <h2 className="text-xl font-semibold mb-4 text-black">Job Created Successfully!</h2>
                  <p className="mb-4 text-black">
                    Your job has been posted. Our team will review it, and it will be updated on the portal within 24
                    hours.
                  </p>
                  <div className="flex justify-center">
                    <button onClick={handleClosePopup} className="bg-sky-800 text-white px-4 py-2 rounded hover:bg-blue">
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    } else if (user && user.status === "pending") {
        return (
          <div className="m-5 text-center">
            <h1 className="text-red text-2xl text-red-600 font-bold animate-pulse">
              You are currently under Verification!!!!! <br /> Please wait until your Verification is done!!
            </h1>
          </div>
        );
      } else if (user && user.status === "declined") {
        return (
          <div className="m-5 text-center">
            <h1 className="text-red text-2xl text-red-600  font-bold ">
              Your Are Not Permired to Upload the job <br />
              Please contact Admin For more information!!!
            </h1>
          </div>
        );
      } else{
        return <Loading/>;
      }
  }
};

export default CreateJob;
