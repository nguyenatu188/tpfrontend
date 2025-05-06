import React, { useState } from 'react'
import { FaArrowCircleLeft } from "react-icons/fa"
import { Link } from 'react-router-dom'
import useRegister from '../hooks/auth/useRegister'

const Register = () => {
  const { register, isLoading } = useRegister()
  const [inputs, setInputs] = useState({
    fullname: '',
    username: '',
    email: '',
    gender: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInputs(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    register(inputs)
  }

  return (
    <div className="h-screen bg-cover bg-centerk relative" style={{ backgroundImage: "url('/src/assets/authBG.png')" }}>
      <Link to="/">
        <FaArrowCircleLeft className='text-[#1A77F2] absolute top-5 mx-5 w-[40px] h-[40px] hover:text-[#1899d6] cursor-pointer transition' />
      </Link>

      <div className="flex flex-col items-center justify-center h-full gap-5">
        <form onSubmit={handleSubmit}>
          <fieldset className="fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box relative">
            <legend className="text-[#3e8cf1] text-3xl absolute top-[-50px] font-bold fieldset-legend">Register</legend>

            <label className="fieldset-label">Email</label>
            <input
              type="email"
              name="email"
              className="input"
              placeholder="Email"
              value={inputs.email}
              onChange={handleChange}
              required
            />

            <label className="fieldset-label">Full name</label>
            <input
              type="text"
              name="fullname"
              className="input"
              placeholder="Full name"
              value={inputs.fullname}
              onChange={handleChange}
              required
            />

            <label className="fieldset-label">Username</label>
            <input
              type="text"
              name="username"
              className="input"
              placeholder="Username"
              value={inputs.username}
              onChange={handleChange}
              required
            />

            <label className="fieldset-label">Password</label>
            <input
              type="password"
              name="password"
              className="input"
              placeholder="Password"
              value={inputs.password}
              onChange={handleChange}
              required
            />

            <div className='flex items-center justify-between gap-2 mt-4'>
              <div className='flex items-center gap-2'>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={inputs.gender === 'male'}
                  onChange={handleChange}
                  className="radio radio-info"
                />
                <p className='text-lg'>Male</p>
              </div>
              <div className='flex items-center gap-2'>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={inputs.gender === 'female'}
                  onChange={handleChange}
                  className="radio radio-info"
                />
                <p className='text-lg'>Female</p>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-neutral mt-4 w-full"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  )
}

export default Register
