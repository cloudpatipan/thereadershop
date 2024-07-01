import React from 'react'

export default function Info({ children }) {
  return (
    <section className="my-1 border p-4 rounded-lg">
      <div className="flex items-center gap-4 text-sm">

      <div>
      <p>ข้อมูล</p>
      </div>

      <div>
      <p>
        [ประกาศ] {children}
      </p>
      </div>

      </div>

    </section>
  )
}
