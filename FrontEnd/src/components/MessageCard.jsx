import React, { useState } from 'react';

function MessageCard({ markAsSeen, message }) {
    const [show, setShow] = useState(false);

    return (
        <div
            key={message.id}
            className={`p-2 mb-2 ${!message.seen ? 'font-bold' : ''} bg-white/10 my-2 rounded-lg relative inline-block`}
            onClick={() => {markAsSeen(message.id); setShow(!show);}}
        >
             {!message.seen && 
  <div className="absolute top-0 right-0 transform translate-x-0.5 -translate-y-0.5 w-3 h-3 bg-red-600 rounded-full"></div>
}
            <div className="flex">
                <h3 className="text-sm">{message.title}</h3>
                <button
                    onClick={() => { setShow(!show); }}
                    className={`text-2xl font-bold mb-2 mx-6 pb-2 transition-transform duration-500 text-white ${show ? "rotate-180" : ""}`}
                >
                    <i className="fa-solid fa-sort-down"></i>
                </button>
            </div>
            {show && <p className="text-xs">{message.message}</p>}
        </div>
    );
}

export default MessageCard;
