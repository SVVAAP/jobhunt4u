import React, { createContext, useContext, useEffect, useState } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { database,auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const JobContext = createContext();

export const useJobs = () => useContext(JobContext);

export function JobsProvider({children}) {
    const [jobs, setJobs] = useState([]);
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [uid, setUid] = useState(null);

    useEffect(() => {
        const jobRef = ref(database, 'jobs');
        onValue(jobRef, (snapshot) => {
            const jobsData = snapshot.val();
            const loadedJobs = [];
            for (const id in jobsData) {
                loadedJobs.push({ id, ...jobsData[id] });
            }
            setJobs(loadedJobs);
        });
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(true);
                setUid(user.uid);
                const userRef = ref(database, `users/${user.uid}`);
                onValue(userRef, (snapshot) => {
                    const userData = snapshot.val();
                    setUser(userData);
                });
            }
        });
        unsubscribe();

    }, []);
    return (
        <JobContext.Provider value={{ jobs , user ,uid ,isLoggedIn }}>
            {children}
        </JobContext.Provider>
    );
}

export default JobContext;
