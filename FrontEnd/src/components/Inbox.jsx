import React, { useState, useEffect, useRef } from "react";
import { getDatabase, ref, update, remove } from "firebase/database";
import { useJobs } from "../context/jobsContext";
import MessageCard from "./MessageCard";
import { useMediaQuery } from "react-responsive";

const Inbox = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { uid, inboxMessages, mark } = useJobs();
  const inboxRef = useRef(null);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const toggleInbox = () => {
    setIsVisible(!isVisible);
  };

  const markAsSeen = (messageId) => {
    const database = getDatabase();
    const messageRef = ref(database, `users/${uid}/inbox/${messageId}`);
    update(messageRef, { seen: true });
  };

  const deleteAllMessages = () => {
    if (window.confirm("Are you sure you want to delete it?")) {
      const database = getDatabase();
      const inboxRef = ref(database, `users/${uid}/inbox`);
      remove(inboxRef).catch((error) => {
        console.error("Error removing messages: ", error);
      });
    }
  };

  const handleClickOutside = (event) => {
    if (inboxRef.current && !inboxRef.current.contains(event.target)) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible]);

  return (
    <>
      <div className="relative flex " onClick={toggleInbox}>
        <i
          className={`${isMobile ? "text-base" : "text-2xl"} text-primary ${
            isMobile ? "mr-1" : "mr-5"
          } fa-solid fa-envelope`}></i>{" "}
        {isMobile && <p className="text-base ms-1 flex items-center gap-2">Inbox</p>}
        {mark && (
          <div className="absolute top-0 right-0 transform -translate-x-4 translate-y-0.5 w-3 h-3 bg-red-600 rounded-full"></div>
        )}
      </div>

      <div
        ref={inboxRef}
        className={`fixed top-0 right-0 z-20 h-full bg-gray-800 text-white shadow-lg transition-transform transform duration-500 ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: `${isMobile ? "75%" : "25%"}`, overflowY: "hidden" }}>
        <div className="p-4 relative">
          <button className="absolute top-4 right-12 text-white text-xl" onClick={deleteAllMessages}>
            <i className="fa-solid fa-trash"></i>
          </button>
          <button className="absolute top-4 right-4 text-white text-2xl" onClick={toggleInbox}>
            <i className="fa-solid fa-xmark"></i>
          </button>
          <h2 className="text-lg font-bold">Inbox</h2>
          <div className="mt-4 max-h-[calc(100vh-100px)] overflow-y-auto pr-2 hide-scrollbar">
            {inboxMessages.length > 0 ? (
              inboxMessages.map((message) => <MessageCard key={message.id} message={message} markAsSeen={markAsSeen} />)
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
