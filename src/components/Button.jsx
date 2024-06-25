import React from 'react'

export default function Button({type, icon, image , className, id, onClick, children}) {
  return (
    <button type={type ? type : "button"} className={className ? `relative flex justify-between items-center gap-2 border-2 rounded-full border-black bg-transparent py-2 px-5 font-medium uppercase text-black hover:text-white hover:bg-black ${className}` : "relative flex justify-between items-center gap-2 border-2 rounded-full border-black bg-transparent py-2 px-5 font-medium uppercase text-black hover:text-white hover:bg-black transition-all duration-300"} id={id} onClick={onClick}>
    
    <div>
    {icon ? icon : null}
    {image ? image : null}
    </div>

    <div>
    {children}
    </div>
    
    </button>
  )
}