// implements the components
import React from 'react'
import NavBar from '../components/navbar'
import Header from '../components/Header'

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-amber-50 bg-cover bg-center'>
        <NavBar/>
        <Header/>
    </div>
  )
}

export default Home
