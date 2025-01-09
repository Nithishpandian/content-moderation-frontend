import React from "react";
import image from "../../../assets/images/landing-img.avif";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
// import { Link } from '@mui/material';

const Register = () => {
  return (
    <main className="bg-slate-200 h-screen flex p-[2%]">
      <section className="w-1/2 rounded-xl flex-1 flex bg-purple-700">
        <div className="relative">
          <img
            src="https://imgs.search.brave.com/dpqDlZ8rISK-eKwGGdXqnPjDfhc11hyh8g8ArFns1pM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvZmVhdHVy/ZWQvY29vbC1hZXN0/aGV0aWMtcGljdHVy/ZXMtMGMwbDVob2t5/NzlzNTl3dS5qcGc"
            alt="sample Image"
            className="w-full h-full object-cover rounded-2xl shadow-md"
          />

          <div className="text-white text-5xl absolute top-5 left-5">
            <h1 className="font-spicy">ACM</h1>
          </div>

          <div className="absolute top-8 right-3">
            <button className="flex text-white font-lexend items-center gap-1">
              <span>Back to website</span> <FaArrowRight />{" "}
            </button>
          </div>
        </div>
      </section>

      <section className="w-1/2 rounded-xl font-lexend flex-1 flex flex-col items-center py-[5%] bg-purple-5">
        <div className="">
          <h1 className="text-black font-spicy text-5xl font-medium ">
            Create an Account
          </h1>
        </div>
        <form action="submit" className="py-[5%] px-[10%] space-y-10">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-[100%] p-2 text-center bg-gray-700 gap-10 text-white"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-[100%] p-2 text-center bg-gray-700 gap-10 text-white"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-[100%] p-2 text-center bg-gray-700 gap-10 text-white"
          />
          <h4 className="text-black">
            Already have an account?
            <Link
              to="/login"
              color="primary"
              className="hover:text-blue-900"
              href="#"
            >
              {" "}
              Login
            </Link>
          </h4>
          <button className="w-full bg-indigo-600 rounded-lg p-2 text-black hover:text-white">
            Create an account
          </button>
        </form>
      </section>
    </main>
  );
};

export default Register;
