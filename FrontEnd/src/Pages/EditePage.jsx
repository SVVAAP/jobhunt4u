import React, { useEffect, useState } from "react";
import { ref, update, get } from "firebase/database";
import { database } from "../firebase";
import { useJobs } from "../context/jobsContext";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";

function EditPage() {
  const { isLoading, aboutContent, setAboutContent } = useJobs();
  const [termsContent, setTermsContent] = useState(""); // State for Terms and Conditions content
  const [privacyPolicyContent, setPrivacyPolicyContent] = useState(""); // State for Privacy Policy content
  const [contactInfo, setContactInfo] = useState({
    phone: "",
    email: "",
    address: "",
  });

  // Editor for About Us
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: aboutContent ? aboutContent : "",
    onUpdate: ({ editor }) => {
      setAboutContent(editor.getHTML());
    },
  });

  // Editor for Terms and Conditions
  const termsEditor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: termsContent,
    onUpdate: ({ editor }) => {
      setTermsContent(editor.getHTML());
    },
  });

  // Editor for Privacy Policy
  const privacyEditor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: privacyPolicyContent,
    onUpdate: ({ editor }) => {
      setPrivacyPolicyContent(editor.getHTML());
    },
  });

  useEffect(() => {
    // Fetch existing contact info, terms, and privacy policy from Firebase
    const contactRef = ref(database, "siteContent/contact");
    get(contactRef).then((snapshot) => {
      if (snapshot.exists()) {
        setContactInfo(snapshot.val());
      }
    });

    const fetchTermsContent = async () => {
      const termsRef = ref(database, "siteContent/terms");
      const snapshot = await get(termsRef);

      if (snapshot.exists()) {
        const termsData = snapshot.val();
        setTermsContent(termsData.terms || "");
        if (termsEditor) {
          termsEditor.commands.setContent(termsData.terms); // Update editor content
        }
      }
    };

    const fetchPrivacyPolicyContent = async () => {
      const privacyRef = ref(database, "siteContent/privacyPolicy");
      const snapshot = await get(privacyRef);

      if (snapshot.exists()) {
        const privacyData = snapshot.val();
        setPrivacyPolicyContent(privacyData.policy || "");
        if (privacyEditor) {
          privacyEditor.commands.setContent(privacyData.policy); // Update Privacy Policy editor content
        }
      }
    };

    fetchTermsContent();
    fetchPrivacyPolicyContent();

    // Clean up editor instances to avoid memory leaks
    return () => {
      if (editor) {
        editor.destroy();
      }
      if (termsEditor) {
        termsEditor.destroy();
      }
      if (privacyEditor) {
        privacyEditor.destroy();
      }
    };
  }, [editor, termsEditor, privacyEditor]);

  const handleSave = () => {
    const aboutRef = ref(database, "siteContent");
    const termsRef = ref(database, "siteContent/terms");
    const privacyRef = ref(database, "siteContent/privacyPolicy");

    // Update the About Us content in Firebase
    update(aboutRef, { about: aboutContent })
      .then(() => {
        alert("About Us content updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating About Us content: ", error);
      });

    // Update the Terms and Conditions content in Firebase
    update(termsRef, { terms: termsContent })
      .then(() => {
        alert("Terms and Conditions updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating Terms and Conditions: ", error);
      });

    // Update the Privacy Policy content in Firebase
    update(privacyRef, { policy: privacyPolicyContent })
      .then(() => {
        alert("Privacy Policy updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating Privacy Policy: ", error);
      });

    const contactRef = ref(database, "siteContent/contact");
    update(contactRef, contactInfo)
      .then(() => {
        alert("Contact information updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating contact information: ", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  };

  const Toolbar = ({ editor }) => (
    <div className="flex space-x-2 mb-4">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded ${editor.isActive("bold") ? "bg-black text-white" : "bg-gray-200"
          }`}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded ${editor.isActive("italic") ? "bg-black text-white" : "bg-gray-200"
          }`}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`px-2 py-1 rounded ${editor.isActive("underline") ? "bg-black text-white" : "bg-gray-200"
          }`}
      >
        Underline
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`px-2 py-1 rounded ${editor.isActive({ textAlign: "left" }) ? "bg-black text-white" : "bg-gray-200"
          }`}
      >
        Left
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`px-2 py-1 rounded ${editor.isActive({ textAlign: "center" }) ? "bg-black text-white" : "bg-gray-200"
          }`}
      >
        Center
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`px-2 py-1 rounded ${editor.isActive({ textAlign: "right" }) ? "bg-black text-white" : "bg-gray-200"
          }`}
      >
        Right
      </button>
      <button
        onClick={() => {
          const url = prompt("Enter the URL");
          if (url) {
            // Check if some text is selected
            if (editor.isActive('link')) {
              // If link is already applied, update it
              editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
            } else {
              // Apply link to selected text
              editor.chain().focus().setLink({ href: url }).run();
            }
          }
        }}
        className="px-2 py-1 rounded bg-gray-200"
      >
        Add Link
      </button>
    </div>
  );

  return (
    <div className="m-3 rounded-lg p-5 bg-sky-800">
      <h2 className="text-2xl text-white font-bold mb-4">Edit About Section, Terms & Privacy Policy</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex justify-items-center">
          <div className="bg-sky-600 p-8 rounded-lg">
            {/* About Us Section */}
            <h3 className="text-xl text-white mb-2">Edit About Us</h3>
            {editor && <Toolbar editor={editor} />}
            <p className="text-sm text-white mb-2">
              [ Use the toolbar above to format and edit the content below. ]
            </p>
            <EditorContent
              editor={editor}
              className="p-4 border border-gray-300 rounded-lg bg-white"
            />

            {/* Terms and Conditions Section */}
            <div className="mt-8">
              <h3 className="text-xl text-white mb-2">Edit Terms and Conditions</h3>
              {termsEditor && <Toolbar editor={termsEditor} />}
              <p className="text-sm text-white mb-2">
                [ Use the toolbar above to format and edit the content below. ]
              </p>
              <EditorContent
                editor={termsEditor}
                className="p-4 border border-gray-300 rounded-lg bg-white"
              />
            </div>

            {/* Privacy Policy Section */}
            <div className="mt-8">
              <h3 className="text-xl text-white mb-2">Edit Privacy Policy</h3>
              {privacyEditor && <Toolbar editor={privacyEditor} />}
              <p className="text-sm text-white mb-2">
                [ Use the toolbar above to format and edit the content below. ]
              </p>
              <EditorContent
                editor={privacyEditor}
                className="p-4 border border-gray-300 rounded-lg bg-white"
              />
            </div>

            {/* Contact Info Section */}
            <div className="mt-8">
              <h3 className="text-xl text-white mb-2">Edit Contact Information</h3>
              <div className="flex flex-col mb-4">
                <label className="text-white mb-1">Phone:</label>
                <input
                  type="text"
                  name="phone"
                  value={contactInfo.phone}
                  onChange={handleInputChange}
                  className="p-2 rounded-lg"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="text-white mb-1">Email:</label>
                <input
                  type="text"
                  name="email"
                  value={contactInfo.email}
                  onChange={handleInputChange}
                  className="p-2 rounded-lg"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="text-white mb-1">Address:</label>
                <input
                  type="text"
                  name="address"
                  value={contactInfo.address}
                  onChange={handleInputChange}
                  className="p-2 rounded-lg"
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
            >
              Save All Changes
            </button>
          </div>
        </div>
      )}
      <div>
        <h1>C</h1>
        <div className="flex">

        </div>
      </div>
    </div>
  );
}

export default EditPage;
