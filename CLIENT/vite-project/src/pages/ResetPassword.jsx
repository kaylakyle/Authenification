import React, { useState, useRef, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { AppContext } from '../contexts/AppContext';
import { toast } from "react-toastify";

const ResetPassword = () => {

  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)

  const { backendUrl } = useContext(AppContext)
  const navigate = useNavigate()
  const inputRefs = useRef([])

  axios.defaults.withCredentials = true;

  // Move to next input
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  //Backspace support
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  // Paste support
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').slice(0, 6)
    paste.split('').forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char
      }
    })
  }

  //  SEND EMAIL
  const onSubmitEmail = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email }
      )

      if (data.success) {
        toast.success(data.message)
        setIsEmailSent(true)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  }

  //SUBMIT OTP
  const onSubmitOtp = (e) => {
    e.preventDefault()

    const otpArray = inputRefs.current.map(input => input.value)
    const enteredOtp = otpArray.join('')

    if (enteredOtp.length !== 6) {
      return toast.error("Enter valid 6 digit OTP")
    }

    setOtp(enteredOtp)
    setIsOtpSubmitted(true)
  }

  // RESET PASSWORD 
  const onSubmitNewPassword = async (e) => {
    e.preventDefault()

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        { email, otp, newPassword }
      )

      if (data.success) {
        toast.success(data.message)
        navigate('/login')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Bad Request")
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>

      {/*  EMAIL FORM */}
      {!isEmailSent &&
        <form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
          <p className='text-indigo-300 mb-6'>Enter your registered Email Address</p>

          <div className='mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <input
              className='bg-transparent outline-none text-white w-full'
              type='email'
              placeholder='Email Id'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>
            Submit
          </button>
        </form>
      }

      {/*  OTP FORM  */}
      {!isOtpSubmitted && isEmailSent &&
        <form onSubmit={onSubmitOtp} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Enter OTP</h1>
          <p className='text-indigo-300 mb-6'>Enter the 6 digit code sent to your email</p>

          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                required
                ref={(el) => inputRefs.current[index] = el}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
              />
            ))}
          </div>

          <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>
            Submit
          </button>
        </form>
      }

      {/*  NEW PASSWORD FORM  */}
      {isOtpSubmitted &&
        <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
          <p className='text-indigo-300 mb-6'>Enter your New Password</p>

          <div className='mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <input
              className='bg-transparent outline-none text-white w-full'
              type='password'
              placeholder='Password'
              required
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
          </div>

          <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>
            Submit
          </button>
        </form>
      }

    </div>
  )
}

export default ResetPassword