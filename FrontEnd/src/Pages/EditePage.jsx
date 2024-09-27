import React, { useEffect, useState } from "react";
import { ref, update, get, remove, set } from "firebase/database";
import { database } from "../firebase";
import { useJobs } from "../context/jobsContext";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style"; // Import TextStyle extension

function EditPage() {
  const { isLoading, aboutContent, setAboutContent, categoryList, setCategoryList } = useJobs();
  const [termsContent, setTermsContent] = useState(""); // State for Terms and Conditions content
  const [privacyPolicyContent, setPrivacyPolicyContent] = useState(""); // State for Privacy Policy content
  const [contactInfo, setContactInfo] = useState({
    phone: "",
    email: "",
    address: "",
  });
  const [category, setCategory] = useState("");
  const [showAbout, setShowAbout] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showCat, setShowCat] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle, // Enable inline text styles like font size
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

  const handleAddCategory = () => {
    // Reference to the categories object in Firebase
    const categoryRef = ref(database, `siteContent/categories`);

    // Retrieve the existing categories object
    get(categoryRef)
      .then((snapshot) => {
        const existingCategories = snapshot.val() || {}; // Get existing object or an empty object if none exist

        // Check if category already exists
        if (!Object.values(existingCategories).includes(category)) {
          // Find the next available index
          const nextIndex = Object.keys(existingCategories).length;
          const updatedCategories = { ...existingCategories, [nextIndex]: category };

          // Update Firebase with the new object
          update(categoryRef, updatedCategories)
            .then(() => {
              setCategoryList(Object.values(updatedCategories)); // Update local state
              setCategory("");
              alert("Category added successfully!");
            })
            .catch((error) => {
              console.error("Error adding category: ", error);
            });
        } else {
          alert("Category already exists!");
        }
      })
      .catch((error) => {
        console.error("Error retrieving categories: ", error);
      });
  };

  const handleDeleteCategory = (categoryToDelete) => {
    // Reference to the categories array in Firebase
    const categoryRef = ref(database, `siteContent/categories`);

    // Get the existing categories array
    get(categoryRef)
      .then((snapshot) => {
        const existingCategories = snapshot.val() || [];

        // Filter out the category that needs to be deleted
        const updatedCategories = existingCategories.filter((cat) => cat !== categoryToDelete);

        // Update Firebase with the new array
        set(categoryRef, updatedCategories)
          .then(() => {
            setCategoryList(updatedCategories); // Update local state
            alert("Category deleted successfully!");
          })
          .catch((error) => {
            console.error("Error deleting category: ", error);
          });
      })
      .catch((error) => {
        console.error("Error retrieving categories: ", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  };

  const Toolbar = ({ editor }) => {
    const changeFontSize = (increase) => {
      // Get the current font size or set a default size if none exists
      const currentFontSize = editor.getAttributes("textStyle").fontSize || "16px";
      const newFontSize = increase ? `${parseInt(currentFontSize) + 2}px` : `${parseInt(currentFontSize) - 2}px`;
console.log(currentFontSize);
      // Apply the new font size
      editor.chain().focus().setMark("textStyle", { fontSize: newFontSize }).run();
    };

    return (
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded ${editor.isActive("bold") ? "bg-black text-white" : "bg-gray-200"}`}>
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded ${editor.isActive("italic") ? "bg-black text-white" : "bg-gray-200"}`}>
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-2 py-1 rounded ${editor.isActive("underline") ? "bg-black text-white" : "bg-gray-200"}`}>
          Underline
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`px-2 py-1 rounded ${
            editor.isActive({ textAlign: "left" }) ? "bg-black text-white" : "bg-gray-200"
          }`}>
          Left
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`px-2 py-1 rounded ${
            editor.isActive({ textAlign: "center" }) ? "bg-black text-white" : "bg-gray-200"
          }`}>
          Center
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`px-2 py-1 rounded ${
            editor.isActive({ textAlign: "right" }) ? "bg-black text-white" : "bg-gray-200"
          }`}>
          Right
        </button>

        {/* Add Link Button */}
        <button
          onClick={() => {
            const url = prompt("Enter the URL");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className="px-2 py-1 rounded bg-gray-200">
          Add Link
        </button>

        {/* Increase Font Size Button */}
        <button onClick={() => changeFontSize(true)} className="px-2 py-1 rounded bg-gray-200">
          Increase Font Size
        </button>

        {/* Decrease Font Size Button */}
        <button onClick={() => changeFontSize(false)} className="px-2 py-1 rounded bg-gray-200">
          Decrease Font Size
        </button>
      </div>
    );
  };

  return (
    <div className="m-3 rounded-lg p-5 bg-sky-800">
      <h2 className="text-2xl text-white font-bold mb-4">Edit About Section, Terms & Privacy Policy</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex justify-items-center">
          <div className="bg-sky-600 w-full p-8 rounded-lg">
            {/* About Us Section */}
            <div className="relative ring-2 ring-white p-2 rounded-lg">
              <h3 className="text-xl text-white mb-2">Edit About Us</h3>

              <div className="absolute text-center top-1 right-4 flex items-center space-x-2">
                {/* droupdown icon */}
                <button
                  onClick={() => {
                    setShowAbout(!showAbout);
                  }}
                  className={`text-white cursor-pointer  text-2xl mr-4 `}>
                  <i
                    className={`fa-solid fa-sort-down transition-transform duration-500 ${
                      showAbout ? "rotate-180" : ""
                    }`}></i>
                </button>
                {/* add droupdown button */}
              </div>
              {showAbout && (
                <div>
                  {editor && <Toolbar editor={editor} />}
                  <p className="text-sm text-white mb-2">
                    [ Use the toolbar above to format and edit the content below. ]
                  </p>
                  <EditorContent editor={editor} className="p-4 border border-gray-300 rounded-lg bg-white" />
                </div>
              )}
            </div>
            {/* Terms and Conditions Section */}
            <div className="mt-8 relative ring-2 ring-white p-2 rounded-lg">
              <h3 className="text-xl text-white mb-2">Edit Terms and Conditions</h3>
              <div className="absolute text-center top-1 right-4 flex items-center space-x-2">
                {/* droupdown icon */}
                <button
                  onClick={() => {
                    setShowTerms(!showTerms);
                  }}
                  className={`text-white cursor-pointer  text-2xl mr-4 `}>
                  <i
                    className={`fa-solid fa-sort-down transition-transform duration-500 ${
                      showTerms ? "rotate-180" : ""
                    }`}></i>
                </button>
                {/* add droupdown button */}
              </div>
              {showTerms && (
                <div>
                  {termsEditor && <Toolbar editor={termsEditor} />}
                  <p className="text-sm text-white mb-2">
                    [ Use the toolbar above to format and edit the content below. ]
                  </p>
                  <EditorContent editor={termsEditor} className="p-4 border border-gray-300 rounded-lg bg-white" />
                </div>
              )}
            </div>

            {/* Privacy Policy Section */}
            <div className="mt-8 relative ring-2 ring-white p-2 rounded-lg">
              <h3 className="text-xl text-white mb-2">Edit Privacy Policy</h3>
              <div className="absolute text-center top-1 right-4 flex items-center space-x-2">
                {/* droupdown icon */}
                <button
                  onClick={() => {
                    setShowPrivacy(!showPrivacy);
                  }}
                  className={`text-white cursor-pointer  text-2xl mr-4 `}>
                  <i
                    className={`fa-solid fa-sort-down transition-transform duration-500 ${
                      showPrivacy ? "rotate-180" : ""
                    }`}></i>
                </button>
                {/* add droupdown button */}
              </div>
              {showPrivacy && (
                <div>
                  {privacyEditor && <Toolbar editor={privacyEditor} />}
                  <p className="text-sm text-white mb-2">
                    [ Use the toolbar above to format and edit the content below. ]
                  </p>
                  <EditorContent editor={privacyEditor} className="p-4 border border-gray-300 rounded-lg bg-white" />
                </div>
              )}
            </div>

            {/* Contact Info Section */}
            <div className="mt-8 relative ring-2 ring-white p-2 rounded-lg">
              <h3 className="text-xl text-white mb-2">Edit Contact Information</h3>
              <div className="absolute text-center top-1 right-4 flex items-center space-x-2">
                {/* droupdown icon */}
                <button
                  onClick={() => {
                    setShowContact(!showContact);
                  }}
                  className={`text-white cursor-pointer  text-2xl mr-4 `}>
                  <i
                    className={`fa-solid fa-sort-down transition-transform duration-500 ${
                      showContact ? "rotate-180" : ""
                    }`}></i>
                </button>
                {/* add droupdown button */}
              </div>
              {showContact && (
                <div>
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
              )}
            </div>

            {/* Save Button */}
            <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 mt-4 rounded">
              Save All Changes
            </button>

            <div className="mt-8 relative ring-2 ring-white p-2 rounded-lg">
              <h3 className="text-xl text-white mb-2">Edit Categories</h3>
              <div className="absolute text-center top-1 right-4 flex items-center space-x-2">
                {/* droupdown icon */}
                <button
                  onClick={() => {
                    setShowCat(!showCat);
                  }}
                  className={`text-white cursor-pointer  text-2xl mr-4 `}>
                  <i
                    className={`fa-solid fa-sort-down transition-transform duration-500 ${
                      showCat ? "rotate-180" : ""
                    }`}></i>
                </button>
                {/* add droupdown button */}
              </div>
              {showCat && (
                <div>
                  <div className="flex">
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="p-2 rounded-lg"
                      placeholder="Enter new category"
                    />
                    <button onClick={handleAddCategory} className="ml-2 bg-green-500 text-white px-4 py-2 rounded">
                      Add
                    </button>
                  </div>

                  {/* Display Category List */}
                  <div className="grid grid-cols-4 gap-1 mt-4">
                    {categoryList.map((cat, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-200 p-2 rounded">
                        <span>{cat}</span> {/* Directly display the category string */}
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded"
                          onClick={() => handleDeleteCategory(cat)}>
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditPage;
