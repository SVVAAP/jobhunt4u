import React, { useEffect } from "react";
import { ref, update } from "firebase/database";
import { database } from "../firebase";
import { useJobs } from "../context/jobsContext";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";

function EditePage() {
  const { isLoading, aboutContent, setAboutContent } = useJobs();

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
    },
  });

  useEffect(() => {
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
  };

  const Toolbar = () => (
    <div className="flex space-x-2 mb-4">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive("bold") ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive("italic") ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`px-2 py-1 rounded ${
          editor.isActive("underline") ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        Underline
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`px-2 py-1 rounded ${
          editor.isActive({ textAlign: "left" })
            ? "bg-blue-500 text-white"
            : "bg-gray-200"
        }`}
      >
        Left
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`px-2 py-1 rounded ${
          editor.isActive({ textAlign: "center" })
            ? "bg-blue-500 text-white"
            : "bg-gray-200"
        }`}
      >
        Center
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`px-2 py-1 rounded ${
          editor.isActive({ textAlign: "right" })
            ? "bg-blue-500 text-white"
            : "bg-gray-200"
        }`}
      >
        Right
      </button>
    </div>
  );

  return (
    <div className="p-6 bg-sky-800">
      <h2 className="text-2xl text-white font-bold mb-4">Edit About Section</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-sky-600 p-8">
          {editor && <Toolbar />}
          <EditorContent
            editor={editor}
            className="w-full h-fit p-2 border border-gray-300 rounded-lg bg-white"
          />
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-sky-400"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}

export default EditePage;