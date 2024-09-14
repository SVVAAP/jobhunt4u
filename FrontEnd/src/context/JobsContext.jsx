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
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState("");
  const [aboutContent, setAboutContent] = useState("");
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    const database = getDatabase();
    const jobRef = ref(database, "jobs");
    const unsubscribeJobs = onValue(jobRef, (snapshot) => {
      const jobsData = snapshot.val();
      const loadedJobs = [];
      const unfilyJobs=[];
      for (const id in jobsData) {
        unfilyJobs.push({ id, ...jobsData[id] });
        if (jobsData[id].status === "approved") {
          loadedJobs.push({ id, ...jobsData[id] });
        } }
      const reversedJobs = loadedJobs.reverse();
      setJobs(reversedJobs);
      setAllJobs(unfilyJobs.reverse());
      setIsLoading(false);
    });

    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUid(user.uid);
        const userRef = ref(database, `users/${user.uid}`);
        onValue(userRef, (snapshot) => {
          const userData = snapshot.val();
          setUser(userData);
          console.log(userData.userType);
          setUserType(userData.userType);
        });
      } else {
        setIsLoggedIn(false);
        setUid(null);
        setUser(null);
      }

      setIsLoading(false);
    });

    const categoryRef = ref(database, "siteContent/category");
    get(categoryRef).then((snapshot) => {
      if (snapshot.exists()) {
        setCategoryList(Object.values(snapshot.val()));
      }
    });

    // Cleanup for job and auth listeners
    return () => {
      unsubscribeJobs();
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    const aboutRef = ref(database, "siteContent/about");

    // Fetch the current content from Firebase
    onValue(aboutRef, (snapshot) => {
      const data = snapshot.val();
      setAboutContent(data || ""); // Set the content or default to an empty string
      setIsLoading(false);
    });
  }, []);
const [contactInfo, setContactInfo] = useState({
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    const contactRef = ref(database, "siteContent/contact");
    get(contactRef).then((snapshot) => {
      if (snapshot.exists()) {
        setContactInfo(snapshot.val());
      }
    });
  }, []);

  // Convert inbox object to array
  const messageData = user?.inbox
    ? Object.keys(user.inbox).map((key) => ({
        id: key,
        ...user.inbox[key],
      }))
    : [];
  const inboxMessages = messageData.reverse();

  const mark = inboxMessages.some((message) => !message.seen);

  return (
    <JobContext.Provider value={{ jobs, user, uid, isLoggedIn, isLoading, userType, inboxMessages, mark ,aboutContent,setAboutContent ,contactInfo, allJobs ,categoryList, setCategoryList}}>
      {children}
    </JobContext.Provider>
  );
}

export default JobContext;
