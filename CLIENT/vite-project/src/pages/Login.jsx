import React, { use, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import {toast} from 'react-toastify'
import axios from 'axios'
import { useContext } from 'react'
import { AppContext } from '../contexts/AppContext' 

const Login = () => {


  const navigate = useNavigate()

   const {backendUrl, setIsLoggedIn} = useContext(AppContext)

  const [state, setState] = useState('Sign Up')
  const [name, setname] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')

const onSubmitHandler = async (e) => {
  e.preventDefault();

  try {
    axios.defaults.withCredentials = true;

    if (state === 'Sign Up') {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/register`,
        { name, email, password }
      );

      if (data.success) {
        setIsLoggedIn(true);
        navigate('/');
      } else {
        toast.error(data.message);
      }

    } else {   // Login part

      const { data } = await axios.post(
        `${backendUrl}/api/auth/login`,
        { email, password }
      );

      if (data.success) {
        setIsLoggedIn(true);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    }

  } catch (error) {
    toast.error(error.response?.data?.message || 'An error occurred');
  }
};
  

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      
      <img 
        src={assets.lynn_logo} 
        alt="logo" 
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
      />

      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold mb-3 text-white text-center'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
        <p className='text-center text-sm mg-6'>{state === 'Sign Up' ? 'Create your Account' : 'Login to your Account'}</p>

        <form onSubmit={onSubmitHandler}>

  {state === 'Sign Up' && (
    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
      <input 
        onChange={(e) => setname(e.target.value)}
        value={name}
        type="text" 
        placeholder='Full Name' 
        className='bg-transparent border-0 outline-none w-full text-white'  
      />
    </div>
  )}

  <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
    <input 
     onChange={(e) => setemail(e.target.value)}
        value={email}
      type="text" 
      placeholder='Email Address' 
      className='bg-transparent border-0 outline-none w-full text-white'  
    />
  </div>

  <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
    <input 
      type="password" 
      placeholder='Password' 
      className='bg-transparent border-0 outline-none w-full text-white'  
    />
  </div>

  {state === 'Login' && (
    <p onClick={()=>navigate('/ResetPassword')} className='text-indigo-500 cursor-pointer mb-4'>Forgot Password?</p>
  )}

  <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>
    {state}
  </button>

</form>


        {state === 'Sign Up' ? (
          <p className='text-gray-400 text-center text-x5 mt-4'>Already have Account? {''} <span onClick={() => setState('Login')} className='text-blue-400 cursor-pointer underline'>Login Here</span></p>

        ) : (
           <p className='text-gray-400 text-center text-x5 mt-4'>Don't have an Account? {''} <span onClick={() => setState('Sign Up')} className='text-blue-400 cursor-pointer underline'>Sign Up</span></p>
        )}

       
      </div>

    </div>
  )
}

export default Login
