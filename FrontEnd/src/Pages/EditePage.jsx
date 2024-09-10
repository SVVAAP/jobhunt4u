import React, { useEffect, useState } from "react";
import { ref, update, get } from "firebase/database";
import { database } from "../firebase";
import { useJobs } from "../context/jobsContext";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import About from "../components/About";

function EditePage() {
  const { isLoading, aboutContent, setAboutContent } = useJobs();
  const [contactInfo, setContactInfo] = useState({
    phone: "",
    email: "",
    address: "",
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: aboutContent ? aboutContent : "",
    onUpdate: ({ editor }) => {
      setAboutContent(editor.getHTML());
      console.log(aboutContent);
    },
  });

  useEffect(() => {
    // Fetch existing contact info from Firebase
    const contactRef = ref(database, "siteContent/contact");
    get(contactRef).then((snapshot) => {
      if (snapshot.exists()) {
        setContactInfo(snapshot.val());
      }
    });

    // Clean up editor instance to avoid memory leaks
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  const handleSave = () => {
    const aboutRef = ref(database, "siteContent");

    // Update the content in Firebase
    update(aboutRef, { about: aboutContent })
      .then(() => {
        alert("Content updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating content: ", error);
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


  const Toolbar = () => (
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
        className={`px-2 py-1 rounded ${editor.isActive({ textAlign: "left" })
          ? "bg-black text-white"
          : "bg-gray-200"
          }`}
      >
        Left
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`px-2 py-1 rounded ${editor.isActive({ textAlign: "center" })
          ? "bg-black text-white"
          : "bg-gray-200"
          }`}
      >
        Center
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`px-2 py-1 rounded ${editor.isActive({ textAlign: "right" })
          ? "bg-black text-white"
          : "bg-gray-200"
          }`}
      >
        Right
      </button>
    </div>
  );

 return (
    <div className="m-3 rounded-lg p-5 bg-sky-800">
      <h2 className="text-2xl text-white font-bold mb-4">Edit About Section</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex justify-items-center">
          <div className="bg-sky-600 p-8 rounded-lg">
            {editor && <Toolbar />}
            <p className="text-sm text-white mb-2">
              [ Use the toolbar above to format and edit the content below. ]
            </p>

            <EditorContent
              editor={editor}
              className="p-4 border border-gray-300 rounded-lg bg-white"
            />

            {/* Input fields for Contact Info */}
            <div className="mt-4">
              <label className="block text-white font-bold mb-2">Phone:</label>
              <input
                type="text"
                name="phone"
                value={contactInfo.phone}
                onChange={handleInputChange}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
              />
              <label className="block text-white font-bold mb-2">Email:</label>
              <input
                type="email"
                name="email"
                value={contactInfo.email}
                onChange={handleInputChange}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
              />
              <label className="block text-white font-bold mb-2">Address:</label>
              <textarea
                name="address"
                value={contactInfo.address}
                onChange={handleInputChange}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
                rows="3"
              ></textarea>
            </div>

            <button
              className="mt-4 px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-sky-400"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditePage;
