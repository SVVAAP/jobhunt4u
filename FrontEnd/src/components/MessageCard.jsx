import React, { useState } from 'react';

function MessageCard({ markAsSeen, message }) {
    const [show, setShow] = useState(false);

    return (
        <div
            key={message.id}
            className={`p-2 mb-2 ${!message.seen ? 'font-bold' : ''} bg-white/10 my-2 w-full rounded-lg relative inline-block`}
            onClick={() => {markAsSeen(message.id); setShow(!show);}}
        >
             {!message.seen && 
  <div className="absolute top-0 right-0 transform translate-x-0.5 -translate-y-0.5 w-3 h-3 bg-red-600 rounded-full"></div>
}
            <div className="flex justify-between">
                <h3 className="text-base">{message.title}</h3>
                <button
                    onClick={() => { setShow(!show); }}
                    className={`text-lg font-bold  mx-6  transition-transform -translate-y-1 duration-500 text-white ${show ? "rotate-180" : ""}`}
                >
                    <i className="fa-solid fa-sort-down"></i>
                </button>
            </div>
            {show && <p className="text-xs">{message.message}</p>}
        </div>
    );
}

export default MessageCard;
