import React from 'react'
import Navbar from '../Navbar'
import Footer from '../Footer'
export default function Layout({ children }) {
  return (
    <>
    <div className="container mx-auto text-sm md:text-base px-4 flex flex-col justify-between">
    <Navbar/>
    <div className="my-8 min-h-screen mx-auto w-full">
    {children}
    </div>
  </div>
  <Footer/>
  </>
  )
}
