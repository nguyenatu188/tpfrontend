import React from 'react'
import { FaArrowCircleLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <>
      <div className="h-screen bg-cover bg-center" style={{ backgroundImage: "url('/src/assets/authBG.png')" }}>
        <Link to="/">
          <FaArrowCircleLeft className='text-[#1A77F2] mx-5 w-[40px] h-[40px] hover:text-[#1899d6] cursor-pointer transition'/>
        </Link>
        <div className="flex flex-col items-center justify-center h-full gap-5">
          <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box">
            <legend className="text-[#1A77F2] text-3xl font-bold fieldset-legend">Login</legend>
            
            <label className="fieldset-label">Email</label>
            <input type="email" className="input" placeholder="Email" />
            
            <label className="fieldset-label">Password</label>
            <input type="password" className="input" placeholder="Password" />

            <p className='mt-2'>Forgot your password?</p>
            
            <button className="btn btn-neutral mt-4">Login</button>
          </fieldset>

          <div className='divider divider-neutral w-72 mx-auto text-[#1A77F2] font-bold'>OR</div>

          <div className='flex flex-col gap-4'>
            <button className="btn bg-white text-black border-[#e5e5e5]">
              <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
              Login with Google
            </button>

            <button className="btn bg-[#1A77F2] text-white border-[#005fd8]">
              <svg aria-label="Facebook logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="white" d="M8 12h5V8c0-6 4-7 11-6v5c-4 0-5 0-5 3v2h5l-1 6h-4v12h-6V18H8z"></path></svg>
              Login with Facebook
            </button>
          </div>

        </div>
      </div>
    </>
  )
}

export default Login
