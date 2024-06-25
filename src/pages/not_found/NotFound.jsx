import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl">ไม่พบหน้า</h1>
      <Link className="hover:text-red-700" to={'/'}>กลับหน้าหลัก</Link>
    </div>
  )
}
