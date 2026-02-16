import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
        <img className= 'w-36 h-36 rounded-full mb-6'  />
      <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey Developer</h1>

      <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to our Application</h2>

      <p className='mb-8 maw-w-md'>Let's give you a quick tour of our App and we will have you going in no time</p>
      
      <button className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all'>Get Started</button>
    </div>
  )
}

export default Header

// src = {assets.lynn_logo} alt = "logo"
