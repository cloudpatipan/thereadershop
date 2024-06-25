import React from 'react'
import Navbar from '../Navbar'
import Footer from '../Footer'
export default function Layout({ children }) {
  return (
    <>
    <div className="px-8 flex flex-col justify-between">
    <Navbar/>
    <div className="my-8 min-h-screen container mx-auto">
    {children}
    </div>
  </div>
  <Footer/>
  </>
  )
}
