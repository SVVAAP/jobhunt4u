import React, { createContext, useContext, useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const JobContext = createContext();

export const useJobs = () => useContext(JobContext);

export function JobsProvider({ children }) {
    const [jobs, setJobs] = useState([]);
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [uid, setUid] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [userType,setUserType]=useState("");

    useEffect(() => {
        setIsLoading(true);
        const database = getDatabase();
        const jobRef = ref(database, 'jobs');
        const unsubscribeJobs = onValue(jobRef, (snapshot) => {
            const jobsData = snapshot.val();
            const loadedJobs = [];
            for (const id in jobsData) {
                loadedJobs.push({ id, ...jobsData[id] });
            }
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
                    console.log((userData.userType));
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

    
 
    return (
        <JobContext.Provider value={{ jobs, user, uid, isLoggedIn ,isLoading ,userType}}>
            {children}
        </JobContext.Provider>
    );
}

export default JobContext;
