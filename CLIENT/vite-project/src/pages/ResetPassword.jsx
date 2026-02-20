import React from 'react'
import { useNavigate } from 'react-router-dom'

const ResetPassword = () => {

  const [email, setEmail] = useState('')

  const navigate = useNavigate()

   const inputRefs = React.useRef([])
   
     const handleInput = (e, index) => {
       if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
         inputRefs.current[index + 1].focus()
       }
     }
   
     const handleKeyDown = (e, index) => {
       if(e.key === 'Backspace' && e.target.value === '' && index > 0){
         inputRefs.current[index - 1].focus()
       }
     }
   
     const handlepaste = (e) => {
       const paste = e.clipboardData.getData('text')
       const pasteArray = paste.split('')
       pasteArray.forEach((char, index) =>{
         if(inputRefs.current[index]) {
           inputRefs.current[index].value = char;
         }
       })
     }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
      {/* enter email id */}

      <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
     
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>
          Reset Password
        </h1>

        <p className='text-indigo-300 mb-6'>
         Enter your registered Email Address
        </p>

         <div className='flex justify-between mb-4 gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]' >
            <input className='bg-transparent outline-none text-white' type='Email' placeholder='Email Id' value={email} onChange={e => setEmail(e.target.value)} required/>
         
        </div>
         <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>
         Submit
        </button>

      </form>

   
         <form  >
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>
          Reset Password OTP Email OTP
        </h1>

        <p className='text-indigo-300 mb-6'>
          Enter the 6 digit code sent to your email:
        </p>

        <div className='flex justify-between mb-8' onPaste={handlepaste}>
          {Array(6).fill(0).map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              required
              ref={(e) => (inputRefs.current[index] = e)}
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
      

    </div>
  )
}

export default ResetPassword
