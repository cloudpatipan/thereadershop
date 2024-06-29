import React from 'react'

export default function Info({ children }) {
  return (
    <section className="my-4 border p-4 rounded-lg">
      <div className="flex items-center gap-4">
      <span className="font-bold text-base md:text-xl text-[#fc823f]">ข้อมูล</span>

      <div className="flex">
      <p className="font-bold">
        [ประกาศ] {children}
      </p>
      </div>

      </div>

    </section>
  )
}
