import React, { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { database } from "../firebase";
import Loading from "./Loading";

function PrivacyPolicyPage() {
  const [privacyPolicyContent, setPrivacyPolicyContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrivacyPolicyContent = async () => {
      setLoading(true);
      const privacyRef = ref(database, "siteContent/privacyPolicy");

      try {
        const snapshot = await get(privacyRef);

        if (snapshot.exists()) {
          const privacyData = snapshot.val();
          setPrivacyPolicyContent(privacyData.policy || "No Privacy Policy available.");
        } else {
          setPrivacyPolicyContent("No Privacy Policy available.");
        }
      } catch (error) {
        console.error("Error fetching privacy policy: ", error);
        setPrivacyPolicyContent("Failed to load Privacy Policy. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyPolicyContent();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      {loading ? (
        <Loading/>
      ) : (
        <div
          className="prose max-w-full"
          dangerouslySetInnerHTML={{ __html: privacyPolicyContent }}
        ></div>
      )}
    </div>
  );
}

export default PrivacyPolicyPage;
