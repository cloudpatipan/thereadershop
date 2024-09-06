import React from 'react'

export default function Info({ title }) {
  return (
    <section className="my-1 border p-4 rounded-lg">
      <div className="flex items-center gap-4 text-sm">

        <div>
          <p>ข้อมูล</p>
        </div>

        <div>
          <p>
            [ประกาศ] {title}
          </p>
        </div>

      </div>

    </section>
  )
}
