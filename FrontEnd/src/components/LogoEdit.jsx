import React, { useEffect, useState } from 'react';
import { ref, onValue, update, remove, set } from 'firebase/database';
import { database, getDownloadURL, storage, storageRef, uploadBytes } from '../firebase';

function LogosEdit() {
  const [logos, setLogos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [fileError, setFileError] = useState("");
  
  // Open modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCompanyName("");
    setLogoFile(null);
    setFileError("");
  };

  // Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (file) {
      if (!allowedTypes.includes(file.type)) {
        setFileError("Invalid file type. Only JPG, PNG, and GIF are allowed.");
        e.target.value = null; // Clear the input field
        return;
      }
      if (file.size > maxSize) {
        setFileError("File size exceeds 2MB. Please upload a smaller file.");
        e.target.value = null; // Clear the input field
        return;
      }
      setFileError(null); // Clear error if file is valid
      setLogoFile(file);
    }
  };

  // Upload logo to Firebase
  const uploadLogo = async () => {
    if (!logoFile) return;

    const logoStorageRef = storageRef(storage, `companyLogos/${companyName}-${logoFile.name}`);
    await uploadBytes(logoStorageRef, logoFile);
    return await getDownloadURL(logoStorageRef);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!companyName || !logoFile) {
      alert("Please enter company name and upload a logo");
      return;
    }

    try {
      const logoURL = await uploadLogo();
      if (logoURL) {
        await set(ref(database, `logos/${companyName}`), { logoUrl: logoURL ,approved:true});
        closeModal();
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Failed to upload logo");
    }
  };

  useEffect(() => {
    // Reference to the 'logos' path in the database
    const logosRef = ref(database, 'logos');

    // Listen for data changes in 'logos'
    onValue(logosRef, (snapshot) => {
      const logosData = snapshot.val();
      if (logosData) {
        // Convert the logos data into an array with the key included
        const logosArray = Object.keys(logosData).map(key => ({
          id: key,
          ...logosData[key]
        }));
        setLogos(logosArray);
      }
    });
  }, []);

  // Function to update the approval status of a logo
  const handleApprovalStatus = (logoId, status) => {
    const logoRef = ref(database, `logos/${logoId}`);
    update(logoRef, { approved: status })
      .then(() => alert("Status Updated"))
      .catch(error => console.error("Error updating status:", error));
  };

  // Function to delete a logo
  const handleDelete = (logoId) => {
    const logoRef = ref(database, `logos/${logoId}`);
    remove(logoRef)
      .then(() => console.log(`Logo ${logoId} deleted`))
      .catch(error => console.error("Error deleting logo:", error));
  };

  return (
    <div className="p-4 ">
      <div className='flex justify-between'>
      <h1 className="text-2xl font-bold text-white font-roboto mb-4">Logo Gallery</h1>
      <button
        onClick={openModal}
        className="bg-sky-400 text-white px-4 py-2 rounded-md"
      >
        Add 
      </button></div>
      <div className='grid grid-cols-5 gap-4'>
      {logos.length > 0 ? (
        logos.map((logo) => (
          <div key={logo.id} className="items-center text-center ring-white rounded-md ring-2 p-3">
            <div>
              <img src={logo.logoUrl} alt="Company Logo" className="w-50 h-50 object-cover mx-auto rounded" />
              <p className="font-semibold text-white m-1">Company : {logo.id}</p>
              <p className="font-semibold text-white m-1"> Visible : {logo.approved ?logo.approved.toString().toUpperCase():"FALSE"}</p>
            </div>
            <div className="space-x-2 flex justify-between ">
              <button
                onClick={() => handleApprovalStatus(logo.id, true)}
                className="px-4 py-2 bg-green-500 text-white rounded-md"
              >
               <i className="fa-solid fa-check"></i>
              </button>
              <button
                onClick={() => handleApprovalStatus(logo.id, false)}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                <i className="fa-solid fa-x"></i>
              </button>
              <button
                onClick={() => handleDelete(logo.id)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No logos to display</p>
      )}
      </div>
         {/* Modal */}
         {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add Company Logo</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Upload Logo</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded"
                  accept="image/*"
                  required
                />
                {fileError && <p className="text-red-500">{fileError}</p>}
              </div>

              <div className="flex  space-x-2 justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="mr-4 bg-red-600 p-2 rounded text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LogosEdit;
