import React, { useState } from "react";
import axios from "axios";

function VideoUploadCopyright() {
  const [videoFile, setVideoFile] = useState(null);
  const [message, setMessage] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVideoChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!videoFile) {
      setMessage("Please select a video to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile); // Ensure the key matches multer

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/videos/detect-copyright",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const result = response.data;
      setLoading(false);

      setMessage(result.message);
      if (result.tracks) {
        setDetails(
          result.tracks
            .map((track) => `${track.title} - ${track.artist}`)
            .join(", ")
        );
      } else {
        setDetails("");
      }
    } catch (error) {
      setLoading(false);
      setMessage("Error occurred while uploading video.");
    }
  };

  return (
    <div className="upload-container">
      <h1>Upload Your Video</h1>

      <form onSubmit={handleUpload} encType="multipart/form-data">
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload Video"}
        </button>
      </form>

      {message && (
        <div className="message">
          <h2>{message}</h2>
          {details && (
            <p>
              <strong>Details:</strong> {details}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default VideoUploadCopyright;
