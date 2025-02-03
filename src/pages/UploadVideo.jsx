import React, { useState, useRef } from "react";
import axios from "axios";
import { FaUpload } from "react-icons/fa";

const UploadVideo = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [moderationResults, setModerationResults] = useState(null);
  const [moderatedVideoUrl, setModeratedVideoUrl] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const videoRef = useRef(null);

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // Validate file size (30MB = 30 * 1024 * 1024 bytes)
      if (file.size > 30 * 1024 * 1024) {
        alert("Please upload a video smaller than 30MB.");
        return;
      }

      const videoElement = document.createElement("video");
      videoElement.src = URL.createObjectURL(file);

      videoElement.onloadedmetadata = async () => {
        // Validate video duration (max 2 minutes)
        if (videoElement.duration > 120) {
          alert("Please upload a video shorter than 2 minutes.");
          return;
        }

        // If valid, proceed with file upload
        setVideoFile(URL.createObjectURL(file));
        setError(null);
        setUploading(true);
        setModerationResults(null);

        const formData = new FormData();
        formData.append("video", file);

        try {
          const response = await axios.post(
            "http://localhost:3001/upload-video",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          const { jobId } = response.data;

          // Poll for results
          const result = await fetchModerationResults(jobId);
          setModerationResults(result);
          // getModeratedVideo();
        } catch (error) {
          setError(
            "Error uploading or processing the video. Please try again."
          );
          console.error(error);
        } finally {
          setUploading(false);
        }
      };
    }
  };

  const fetchModerationResults = async (jobId) => {
    try {
      let status = "IN_PROGRESS";
      let result = null;

      while (status === "IN_PROGRESS") {
        const response = await axios.get(
          `http://localhost:3001/moderation-results/${jobId}`
        );
        status = response.data.JobStatus;

        if (status === "SUCCEEDED") {
          result = response.data;
        }

        await new Promise((r) => setTimeout(r, 10000)); // Poll every 10 seconds
      }
      return result;
    } catch (error) {
      setError("Error fetching moderation results. Please try again.");
      console.error(error);
    }
  };

  const getModeratedVideo = async () => {
    try {
      // Extract unique timestamps from moderation results
      const timestamps = [
        ...new Set(
          moderationResults.ModerationLabels.map((label) => label.Timestamp)
        ),
      ];

      // Send request to generate the moderated video
      const response = await axios.post(
        "http://localhost:3001/generate-moderated-video",
        {
          videoKey: moderationResults.Video.S3Object.Name,
          timestamps,
        }
      );

      if (response.status === 200) {
        // Set the moderated video URL directly from the response
        const { moderatedVideoUrl } = response.data;
        setModeratedVideoUrl(moderatedVideoUrl);
        console.log("Moderated video generated successfully!");
      }
    } catch (error) {
      setError("Error generating moderated video. Please try again.");
      console.error(error);
    }
  };

  const jumpToTimestamp = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  };

  const filteredResults = () => {
    const seenTimestamps = new Set();

    const uniqueResults = moderationResults.ModerationLabels.filter((label) => {
      if (seenTimestamps.has(label.Timestamp)) {
        return false;
      }
      seenTimestamps.add(label.Timestamp);
      return true;
    });

    if (filter === "All") return uniqueResults;
    return uniqueResults.filter(
      (label) => label.ModerationLabel.Name === filter
    );
  };

  const getTaxonomyDescription = (level) => {
    switch (level) {
      case 1:
        return "General category of inappropriate content (e.g., Violence, Nudity)";
      case 2:
        return "More specific subcategory under a general category (e.g., Physical Violence, Sexual Content)";
      case 3:
        return "Highly detailed and specific category (e.g., Blood & Gore, Explicit Nudity)";
      default:
        return "No taxonomy level provided.";
    }
  };

  return (
    <div className=" text-center flex flex-col gap-10 py-24 px-14">
      <div className=" flex flex-col gap-5">
        <h1 className=" text-5xl font-bold">Video Moderation Made Easy</h1>
        <div className=" flex items-center justify-center">
          <p className=" max-w-[850px]">
            Upload your video effortlessly and let our AI-powered system analyze
            and moderate the content for safety and compliance. Simply drag and
            drop your video or select it from your device to begin. Experience a
            fast, reliable, and secure moderation process to ensure your content
            meets global standards.
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
            onChange={handleVideoUpload}
          />
          <label
            htmlFor="video-upload"
            className=" group flex items-center justify-center gap-2 cursor-pointer bg-[#6875FF] text-white font-semibold py-3 px-6 rounded-full transition duration-500"
          >
            <FaUpload className=" group-hover:mr-5 duration-500" />
            <p>Upload video for free</p>
          </label>
        </div>
      </div>
      {uploading && (
        <p className="text-blue-500">Uploading and processing the video...</p>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {videoFile && (
        <div className=" grid grid-cols-2 gap-16">
          <div className="mt-8 flex flex-col gap-4 bg-white p-4 rounded-xl">
              <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
                Your uploaded video
              </h2>
              <div className=" flex flex-col gap-2">
                <div className=" flex items-center justify-center">
                  <button
                    onClick={getModeratedVideo}
                    className=" cursor-pointer border border-[#6875FF] bg-[#6875FF] text-white font-semibold py-2 px-4 text-sm rounded-lg hover:bg-transparent hover:text-[#6875FF] duration-500"
                  >
                    Generate the moderated video
                  </button>
                </div>
              </div>
            </div>
            <div className=" flex items-center justify-center">
              <video
                ref={videoRef}
                src={videoFile}
                controls
                className="w-full max-w-lg max-h-[600px] rounded-lg"
              />
            </div>
          </div>
          {moderatedVideoUrl && (
            <div className="mt-8 bg-white p-4 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
                  Moderated Video
                </h2>
                <a
                  href={moderatedVideoUrl}
                  download="moderated_video.mp4"
                  className="cursor-pointer border border-[#6875FF] bg-[#6875FF] text-sm text-white font-semibold py-2 px-4 rounded-md hover:bg-transparent hover:text-[#6875FF] duration-500"
                >
                  Download Moderated Video
                </a>
              </div>
              <div className="flex items-center justify-center">
                <video
                  src={moderatedVideoUrl}
                  controls
                  className="w-full max-w-lg max-h-[600px] rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {moderationResults && (
        <div className="">
          <h2 className="text-xl font-semibold mb-4">Moderation Results:</h2>

          {uploading && (
            <p className="text-blue-500 mt-4">
              Generating the moderated video... Please wait.
            </p>
          )}
          {error && <p className="text-red-500 mt-4">{error}</p>}

          <div className="flex justify-between items-center mb-4">
            <label htmlFor="filter" className="font-medium">
              Filter by Category:
            </label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded p-2"
            >
              <option value="All">All</option>
              {[
                ...new Set(
                  moderationResults.ModerationLabels.map(
                    (label) => label.ModerationLabel.Name
                  )
                ),
              ].map((category, idx) => (
                <option key={idx} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {filteredResults().length > 0 ? (
            <ul className="text-left grid grid-cols-2 gap-3">
              {filteredResults().map((label, idx) => (
                <li key={idx} className="bg-white rounded-md py-5 px-5">
                  <strong>Label:</strong> {label.ModerationLabel.Name} <br />
                  <strong>Parent Category:</strong>{" "}
                  {label.ModerationLabel.ParentName || "N/A"} <br />
                  <strong>Confidence:</strong>{" "}
                  {label.ModerationLabel.Confidence.toFixed(2)}% <br />
                  <strong>Timestamp:</strong>{" "}
                  {label.Timestamp ? (
                    <>
                      <button
                        onClick={() => jumpToTimestamp(label.Timestamp / 1000)}
                        className="text-blue-500 underline"
                      >
                        {label.Timestamp / 1000}s
                      </button>
                    </>
                  ) : (
                    "N/A"
                  )}
                  <br />
                  <strong>Taxonomy Level:</strong>{" "}
                  {label.ModerationLabel.TaxonomyLevel} <br />
                  <strong>Explanation:</strong>{" "}
                  {getTaxonomyDescription(label.ModerationLabel.TaxonomyLevel)}
                </li>
              ))}
            </ul>
          ) : (
            <p>No inappropriate content detected for the selected filter.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadVideo;
