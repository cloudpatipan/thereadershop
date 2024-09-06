import React from 'react'
import Navbar from '../Navbar'
import Footer from '../Footer'
export default function Layout({ children }) {
  return (
    <>
      <div className="px-4 mx-auto font-light flex flex-col justify-between">
        <Navbar />
        <div className="my-8 min-h-screen mx-auto w-full">
          {children}
        </div>
      </div>
      <Footer />
    </>
  )
}
