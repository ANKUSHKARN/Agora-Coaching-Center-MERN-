// import { useEffect, useState } from "react";
// import Navbar from "../common/Navbar";
// import { initializeApp } from "firebase/app";
// import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
// import axios from "axios";
// import LoadingSpinner from "../common/loadingSpinner";
// import Item from "../common/Item"; // Adjust the import path as necessary

// const Bank = () => {
//   const [chapters, setChapters] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchSecretsAndInitFirebase = async () => {
//       try {
//         const { data: firebaseConfig } = await axios.get("/api/notes/secrets");
//         initializeApp(firebaseConfig); // Initialize Firebase once
//         fetchChapters(firebaseConfig);
//       } catch (err) {
//         console.error("Error fetching secrets:", err);
//         setError("Failed to initialize Firebase");
//         setLoading(false);
//       }
//     };

//     fetchSecretsAndInitFirebase();
//   }, []);

//   // Fetch files (chapters) from Firebase Cloud Storage within the "notes" folder
//   const fetchChapters = async (firebaseConfig) => {
//     const storage = getStorage();
//     try {
//       const folderRef = ref(storage, 'notes');
//       const res = await listAll(folderRef);

//       const fetchedChapters = await Promise.all(
//         res.items.map(async (itemRef) => {
//           const url = await getDownloadURL(itemRef);
//           const nameWithoutExtension = itemRef.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
//           return { name: nameWithoutExtension, imageUrl: url };
//         })
//       );
//       setChapters(fetchedChapters);
//       setLoading(false);
//     } catch (err) {
//       console.error("Error fetching files from Firebase:", err);
//       setError("Failed to load chapters");
//       setLoading(false);
//     }
//   };

//   // Handle file download
//   const handleDownload = (url, name) => {
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = name;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <LoadingSpinner size="lg" />
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="text-red-500 text-center text-xl">{error}</div>;
//   }

//   return (
//     <>
//       <Navbar />
//       <div className="container mx-auto p-4">
//         <h1 className="text-xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100 sm:text-3xl">Class Notes</h1>
        
//         {/* Table Layout */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full table-auto border-collapse">
//             <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200">
//               <tr>
//                 <th className="px-4 py-2 border-b text-left">Chapter Name</th>
//                 <th className="px-4 py-2 border-b text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {chapters.map((chapter, index) => (
//                 <tr
//                   key={index}
//                   className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
//                   onClick={() => handleDownload(chapter.imageUrl, chapter.name)}
//                 >
//                   <td className="px-4 py-2">{chapter.name}</td>
//                   <td className="px-4 py-2">
//                     <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
//                       Download
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Bank;
















import { useState } from "react";
import Navbar from "../common/Navbar";
import LoadingSpinner from "../common/loadingSpinner";

const Bank = () => {
  // Predefined array of chapter links
  const chapters = [
    { name: "Introduction to Biology", imageUrl: "https://drive.google.com/file/d/1GHzMfOdF4f_o9KkcXrRfUPq3Hos5VjPm/view?usp=drive_link" },
    { name: "Chemistry Basics", imageUrl: "https://drive.google.com/file/d/19EHvqnUaX3Vs6zREMzJ9Say6A4SMtYo6/view?usp=drive_link" },
    { name: "Physics Fundamentals", imageUrl: "https://drive.google.com/file/d/1Lxfk_m5KmtIIjeLvAuip0mAfaDx4eMCV/view?usp=drive_link" },
    { name: "Mathematics for Beginners", imageUrl: "https://drive.google.com/file/d/1feobV-gH4O8P0S_xGsNI0UmPnoD82qlz/view?usp=drive_link" },
    { name: "History of Ancient Civilizations", imageUrl: "https://drive.google.com/file/d/1Kf13dq7hYaiqzg2fCYWLhm90Z_utbC1G/view?usp=drive_link" },
    { name: "Geography Essentials", imageUrl: "https://drive.google.com/file/d/1vYswiNEYkjbuy2wir5ngOvEle_qte4r0/view?usp=drive_link" },
    { name: "Programming 101", imageUrl: "https://drive.google.com/file/d/1y3gucyUtIq80IcEEDw9MMI9MrqGa4F77/view?usp=drive_link" },
  ];

  const [loading, setLoading] = useState(false);

  // Handle file download
  const handleDownload = (url, name) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100 sm:text-3xl">Class Notes</h1>
        
        {/* Table Layout */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-200">
              <tr>
                <th className="px-4 py-2 border-b text-left">Chapter Name</th>
                <th className="px-4 py-2 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {chapters.map((chapter, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handleDownload(chapter.imageUrl, chapter.name)}
                >
                  <td className="px-4 py-2">{chapter.name}</td>
                  <td className="px-4 py-2">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Bank;
