import React from 'react'
import { IoCloseCircleOutline, IoCloseOutline } from "react-icons/io5";

export default function ModalImage({ children, isOpen, onClose }) {

    const handleOutSide = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={`fixed inset-0 z-50 bg-black/60 bg-opacity-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={handleOutSide}>
            <div className="flex flex-col items-center justify-center h-full">
                <div className={`relative h-[80%] overflow-hidden rounded-lg transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-90'}`}>
                    <div className="absolute top-0 right-0 flex justify-end">
                        <IoCloseOutline size={40} onClick={onClose} />
                    </div>
                    {children}
                </div>
            </div>
        </div >
    )
}
