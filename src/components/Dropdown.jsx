import React from 'react';

export default function Dropdown({ header , children }) {
    
    return (
        <div className="relative group cursor-pointer">

            <div>
                {header}
            </div>
            
            <div className="invisible absolute right-[0rem] z-50 p-4 rounded-lg flex w-[14rem] flex-col bg-white group-hover:visible">
                {children}
            </div>

        </div>
    );
}
