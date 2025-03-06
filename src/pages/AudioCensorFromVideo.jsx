import { useCallback, useState } from "react";
import axios from "axios";
import { FaUpload } from "react-icons/fa";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function AudioCensorFromVideo() {
  const [video, setVideo] = useState(null);
  const [detectedWords, setDetectedWords] = useState([]);
  const [wordIntervals, setWordIntervals] = useState({});
  const [selectedWords, setSelectedWords] = useState(new Set());
  const [censoredVideo, setCensoredVideo] = useState(null);
  const [videopath, setVideopath] = useState(null);
  const [videoName, setVideoName] = useState(""); // State for video file name
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ["video/mp4", "video/mov", "video/webm"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Invalid file type. Please upload an MP4, MOV, or WebM video."
      );
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      // Example: 50MB limit
      toast.error("File size exceeds the 500MB limit.");
      return;
    }
    const videoElement = document.createElement("video");
    videoElement.preload = "metadata";
    videoElement.src = URL.createObjectURL(file);

    videoElement.onloadedmetadata = () => {
      URL.revokeObjectURL(videoElement.src); // Free memory
      if (videoElement.duration > 120) {
        toast.error("Video length should be less than 2 minutes.");
        return;
      }

      setVideo(file);
      setVideoName(file.name);
    };

    // setVideo(file);
    // setVideoName(file.name);
  };

  const handleCheckboxChange = (word) => {
    setSelectedWords((prevSet) => {
      const updatedSet = new Set(prevSet);
      updatedSet.has(word) ? updatedSet.delete(word) : updatedSet.add(word);
      return new Set(updatedSet);
    });
  };

  const handleUpload = async () => {
    if (!video) return toast.error("Please upload a video");

    const formData = new FormData();
    formData.append("file", video);
    setMessage("Uploading video, please wait...");
    const toastId = toast.loading("Uploading video, please wait...");

    try {
      const response = await axios.post(
        "http://localhost:8000/upload/",
        formData
      );

      setDetectedWords(
        response.data.detected_words.map((item) => item.word.trim())
      );
      setWordIntervals(response.data.word_intervals);
      setVideopath(response.data.video_path);
      toast.success("Video uploaded successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload video.");
    } finally {
      setMessage("");
      toast.dismiss(toastId);
    }
  };

  const handleCensorship = async () => {
    setMessage("Processing video, please wait...");
    const toastId = toast.loading("Processing video, please wait...");
    try {
      const response = await axios.post("http://localhost:8000/censor/", {
        words: Array.from(selectedWords),
        word_intervals: wordIntervals, // Send word timestamps directly
        video_path: videopath,
      });
      setCensoredVideo(response.data.video_url);
      toast.success("Succesfully censored the video");
    } catch (error) {
      console.error("Error processing video", error);
      toast.error(error);
    } finally {
      setMessage("");
      toast.dismiss(toastId);
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
    // <div>
    //   <h1>Video Moderation</h1>
    //   <input type="file" accept="video/*" onChange={handleFileChange} />
    //   <button onClick={handleUpload}>Upload</button>
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
          Upload Your Video for Audio Moderation
        </h1>
        <div className=" flex items-center justify-center">
          <p className=" max-w-[850px]">
            Easily upload your video, and our AI-powered system will analyze the
            audio for inappropriate content. Any detected offensive language
            will be automatically muted, ensuring a safe and compliant video.
            Simply drag and drop your video or select it from your device to get
            started!
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
          />
          <div className=" grid grid-cols-2 gap-3">
            <label
              htmlFor="video-upload"
              className=" group flex items-center justify-center gap-2 cursor-pointer bg-[#6875FF] text-white font-semibold py-3 px-6 rounded-full transition duration-500"
            >
              <FaUpload className=" group-hover:mr-5 duration-500" />
              <p>Select a video</p>
            </label>
            <button
              onClick={handleUpload}
              disabled={!video}
              className=" group disabled:opacity-80 flex items-center justify-center gap-2 cursor-pointer bg-[#6875FF] text-white font-semibold py-3 px-6 rounded-full hover:opacity-80 transition duration-500"
            >
              Upload & Moderate
            </button>
          </div>
          {videoName && (
            <p className="text-center text-gray-600 mt-4">
              Selected file: <strong>{videoName}</strong>
            </p>
          )}
        </div>
      </div>

      {/* {censoredVideo && (
        <div>
          <h3>Censored Video:</h3>
          <video controls width="500">
            <source
              src={`http://localhost:8000${censoredVideo}`}
              type="video/mp4"
            />
          </video>
        </div>
      )} */}

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
              />
            </div>
          </div>
          {}
          {}
          {censoredVideo ? (
            <div className="mt-8 bg-white p-4 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
                  Censored Video
                </h2>
                <a
                  href={`http://localhost:8000${censoredVideo}`}
                  download="censored-video.mp4"
                  className="cursor-pointer border border-[#6875FF] bg-[#6875FF] text-sm text-white font-semibold py-2 px-4 rounded-md hover:bg-transparent hover:text-[#6875FF] duration-500"
                >
                  Download Censored Video
                </a>
              </div>
              <div className="flex items-center justify-center">
                <video controls>
                  <source
                    src={`http://localhost:8000${censoredVideo}`}
                    type="video/mp4"
                    className="w-full max-w-lg max-h-[500px] rounded-lg"
                  />
                </video>
              </div>
            </div>
          ) : message === "Processing video, please wait..." ? (
            <div className="mt-8 bg-white p-6 rounded-xl animate-pulse">
              <div className="flex justify-between items-start mb-6">
                <div className="h-7 w-64 bg-gray-300 rounded-xl"></div>
                <div className="h-8 w-32 bg-gray-300 rounded-lg"></div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-full max-w-lg min-h-[500px] bg-gray-300 rounded-lg h-full"></div>
              </div>
            </div>
          ) : detectedWords.length > 0 ? (
            <div className="mt-8 bg-white p-4 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-semibold text-center text-gray-700">
                  Select words to censor
                </h2>
              </div>
              <div className=" flex items-center flex-wrap gap-3 p-4">
                {detectedWords.map((word) => {
                  // Sanitize detected word (remove punctuation and spaces)
                  const sanitizedWord = word
                    .replace(/[^\w\s]/gi, "")
                    .toLowerCase();

                  // Find a matching key in word_intervals by sanitizing both word and key
                  const matchingIntervals = Object.keys(wordIntervals).find(
                    (key) =>
                      key.replace(/[^\w\s]/gi, "").toLowerCase() ===
                      sanitizedWord
                  );

                  return (
                    <div
                      key={word}
                      onClick={() => handleCheckboxChange(word)}
                      className={`border ${
                        selectedWords.has(word)
                          ? "bg-[#6875FF] text-white"
                          : "bg-white text-[#6875FF] hover:bg-slate-50"
                      } border-[#6875FF] font-medium py-2 px-5 rounded cursor-pointer duration-300`}
                    >
                      {word}
                      {matchingIntervals &&
                        wordIntervals[matchingIntervals]?.length > 0 && (
                          <span className="text-stone-400 text-nowrap font-normal text-sm ml-2">
                            (at{" "}
                            {wordIntervals[matchingIntervals]
                              .map(
                                ([start, end]) =>
                                  `[${start.toFixed(2)}s - ${end.toFixed(2)}s]`
                              )
                              .join(", ")}
                            )
                          </span>
                        )}
                    </div>
                  );
                })}
                {/* {detectedWords.map((word) => (
                  <div
                    key={word}
                    onClick={() => handleCheckboxChange(word)}
                    className={` border ${
                      selectedWords.has(word)
                        ? " bg-[#6875FF] text-white"
                        : "bg-white text-[#6875FF] hover:bg-slate-50"
                    } border-[#6875FF] font-medium py-2 px-5 rounded cursor-pointer duration-300`}
                  >
                    {word}{" "}
                    {wordIntervals[word]?.length > 0 && (
                      <span className="text-stone-400 text-nowrap font-normal text-sm ml-2">
                        (at{" "}
                        {wordIntervals[word]
                          .map(([start, end]) => `[${start}s - ${end}s]`)
                          .join(", ")}
                        )
                      </span>
                    )}
                  </div>
                ))} */}
              </div>
              <div className=" flex items-center justify-end">
                <button
                  onClick={handleCensorship}
                  className="cursor-pointer border border-[#6875FF] bg-[#6875FF] text-white font-semibold py-2 px-6 rounded-md hover:opacity-80 duration-500 mt-3"
                >
                  Censor Video
                </button>
              </div>
            </div>
          ) : (
            message === "Uploading video, please wait..." && (
              <div className="mt-8 bg-white p-4 rounded-xl animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-6 w-2/3 bg-gray-300 rounded"></div>
                </div>
                <div className="flex items-center gap-3 p-4">
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className="border border-gray-300 bg-gray-200 font-medium py-2 px-5 rounded cursor-pointer h-10 w-32"
                    ></div>
                  ))}
                </div>
                <div className="flex items-center justify-end">
                  <div className="cursor-pointer border border-gray-300 bg-gray-200 font-semibold py-2 px-6 rounded-md h-10 w-32 mt-3"></div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </motion.div>
  );
}

export default AudioCensorFromVideo;
