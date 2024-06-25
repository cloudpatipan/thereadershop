import React from 'react'
import { IoCloseCircleOutline } from "react-icons/io5";

export default function ModalImage({ children, isOpen, onClose }) {
    if (!isOpen) return null;

    const handleOutside = (event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      };
    
  return (
                <div className="fixed z-10 flex justify-center items-center top-0 left-0 right-0 bottom-0 w-full h-full bg-black/40 bg-transaperent"
                onClick={handleOutside}>
                <div className="relative bg-white rounded-xl overflow-hidden max-w-[24rem] w-full">
                <button
                    className="absolute top-5 right-5 text-white text-lg bg-transparent border-transparent cursor-pointer font-medium"
                    onClick={onClose}
                >
                    <IoCloseCircleOutline className="hover:text-black transition-all duration-300" size={40} />
                </button>
                {children}
                </div>
            </div>
        )
    }
