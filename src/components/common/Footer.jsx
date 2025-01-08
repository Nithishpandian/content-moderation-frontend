import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className=" flex justify-between gap-20 bg-[#323232] py-10 px-8 rounded-3xl">
      <div className=" flex flex-col gap-5 max-w-[700px]">
        <h1 className=" text-3xl font-bold text-[#f3f3f3]">
          AI Powered Content Moderation
        </h1>
        <p className=" text-stone-400">
          At our platform, we are committed to delivering AI-powered video
          moderation to ensure a safe and enjoyable experience. Our team works
          to provide cutting-edge solutions that uphold global standards while
          maintaining seamless integration.
        </p>
      </div>
      <div className=" flex flex-col gap-5">
        <h2 className=" text-[#f3f3f3] font-semibold text-lg">Links</h2>
        <div className=" flex flex-col gap-2 font-medium text-stone-300">
          <Link to={"/"}>Home</Link>
          <Link to={"/upload-video"}>Content moderation</Link>
          <Link to={"#"}>Use Cases</Link>
          <Link to={"#"}>Contact Us</Link>
        </div>
      </div>
      <div className=" flex flex-col gap-5">
        <h2 className=" text-[#f3f3f3] font-semibold text-lg">Legals</h2>
        <div className=" flex flex-col gap-2 font-medium text-stone-300">
          <Link to={"/"}>Terms & Condition</Link>
          <Link to={"#"}>Privacy policy</Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
