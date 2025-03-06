import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaUpload } from "react-icons/fa";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const UploadVideo = () => {
  const [video, setVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [message, setMessage] = useState("");
  const [videoName, setVideoName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const abortControllerRef = useRef(null);

  // Cleanup URLs when component unmounts
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (video) URL.revokeObjectURL(URL.createObjectURL(video));
    };
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Allowed file types
    const allowedTypes = ["video/mp4", "video/mov", "video/webm"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Invalid file type. Please upload an MP4, MOV, or WebM video."
      );
      return;
    }

    // File size validation (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size exceeds the 50MB limit.");
      return;
    }

    // Create a video element to check duration
    const videoElement = document.createElement("video");
    videoElement.preload = "metadata";
    
    // Use createObjectURL for better performance
    const objectUrl = URL.createObjectURL(file);
    videoElement.src = objectUrl;

    videoElement.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl); // Free memory

      // Video length validation (less than 2 minutes)
      if (videoElement.duration > 120) {
        toast.error("Video length should be less than 2 minutes.");
        return;
      }

      // If all checks pass, set the video
      setVideo(file);
      setVideoName(file.name);
      setVideoUrl("");
      
      // Reset the progress when a new file is selected
      setProgress(0);
    };
  };

  const handleUpload = async () => {
    if (!video) {
      setMessage("Please select a video file");
      return toast.error("Please upload a video");
    }

    // Create a new AbortController for this request
    abortControllerRef.current = new AbortController();
    
    const formData = new FormData();
    formData.append("video", video);

    const toastId = toast.loading("Processing video, please wait...");
    setIsProcessing(true);
    setProgress(0);
    
    try {
      setMessage("Processing video, please wait...");

      // Simulated progress for better user experience
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 1000);

      const response = await axios.post(
        "http://localhost:3001/videos/analyze",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          responseType: "blob", // Expect binary video data
          signal: abortControllerRef.current.signal,
          onUploadProgress: (progressEvent) => {
            const uploadPercentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            // Only update for upload progress (0-30%)
            setProgress(Math.min(30, uploadPercentage));
          }
        }
      );

      clearInterval(progressInterval);
      setProgress(100);

      if (response.data.size === 0) {
        setMessage("No explicit content detected.");
        toast.success("No explicit content detected.");
        return;
      }

      const blob = new Blob([response.data], { type: "video/mp4" });
      
      // Revoke previous URL to prevent memory leaks
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      
      const url = URL.createObjectURL(blob);

      setMessage("Video processed successfully.");
      toast.success("Video processed successfully.");
      setVideoUrl(url);
    } catch (error) {
      if (axios.isCancel(error)) {
        setMessage("Upload canceled");
        toast.error("Upload canceled");
      } else {
        setMessage("Error uploading video");
        toast.error("Error uploading video");
        console.error(error);
      }
    } finally {
      setIsProcessing(false);
      toast.dismiss(toastId);
    }
  };

  const cancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsProcessing(false);
      setProgress(0);
      toast.error("Upload canceled");
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={sectionVariants}
      viewport={{
        once: true,
      }}
      className=" text-center flex flex-col gap-10 py-20 px-14"
    >
      <div className=" flex flex-col gap-5">
        <h1 className=" text-5xl font-bold">
          Upload Your Video for Safe Viewing
        </h1>
        <div className=" flex items-center justify-center">
          <p className=" max-w-[850px]">
            Upload your video, and our AI-powered system will automatically
            detect and blur any inappropriate content. Ensure your videos meet
            safety and compliance standards with our seamless moderation
            process. Simply drag and drop or select a file to begin.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-5">
        <div className=" border border-stone-300 bg-[#fafafa] p-10 rounded-xl w-full max-w-2xl">
          <h1 className="text-2xl font-bold text-center mb-4">
            Select videos to upload
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Or drag and drop video files
          </p>

          <input
            type="file"
            accept="video/*"
            id="video-upload"
            className="hidden"
            onChange={handleFileChange}
            disabled={isProcessing}
          />
          <div className=" grid grid-cols-2 gap-3">
            <label
              htmlFor="video-upload"
              className={`group flex items-center justify-center gap-2 cursor-pointer bg-[#6875FF] text-white font-semibold py-3 px-6 rounded-full transition duration-500 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FaUpload className=" group-hover:mr-5 duration-500" />
              <p>Select a video</p>
            </label>
            {isProcessing ? (
              <button
                onClick={cancelUpload}
                className="group flex items-center justify-center gap-2 cursor-pointer bg-red-500 text-white font-semibold py-3 px-6 rounded-full hover:opacity-80 transition duration-500"
              >
                Cancel
              </button>
            ) : (
              <button
                onClick={handleUpload}
                disabled={!video || isProcessing}
                className=" group disabled:opacity-80 flex items-center justify-center gap-2 cursor-pointer bg-[#6875FF] text-white font-semibold py-3 px-6 rounded-full hover:opacity-80 transition duration-500"
              >
                Upload & Blur Content
              </button>
            )}
          </div>
          {videoName && (
            <p className="text-center text-gray-600 mt-4">
              Selected file: <strong>{videoName}</strong>
            </p>
          )}
          
          {isProcessing && (
            <div className="mt-4">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#6875FF] transition-all duration-300 ease-in-out" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{progress}% Complete</p>
            </div>
          )}
        </div>
      </div>
      {video && (
        <div className=" grid grid-cols-2 gap-16">
          <div className="mt-8 flex flex-col bg-white p-4 rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
                Your uploaded video
              </h2>
            </div>
            <div className=" flex items-center justify-center">
              <video
                src={URL.createObjectURL(video)}
                controls
                className="w-full max-w-lg max-h-[500px] rounded-lg"
                preload="metadata"
              />
            </div>
          </div>
          {message === "Processing video, please wait..." && (
            <div className="mt-8 bg-white p-6 rounded-xl animate-pulse">
              <div className="flex justify-between items-start mb-6">
                <div className="h-7 w-64 bg-gray-300 rounded-xl"></div>
                <div className="h-8 w-32 bg-gray-300 rounded-lg"></div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-full max-w-lg min-h-[500px] bg-gray-300 rounded-lg h-full"></div>
              </div>
            </div>
          )}
          {videoUrl && (
            <div className="mt-8 bg-white p-4 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
                  Moderated Video
                </h2>
                <a
                  href={videoUrl}
                  download="blurred-video.mp4"
                  className="cursor-pointer border border-[#6875FF] bg-[#6875FF] text-sm text-white font-semibold py-2 px-4 rounded-md hover:bg-transparent hover:text-[#6875FF] duration-500"
                >
                  Download Moderated Video
                </a>
              </div>
              <div className="flex items-center justify-center">
                <video
                  src={videoUrl}
                  controls
                  className="w-full max-w-lg max-h-[500px] rounded-lg"
                  preload="metadata"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
export default UploadVideo;

// import React, { useState } from "react";
// import axios from "axios";
// import { FaUpload } from "react-icons/fa";
// import toast from "react-hot-toast";
// import { motion } from "framer-motion";

// const UploadVideo = () => {
//   const [video, setVideo] = useState(null);
//   const [videoUrl, setVideoUrl] = useState(null);
//   const [message, setMessage] = useState("");
//   const [videoName, setVideoName] = useState(""); // State for video file name

//   // const handleFileChange = (event) => {
//   //   const file = event.target.files[0];
//   //   if (file) {
//   //     setVideo(file);
//   //     setVideoName(file.name); // Set file name
//   //     setVideoUrl("");
//   //   }
//   // };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     // Allowed file types
//     const allowedTypes = ["video/mp4", "video/mov", "video/webm"];
//     if (!allowedTypes.includes(file.type)) {
//       toast.error(
//         "Invalid file type. Please upload an MP4, MOV, or WebM video."
//       );
//       return;
//     }

//     // File size validation (50MB limit)
//     if (file.size > 50 * 1024 * 1024) {
//       toast.error("File size exceeds the 50MB limit.");
//       return;
//     }

//     // Create a video element to check duration
//     const videoElement = document.createElement("video");
//     videoElement.preload = "metadata";
//     videoElement.src = URL.createObjectURL(file);

//     videoElement.onloadedmetadata = () => {
//       URL.revokeObjectURL(videoElement.src); // Free memory

//       // Video length validation (less than 2 minutes)
//       if (videoElement.duration > 120) {
//         toast.error("Video length should be less than 2 minutes.");
//         return;
//       }

//       // If all checks pass, set the video
//       setVideo(file);
//       setVideoName(file.name);
//       setVideoUrl("");
//     };
//   };

//   const handleUpload = async () => {
//     if (!video) {
//       setMessage("Please select a video file");
//       return toast.error("Please upload a video");
//     }

//     const formData = new FormData();
//     formData.append("video", video);

//     const toastId = toast.loading("Processing video, please wait...");
//     try {
//       setMessage("Processing video, please wait...");

//       const response = await axios.post(
//         "http://localhost:3001/videos/analyze",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//           responseType: "blob", // Expect binary video data
//         }
//       );

//       if (response.data.size === 0) {
//         setMessage("No explicit content detected.");
//         toast.success("No explicit content detected.");
//         return;
//       }

//       const blob = new Blob([response.data], { type: "video/mp4" });
//       const url = URL.createObjectURL(blob);

//       setMessage("Video processed successfully.");
//       toast.success("Video processed successfully.");
//       setVideoUrl(url);
//     } catch (error) {
//       setMessage("Error uploading video");
//       toast.error("Error uploading video");
//       console.error(error);
//     } finally {
//       toast.dismiss(toastId);
//     }
//   };

//   const sectionVariants = {
//     hidden: { opacity: 0, y: 50 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.8, ease: "easeOut" },
//     },
//   };

//   return (
//     <motion.div
//       initial="hidden"
//       whileInView="visible"
//       variants={sectionVariants}
//       viewport={{
//         once: true,
//       }}
//       className=" text-center flex flex-col gap-10 py-20 px-14"
//     >
//       <div className=" flex flex-col gap-5">
//         <h1 className=" text-5xl font-bold">
//           Upload Your Video for Safe Viewing
//         </h1>
//         <div className=" flex items-center justify-center">
//           <p className=" max-w-[850px]">
//             Upload your video, and our AI-powered system will automatically
//             detect and blur any inappropriate content. Ensure your videos meet
//             safety and compliance standards with our seamless moderation
//             process. Simply drag and drop or select a file to begin.
//           </p>
//         </div>
//       </div>
//       <div className="flex flex-col items-center justify-center p-5">
//         <div className=" border border-stone-300 bg-[#fafafa] p-10 rounded-xl w-full max-w-2xl">
//           <h1 className="text-2xl font-bold text-center mb-4">
//             Select videos to upload
//           </h1>
//           <p className="text-center text-gray-500 mb-6">
//             Or drag and drop video files
//           </p>

//           <input
//             type="file"
//             accept="video/*"
//             id="video-upload"
//             className="hidden"
//             onChange={handleFileChange}
//           />
//           <div className=" grid grid-cols-2 gap-3">
//             <label
//               htmlFor="video-upload"
//               className=" group flex items-center justify-center gap-2 cursor-pointer bg-[#6875FF] text-white font-semibold py-3 px-6 rounded-full transition duration-500"
//             >
//               <FaUpload className=" group-hover:mr-5 duration-500" />
//               <p>Select a video</p>
//             </label>
//             <button
//               onClick={handleUpload}
//               disabled={!video}
//               className=" group disabled:opacity-80 flex items-center justify-center gap-2 cursor-pointer bg-[#6875FF] text-white font-semibold py-3 px-6 rounded-full hover:opacity-80 transition duration-500"
//             >
//               {/* Upload & Process */}
//               Upload & Blur Content
//             </button>
//           </div>
//           {videoName && (
//             <p className="text-center text-gray-600 mt-4">
//               Selected file: <strong>{videoName}</strong>
//             </p>
//           )}
//         </div>
//       </div>
//       {/*  */}
//       {/* <p>{message}</p> */}
//       {video && (
//         <div className=" grid grid-cols-2 gap-16">
//           <div className="mt-8 flex flex-col bg-white p-4 rounded-xl">
//             <div className="flex justify-between items-start mb-4">
//               <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
//                 Your uploaded video
//               </h2>
//             </div>
//             <div className=" flex items-center justify-center">
//               <video
//                 src={URL.createObjectURL(video)}
//                 controls
//                 className="w-full max-w-lg max-h-[500px] rounded-lg"
//               />
//             </div>
//           </div>
//           {message === "Processing video, please wait..." && (
//             <div className="mt-8 bg-white p-6 rounded-xl animate-pulse">
//               <div className="flex justify-between items-start mb-6">
//                 <div className="h-7 w-64 bg-gray-300 rounded-xl"></div>
//                 <div className="h-8 w-32 bg-gray-300 rounded-lg"></div>
//               </div>
//               <div className="flex items-center justify-center">
//                 <div className="w-full max-w-lg min-h-[500px] bg-gray-300 rounded-lg h-full"></div>
//               </div>
//             </div>
//           )}
//           {videoUrl && (
//             <div className="mt-8 bg-white p-4 rounded-xl">
//               <div className="flex justify-between items-start mb-4">
//                 <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
//                   Moderated Video
//                 </h2>
//                 <a
//                   href={videoUrl}
//                   download="blurred-video.mp4"
//                   className="cursor-pointer border border-[#6875FF] bg-[#6875FF] text-sm text-white font-semibold py-2 px-4 rounded-md hover:bg-transparent hover:text-[#6875FF] duration-500"
//                 >
//                   Download Moderated Video
//                 </a>
//               </div>
//               <div className="flex items-center justify-center">
//                 <video
//                   src={videoUrl}
//                   controls
//                   className="w-full max-w-lg max-h-[500px] rounded-lg"
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </motion.div>
//   );
// };
// export default UploadVideo;
