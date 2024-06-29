import React from 'react'
import { IoCloseCircleOutline } from "react-icons/io5";

export default function Modal({ children, isOpen, onClose }) {
    if (!isOpen) return null;

    const handleOutSide = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fixed z-10 flex justify-center overflow-hidden items-center top-0 left-0 right-0 bottom-0 w-full h-full bg-black/40 bg-transaperent"
            onClick={handleOutSide}>
            <div className="relative overflow-hidder w-full h-full md:h-auto md:w-[35%] rounded-lg">
                <button
                    className="absolute top-2 right-2 text-white text-lg bg-transparent cursor-pointer font-medium"
                    onClick={onClose}
                >
                    <IoCloseCircleOutline className="text-black transition-all duration-300" size={40} />
                </button>
                <div className="p-10 h-full w-full md:rounded-lg bg-white border">
                {children}
                </div>
            </div>
        </div>
    )
}
