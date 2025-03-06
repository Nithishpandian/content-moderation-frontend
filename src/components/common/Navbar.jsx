import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className=" border border-[#e1e1e1] bg-white rounded-full py-4 px-10 flex items-center justify-between">
      <h1 className=" font-black text-4xl">ACM</h1>
      <div className=" flex items-center gap-7 font-medium">
        <Link to={"/"} className=" hover:opacity-80 duration-300">
          Home
        </Link>
        <Link to={"/upload-video"} className=" hover:opacity-80 duration-300">
          Video blur
        </Link>
        <Link to={"/upload-audio"} className=" hover:opacity-80 duration-300">
          Audio Censor
        </Link>
        <Link to={"/upload-copy"} className=" hover:opacity-80 duration-300">
          Copy
        </Link>
        <Link to={"#"} className=" hover:opacity-80 duration-300">
          Contact Us
        </Link>
      </div>
      <div className=" flex items-center gap-3">
        {/* <button className="group/button overflow-hidden relative py-[10px] px-5 rounded-full font-medium  bg-[#ECEEEE] ">
          <div className="duration-300 group-hover/button:-translate-y-8 ">
            Login
          </div>
          <div className="absolute invisible duration-300 group-hover/button:-translate-y-6 group-hover/button:visible">
            Login
          </div>
        </button>
        <button className="group/button overflow-hidden relative py-[10px] px-5 rounded-full font-medium bg-[#323232] text-[#ECEEEE] ">
          <div className="duration-300 group-hover/button:-translate-y-8 ">
            Sign Up
          </div>
          <div className="absolute invisible duration-300  group-hover/button:-translate-y-6 group-hover/button:visible">
            Sign Up
          </div>
        </button> */}
        <button className="group/button overflow-hidden relative py-[10px] px-5 rounded-full font-medium border border-[#323232] bg-white text-[#323232] ">
          <div className="duration-300 group-hover/button:-translate-y-8 ">
            Logout
          </div>
          <div className="absolute invisible duration-300  group-hover/button:-translate-y-6 group-hover/button:visible">
            Logout
          </div>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
