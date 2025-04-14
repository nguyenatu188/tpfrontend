import React from 'react'
import { FaFacebookSquare, FaInstagram } from "react-icons/fa"

const Footer = () => {
  return (
    <>
      <div className='max-w-7xl mx-auto p-4 flex justify-between items-center'>
        <p className='text-4xl font-jembrush'>TripPlanner</p>
        <div className='flex gap-4'>
          <a 
            href="https://www.facebook.com/share/g/1FuaxF4EhV/"
            target="_blank" 
            rel="noopener noreferrer"
          >
            <FaFacebookSquare 
              className='text-2xl md:text-4xl hover:text-blue-600 hover:scale-125 transition-all duration-200'
            />
          </a>
          <a
            href='https://www.instagram.com/traveloka/'
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaInstagram
              className='text-2xl md:text-4xl hover:text-pink-600 hover:scale-125 transition-all duration-200'
            />
          </a>
        </div>
      </div>
      <div className='max-w-7xl mx-auto divider'></div>
      <div className='max-w-7xl mx-auto p-4 flex justify-between items-center'>
        <p className='text-sm text-gray-500'>© 2025 TripPlanner. All rights reserved.</p>
        <div className='flex items-center gap-4'>
          <a href="#" className='text-gray-500 hover:text-[#1cb0f6]'>Privacy Policy</a>
          <a href="#" className='text-gray-500 hover:text-[#1cb0f6]'>Terms of Service</a>
        </div>
      </div>
    </>
  )
}

export default Footer
