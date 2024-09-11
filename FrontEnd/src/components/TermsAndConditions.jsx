import React, { useEffect, useState, useRef } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../firebase';

function TermsAndConditions() {
  const [termsContent, setTermsContent] = useState("");
  const contentRef = useRef(null);

  useEffect(() => {
    // Fetching terms content from Firebase
    const termsRef = ref(database, "siteContent/terms");
    get(termsRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("Terms Content:", data); // This will show you the structure
        setTermsContent(data.terms); // Accessing the 'terms' property to display it
      }
    }).catch((error) => {
      console.error("Error fetching terms content: ", error);
    });
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [termsContent]);

  return (
    <div ref={contentRef} className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg h-auto overflow-y-auto">
      <p
        className="mt-4 text-lg text-justify p-4"
        dangerouslySetInnerHTML={{ __html: termsContent.replace(/\n/g, "<br/>") }} // Replacing new lines with <br>
      ></p>
    </div>
  );
}

export default TermsAndConditions;
