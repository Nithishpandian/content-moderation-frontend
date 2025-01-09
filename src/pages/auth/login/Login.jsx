import React from 'react';
import image from "../../../assets/images/landing-img.avif";
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <main className="bg-slate-200 h-screen grid grid-cols-2 gap-3 p-[2%]">
      <section className="rounded-xl flex">
        <div className='relative'>
            <img 
              src="https://imgs.search.brave.com/dpqDlZ8rISK-eKwGGdXqnPjDfhc11hyh8g8ArFns1pM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvZmVhdHVy/ZWQvY29vbC1hZXN0/aGV0aWMtcGljdHVy/ZXMtMGMwbDVob2t5/NzlzNTl3dS5qcGc"
              alt="sample Image" 
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />

            {/* <div className='text-white text-5xl absolute top-5 left-5'>
                <h1 className='font-spicy'>ACM</h1>
            </div>

            <div className='absolute top-8 right-3 font-lexend'>
                <Link to="/" className='flex text-white items-center gap-1'><span>Back to website</span> <FaArrowRight /></Link>
            </div> */}
        </div>
      </section>
      
      <section className=" rounded-xl flex flex-col gap-8 justify-center font-sans py-5 px-20 bg-white relative">
      <div className='text-stone-800 text-5xl absolute top-5 left-5'>
                <h1 className='font-spicy'>ACM</h1>
            </div>

            <div className='absolute top-8 right-3 font-lexend'>
                <Link to="/" className='flex text-stone-800 items-center gap-1'><span>Back to website</span> <FaArrowRight /></Link>
            </div>
        <div className=" flex flex-col gap-1.5">
          <h1 className="text-stone-800 text-4xl font-bold">Welcome back</h1>
          <p className=' text-stone-600 font-medium'>Lorem ipsum dolor sit amet consectetur adipisicing elit. At qui doloremque voluptates quam accusantium ad eligendi maxime iusto nulla ducimus.</p>
        </div>
          <form action="submit" className=' flex flex-col space-y-4 font-lexend'>
                <input type="text" name="username" placeholder='Username'
                className='focus:outline-none py-2 px-4 rounded-md border border-stone-300 text-stone-600 font-medium'
                />
                <input type="password" name="password" placeholder='Password'
                className='focus:outline-none py-2 px-4 rounded-md border border-stone-300 text-stone-600 font-medium'
                />
                <h4 className='text-black py-1'>Didn't have an account? 
                    <Link to="/signup" className='text-indigo-900'> Create</Link> 
                </h4>
                <button className='w-full bg-indigo-600 rounded-md py-[10px] px-4 font-semibold text-stone-50 '>Login</button>
          </form>
      </section>
    </main>
  );
};

export default Login;
