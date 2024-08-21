import React, { useState } from 'react';
import { getDatabase, ref, update } from 'firebase/database';
import { useJobs } from '../context/jobsContext';

const Inbox = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { user, uid } = useJobs();

    const toggleInbox = () => {
        setIsVisible(!isVisible);
    };

    const markAsSeen = (messageId) => {
        const database = getDatabase();
        const messageRef = ref(database, `users/${uid}/inbox/${messageId}`);
        update(messageRef, { seen: true });
    };

    // Convert inbox object to array
    const inboxMessages = user?.inbox ? Object.keys(user.inbox).map((key) => ({
        id: key,
        ...user.inbox[key]
    })) : [];

    return (
        <>
            <i className="text-2xl text-primary me-5 fa-solid fa-envelope" onClick={toggleInbox}></i>

            <div
                className={`fixed top-0 right-0 z-20 h-full bg-gray-800 text-white shadow-lg transition-transform transform duration-500 ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
                style={{ width: '25%' }}
            >
                <div className="p-4 relative">
                    <button
                        className="absolute top-4 right-4 text-white text-xl"
                        onClick={toggleInbox}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    <h2 className="text-lg font-bold">Inbox</h2>
                    <div>
                        {inboxMessages.length > 0 ? (
                            inboxMessages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`p-2 mb-2 ${!message.seen ? 'font-bold' : ''}`}
                                    onClick={() => markAsSeen(message.id)}
                                >
                                    <h3 className="text-sm">{message.title}</h3>
                                    <p className="text-xs">{message.message}</p>
                                </div>
                            ))
                        ) : (
                            <p>No messages in your inbox.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Inbox;
