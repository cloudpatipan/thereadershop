import React from 'react'

export default function Button({ type, icon, image, className, id, onClick, name, condition }) {

  return (
    <button type={type ? type : "button"} className={className ? `${icon || image && name ? 'gap-2' : ''} relative flex justify-between items-center border rounded-full bg-transparent py-2 px-4 uppercase text-black ${condition ? 'text-white bg-black' : ''} hover:text-white hover:bg-black ${className}` : `relative flex justify-between items-center border rounded-full  py-2 px-4 uppercase ${icon || image && name ? 'gap-2' : ''}  ${condition ? 'text-white bg-black' : 'hover:text-white hover:bg-black bg-transparent'}  transition-all duration-300`} id={id} onClick={onClick}>

      <div>
        {icon ? icon : null}
        {image ? image : null}
      </div>

      <div>
        {name}
      </div>

    </button>
  )
}