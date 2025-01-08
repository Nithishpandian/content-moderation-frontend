import React, { useState } from "react";
import { Link } from "react-router-dom";
import landingImg from "../../assets/images/landing-img.avif";
import landingImg2 from "../../assets/images/landing-img-2.jpg";
import { FaArrowRightLong } from "react-icons/fa6";
import { HiOutlinePlus, HiOutlineMinus } from "react-icons/hi2";

const Home = () => {
  const [activeFAQ, setActiveFAQ] = useState(null); // state to manage active FAQ

  const howToUseData = [
    {
      title: "Upload Your Video",
      description:
        "Select the video you want to moderate and upload it to our platform. You can drag and drop your file into the application for quick and easy access.",
    },
    {
      title: "AI Analysis",
      description:
        "Our AI analyzes your video in real-time to detect inappropriate or restricted content. The process is fast, accurate, and ensures compliance with global standards.",
    },
    {
      title: "Review the Results",
      description:
        "Review the analysis results provided by the AI. You can validate flagged content, make necessary adjustments, and ensure the video meets your platform’s requirements.",
    },
  ];

  const faqContentData = [
    {
      question: "What type of content can your AI moderation system detect ?",
      answer:
        "Our AI system can detect various types of inappropriate content, including explicit language, violence, graphic imagery, hate speech, and other harmful material. It is trained to identify content that violates platform guidelines and global content standards.",
    },
    {
      question: "How does the AI ensure accuracy in content moderation?",
      answer:
        "The AI continuously learns and adapts using advanced machine learning algorithms, analyzing vast amounts of video data to improve detection accuracy. It combines real-time analysis with human oversight to ensure that flagged content is thoroughly reviewed and assessed.",
    },
    {
      question: "Can the AI handle different languages and cultural contexts ?",
      answer:
        "Yes, our AI system is designed to understand and analyze content in multiple languages, considering cultural and contextual differences to ensure accurate moderation. It is built to detect harmful content regardless of the language or region.",
    },
    {
      question: "Is human intervention required in the moderation process ?",
      answer:
        "While the AI handles most of the moderation automatically, human oversight is available to review flagged content. This ensures that nuanced cases or content requiring deeper judgment are addressed effectively, maintaining a balance between automation and human discretion.",
    },
  ];

  const handleFAQClick = (index) => {
    setActiveFAQ((prev) => (prev === index ? null : index)); // toggle FAQ visibility
  };

  return (
    <div className=" flex flex-col gap-40 py-28 px-14">
      <div className=" grid grid-cols-2 gap-24">
        <div className=" flex flex-col gap-6 justify-around">
          <h1 className=" font-extrabold text-6xl">
            Revolutionizing Content Moderation with AI
          </h1>
          <p className="">
            Our AI-powered moderation system ensures safe and compliant video
            content for your platform. It analyzes videos in real-time to detect
            and flag unsuitable material, maintaining global standards. By
            blending automation with human oversight, it delivers an efficient
            and trustworthy solution to safeguard your audience and uphold
            responsible content sharing.
          </p>
          <div>
            <Link
              to={"/upload-video"}
              className=" group duration-500 flex items-center gap-3 bg-[#6875FF] py-3 px-6 rounded-3xl font-medium text-white w-fit"
            >
              <h2 className="group-hover:mr-4 duration-500">Get Started</h2>
              <FaArrowRightLong />
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <img src={landingImg} className=" w-[90%] " alt="" />
        </div>
      </div>
      <div className=" flex flex-col gap-10">
        <h1 className=" text-center text-5xl font-bold">
          How to Use Our Application:
        </h1>
        <div className=" flex items-center justify-between gap-4">
          {howToUseData.map((item, index) => (
            <HowToUseCard
              key={index}
              step={index + 1}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
      <div className=" grid grid-cols-2 gap-20">
        <div className="flex items-center justify-center">
          <img src={landingImg2} className=" rounded-xl " alt="" />
        </div>
        <div className=" flex flex-col gap-2 justify-around">
          <h1 className=" font-extrabold text-3xl">
            Detect harmful content with AI-driven moderation
          </h1>
          <div className="flex flex-col gap-2">
            <p>
              Leverage our platform’s advanced AI to efficiently moderate
              content. Our intelligent algorithms learn and adapt, ensuring
              accurate detection of harmful or inappropriate content in
              real-time. By integrating this solution, you can foster a safer,
              more engaging environment, allowing your platform to grow with
              trusted and happy users.
            </p>
            <p>
              Safeguard your online community with technology that evolves as
              fast as the internet. As trends change, our AI continuously adapts
              to maintain compliance and protect your platform from new risks,
              all while providing a seamless user experience.
            </p>
          </div>
        </div>
      </div>
      <div className=" grid grid-cols-3">
        <h1 className=" text-6xl font-black">FAQ</h1>
        <div className=" col-span-2 flex flex-col gap-2 text-xl">
          {faqContentData.map((item, index) => (
            <div
              key={index}
              className={` ${
                activeFAQ === index ? "bg-white" : "bg-[#f9f9f9]"
              }  hover:bg-white duration-500 py-5 px-8 rounded-2xl flex flex-col text-stone-400 cursor-pointer`}
              onClick={() => handleFAQClick(index)}
            >
              <div className="flex items-center justify-between w-full">
                <h2>{item.question}</h2>
                {activeFAQ === index ? (
                  <HiOutlineMinus className="text-4xl text-stone-400" />
                ) : (
                  <HiOutlinePlus className="text-4xl text-stone-400" />
                )}
              </div>
              <div
                className={` ml-4 transition-all duration-300 ease-in-out ${
                  activeFAQ === index
                    ? "max-h-[500px] opacity-100  mt-5 "
                    : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

const HowToUseCard = ({ step, title, description }) => {
  return (
    <div className=" pt-5 pb-8 px-5 bg-white shadow-sm rounded-xl flex flex-col justify-between min-h-80 w-full">
      <div className=" flex flex-col gap-3">
        <h1 className=" font-bold">STEP {step}</h1>
        <h2 className=" font-bold text-2xl">{title}</h2>
      </div>
      <p className=" text-lg">{description}</p>
    </div>
  );
};
