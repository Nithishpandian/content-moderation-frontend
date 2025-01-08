import React, { useState } from "react";
import { FaUpload } from "react-icons/fa";

const UploadVideo = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
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

          {videoUrl && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">
                Your uploaded video
              </h2>
              <div className=" flex items-center justify-center">
                <video
                  src={videoUrl}
                  controls
                  className="w-full max-w-lg rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadVideo;
