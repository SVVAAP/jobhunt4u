// import React, { createContext, useContext, useEffect, useState } from "react";
// import { ref, onValue, get } from "firebase/database";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { getDatabase } from "firebase/database";
// import { database } from "../firebase";

// const JobContext = createContext();

// export const useJobs = () => useContext(JobContext);

// export function JobsProvider({ children }) {
//   const [jobs, setJobs] = useState([]);
//   const [allJobs, setAllJobs] = useState([]);
//   const [user, setUser] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [uid, setUid] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [userType, setUserType] = useState("");
//   const [aboutContent, setAboutContent] = useState("");
//   const [categoryList, setCategoryList] = useState([]);
//   const [sections, setSections] = useState([{ heading: "", paragraph: "" }]);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     setIsLoading(true);
//     const database = getDatabase();
//     const jobRef = ref(database, "jobs");
//     const unsubscribeJobs = onValue(jobRef, (snapshot) => {
//       const jobsData = snapshot.val();
//       const loadedJobs = [];
//       const unfilyJobs=[];
//       for (const id in jobsData) {
//         const job = jobsData[id];
//         if (job.applicants) {
//           // Convert applicants object to an array with keys (id)
//           job.applicants = Object.keys(job.applicants).map((applicantId) => ({
//             id: applicantId,
//             ...job.applicants[applicantId],
//           }));
//         }
//         unfilyJobs.push({ id, ...jobsData[id] });
//         if (jobsData[id].status === "approved") {
//           loadedJobs.push({ id, ...jobsData[id] });
//         } }
//       const reversedJobs = loadedJobs.reverse();
//       setJobs(reversedJobs);
//       setAllJobs(unfilyJobs.reverse());
//       setIsLoading(false);
//     });

//     const auth = getAuth();
//     const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setIsLoggedIn(true);
//         setUid(user.uid);
//         const userRef = ref(database, `users/${user.uid}`);
//         onValue(userRef, (snapshot) => {
//           const userData = snapshot.val();
//           const userDataWithUid = { ...userData, uid: user.uid };
//           setUser(userDataWithUid);
//           console.log(userData.userType);
//           setUserType(userData.userType);
//         });
//       } else {
//         setIsLoggedIn(false);
//         setUid(null);
//         setUser(null);
//       }

//       setIsLoading(false);
//     });

//     const categoryRef = ref(database, `siteContent/categories`);
//     // Retrieve the existing categories object
//     get(categoryRef).then((snapshot) => {
//       if (snapshot.exists()) {
//         setCategoryList(Object.values(snapshot.val()));
//       }
//     });

//     // Cleanup for job and auth listeners
//     return () => {
//       unsubscribeJobs();
//       unsubscribeAuth();
//     };
//   }, []);

//   useEffect(() => {
//     const aboutRef = ref(database, "siteContent/aboutcontent/about");

//     // Fetch the current content from Firebase
//     onValue(aboutRef, (snapshot) => {
//       const data = snapshot.val();
//       setAboutContent(data || ""); // Set the content or default to an empty string
//       setIsLoading(false);
//     });
//   }, []);

// const [contactInfo, setContactInfo] = useState({
//     phone: "",
//     email: "",
//     address: "",
//   });
//  useEffect(() => {
//     const sectionRef = ref(database, "siteContent/aboutcontent/sections");

//     const unsubscribe = onValue(sectionRef, (snapshot) => {
//       const data = snapshot.val();
//       let fetchedSections = [];
//       fetchedSections=data;
//       setSections(fetchedSections);
//     });

//     return () => unsubscribe(); // Clean up the subscription
//   }, []);
//   useEffect(() => {
//     const contactRef = ref(database, "siteContent/contact");
//     get(contactRef).then((snapshot) => {
//       if (snapshot.exists()) {
//         setContactInfo(snapshot.val());
//       }
//     });
//   }, []);

//   // Convert inbox object to array
//   const messageData = user?.inbox
//     ? Object.keys(user.inbox).map((key) => ({
//         id: key,
//         ...user.inbox[key],
//       }))
//     : [];
//   const inboxMessages = messageData.reverse();

//   const mark = inboxMessages.some((message) => !message.seen);

//   const calculatePageRange = () => {
//     const startIndex = (currentPage - 1) * 6;
//     const endIndex = startIndex + 6;
//     return { startIndex, endIndex };
//   };

//   const { startIndex, endIndex } = calculatePageRange();

//   return (
//     <JobContext.Provider value={{ jobs, user, uid, isLoggedIn, isLoading, userType, inboxMessages, mark ,aboutContent,
//     setAboutContent ,contactInfo, allJobs ,categoryList, setCategoryList,sections, setSections,currentPage,setCurrentPage ,startIndex,endIndex}}>
//       {children}
//     </JobContext.Provider>
//   );
// }

// export default JobContext;



// new code by chatgpt
import React, { createContext, useContext, useEffect, useState } from "react";
import { ref, onValue, get } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { database } from "../firebase";

const JobContext = createContext();

export const useJobs = () => useContext(JobContext);

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uid, setUid] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState("");
  const [aboutContent, setAboutContent] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [sections, setSections] = useState([]);
  const [contactInfo, setContactInfo] = useState({
    phone: "",
    email: "",
    address: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const database = getDatabase();

  useEffect(() => {
    // Handle jobs loading
    const jobRef = ref(database, "jobs");
    const unsubscribeJobs = onValue(jobRef, (snapshot) => {
      const jobsData = snapshot.val();
      const approvedJobs = [];
      const allJobsTemp = [];

      for (const id in jobsData) {
        const job = jobsData[id];
        if (job.applicants) {
          job.applicants = Object.keys(job.applicants).map((applicantId) => ({
            id: applicantId,
            ...job.applicants[applicantId],
          }));
        }
        allJobsTemp.push({ id, ...job });
        if (job.status === "approved") {
          approvedJobs.push({ id, ...job });
        }
      }

      setJobs(approvedJobs.reverse());
      setAllJobs(allJobsTemp.reverse());
      setIsLoading(false);
    });

    // Handle user authentication
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setIsLoggedIn(true);
        setUid(currentUser.uid);
        const userRef = ref(database, `users/${currentUser.uid}`);
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          setUser({ ...userData, uid: currentUser.uid });
          setUserType(userData?.userType || "");
        });
      } else {
        setIsLoggedIn(false);
        setUid(null);
        setUser(null);
      }

      setIsLoading(false);
    });

    return () => {
      unsubscribeJobs();
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    // Fetch about content
    const aboutRef = ref(database, "siteContent/aboutcontent/about");
    onValue(aboutRef, (snapshot) => {
      setAboutContent(snapshot.val() || "");
      setIsLoading(false);
    });

    // Fetch categories
    const categoryRef = ref(database, "siteContent/categories");
    get(categoryRef).then((snapshot) => {
      if (snapshot.exists()) {
        setCategoryList(Object.values(snapshot.val()));
      }
    });

    // Fetch sections
    const sectionRef = ref(database, "siteContent/aboutcontent/sections");
    onValue(sectionRef, (snapshot) => {
      const fetchedSections = snapshot.val() || [];
      setSections(fetchedSections);
    });

    // Fetch contact info
    const contactRef = ref(database, "siteContent/contact");
    get(contactRef).then((snapshot) => {
      if (snapshot.exists()) {
        setContactInfo(snapshot.val());
      }
    });
  }, []);

  // Convert inbox object to an array
  const inboxMessages = user?.inbox
    ? Object.keys(user.inbox).map((key) => ({
        id: key,
        ...user.inbox[key],
      }))
    : [];

  // Check for unread messages
  const mark = inboxMessages.some((message) => !message.seen);

  // Pagination logic
  const calculatePageRange = () => {
    const itemsPerPage = 6;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return { startIndex, endIndex };
  };

  const { startIndex, endIndex } = calculatePageRange();

  return (
    <JobContext.Provider
      value={{
        jobs,
        allJobs,
        user,
        uid,
        isLoggedIn,
        isLoading,
        userType,
        aboutContent,
        setAboutContent,
        categoryList,
        setCategoryList,
        sections,
        setSections,
        contactInfo,
        currentPage,
        setCurrentPage,
        startIndex,
        endIndex,
        inboxMessages,
        mark,
      }}
    >
      {children}
    </JobContext.Provider>
  );
}

export default JobContext;
