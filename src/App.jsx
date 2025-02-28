import { useState } from "react";
import Navbar from "./components/common/Navbar";
import Home from "./pages/home/Home";
import Footer from "./components/common/Footer";
import { Route, Routes } from "react-router-dom";
import UploadVideo from "./pages/UploadVideo";
import AudioCensorFromVideo from "./pages/AudioCensorFromVideo";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className=" py-5 px-6 font-lexend text-[#323232] bg-[#ECEEEE] min-h-screen">
      <Navbar />
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route index path="/upload-video" element={<UploadVideo />} />
        <Route index path="/upload-audio" element={<AudioCensorFromVideo />} />
      </Routes>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
