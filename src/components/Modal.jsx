import React from 'react'
import { IoCloseOutline } from "react-icons/io5";

export default function Modal({ children, isOpen, onClose }) {

    const handleOutsideClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <>
            {isOpen && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    onClick={handleOutsideClick}>
                    <div className={`relative overflow-hidden p-8 bg-white w-full h-full md:h-auto md:w-[35%] rounded-lg transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-90'}`}>
                        <div className="flex justify-end">
                            <IoCloseOutline size={40} onClick={onClose} />
                        </div>
                        {children}
                    </div>
                </div>
            )}
        </>
    )
}
