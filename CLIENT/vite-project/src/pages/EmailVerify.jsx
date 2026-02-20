import React from 'react'

const EmailVerify = () => {
  return (
    <div className='flex items-center justify-center min-h-screen  bg-gradient-to-br from-blue-200 to-purple-400'>

      <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text:sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Verify Email OTP</h1>
        <p className='text-white mb-6 text-indigo-300'>Enter the 6 digit-code sent your email id:</p>

      </form>
      
    </div>
  )
}

export default EmailVerify
