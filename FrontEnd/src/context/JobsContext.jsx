import React, { createContext, useContext, useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { database } from "../firebase";

const JobContext = createContext();

export const useJobs = () => useContext(JobContext);

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uid, setUid] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState("");
  const [aboutContent, setAboutContent] = useState("");
  useEffect(() => {
    setIsLoading(true);
    const database = getDatabase();
    const jobRef = ref(database, "jobs");
    const unsubscribeJobs = onValue(jobRef, (snapshot) => {
      const jobsData = snapshot.val();
      const loadedJobs = [];
      for (const id in jobsData) {
        if (jobsData[id].status === "approved") {
          loadedJobs.push({ id, ...jobsData[id] });
        } }
      const reversedJobs = loadedJobs.reverse();
      setJobs(reversedJobs);
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
    <JobContext.Provider value={{ jobs, user, uid, isLoggedIn, isLoading, userType, inboxMessages, mark ,aboutContent,setAboutContent}}>
      {children}
    </JobContext.Provider>
  );
}

export default JobContext;
