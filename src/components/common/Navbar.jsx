import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className=" border border-[#e1e1e1] bg-white rounded-full py-4 px-10 flex items-center justify-between">
      <h1 className=" font-black text-4xl">ACM</h1>
      <div className=" flex items-center gap-7 font-medium">
        <Link to={"/"}>Home</Link>
        <Link to={"/upload-video"}>Video blur</Link>
        <Link to={"/upload-audio"}>Audio Censor</Link>
        <Link to={"#"}>Contact Us</Link>
      </div>
      <div className=" flex items-center gap-3">
        <button className=" py-[10px] px-5 rounded-full font-medium  bg-[#ECEEEE]">
          Login
        </button>
        <button className=" py-[10px] px-5 rounded-full font-medium bg-[#323232] text-[#ECEEEE]">
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Navbar;
