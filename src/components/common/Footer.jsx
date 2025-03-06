import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  const animationVariantFadeIn = {
    initial: {
      opacity: 0,
      y: 0,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOutIn",
      },
    },
  };

  return (
    <motion.div
      variants={animationVariantFadeIn}
      initial="initial"
      whileInView={"animate"}
      viewport={{
        once: true,
      }}
      className=" flex justify-between gap-20 bg-[#323232] py-10 px-16 rounded-3xl"
    >
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
          <Link to={"/"} className=" hover:opacity-80 duration-300">
            Home
          </Link>
          <Link to={"/upload-video"} className=" hover:opacity-80 duration-300">
            Video blur
          </Link>
          <Link to={"/upload-audio"} className=" hover:opacity-80 duration-300">
            Audio Censor
          </Link>
          <Link to={"#"} className=" hover:opacity-80 duration-300">
            Contact Us
          </Link>
        </div>
      </div>
      <div className=" flex flex-col gap-5">
        <h2 className=" text-[#f3f3f3] font-semibold text-lg">Legals</h2>
        <div className=" flex flex-col gap-2 font-medium text-stone-300">
          <Link to={"/"}>Terms & Condition</Link>
          <Link to={"#"}>Privacy policy</Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Footer;
