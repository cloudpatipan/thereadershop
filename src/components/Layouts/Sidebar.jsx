import React, { useContext, useState } from 'react';
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { LuShoppingBag } from "react-icons/lu";
import { AiOutlineProduct } from "react-icons/ai";
import { MdOutlineBrandingWatermark } from "react-icons/md";
import { MdOutlineReceipt } from "react-icons/md";
import { BsBank } from "react-icons/bs";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer';
import { UserContext } from '../../context/UserContext';
import { PiFlagBannerFoldBold } from "react-icons/pi";
import { AiOutlineHome } from "react-icons/ai";
export default function Sidebar({ children }) {
    const { user, token, setUser, setToken } = useContext(UserContext);
    const navigate = useNavigate();

    const menus = [
        { name: "หน้าหลัก", link: "/", icon: AiOutlineHome },
        { name: "แดชบอร์ด", link: "/dashboard", icon: MdOutlineDashboard },
        { name: "แบนเนอร์", link: "/admin/adsbanner", icon: PiFlagBannerFoldBold },
        { name: "ผู้ใช้", link: "/admin/user", icon: FaRegUser },
        { name: "สินค้า", link: "/admin/product", icon: LuShoppingBag },
        { name: "ประเภทสินค้า", link: "/admin/category", icon: AiOutlineProduct },
        { name: "แบรนด์สินค้า", link: "/admin/brand", icon: MdOutlineBrandingWatermark },
        { name: "รายการสั่งซื้อ", link: "/admin/order", icon: MdOutlineReceipt },
        { name: "ธนาคาร", link: "/admin/bank", icon: BsBank, margin: true },
    ]

    const [open, setOpen] = useState(true);

    return (
        <>
            <section className="flex">
                <div className={`bg-black min-h-screen ${open ? 'w-72' : 'w-16'} duration-500 text-white px-4`}>
                    <div className="py-3 flex justify-end">
                        <HiMenuAlt3 size={26} className="cursor-pointer" onClick={() => setOpen(!open)} />
                    </div>
                    <div>

                        {user && token ? (
                            <div className="flex gap-4">

                                <div className="w-[3rem] h-[3rem] rounded-lg overflow-hidden cursor-pointer group">
                                    {user.avatar ? (
                                        <img className="w-full h-full object-cover" src={`https://b3d5-2405-9800-b540-dc40-e4c6-fa23-b554-9155.ngrok-free.app /images/avatar/${user.avatar}`} alt={`รูปภาพของ ${user.name}`} />
                                    ) : (
                                        <img className="w-full h-full object-cover" src="https://b3d5-2405-9800-b540-dc40-e4c6-fa23-b554-9155.ngrok-free.app /images/product/No_image.png" alt="No Image" />
                                    )}
                                </div>

                                <div className="flex items-center gap-x-4">

                                    <div className="flex flex-col">
                                        <h2
                                            style={{
                                                transitionDelay: `50ms`,
                                            }}
                                            className={`whitespace-pre text-xs duration-500 bg-white rounded-lg text-black px-2 ${!open && ' opacity-0 transition-x-28 overflow-hidden'}`}>
                                            {user.role}
                                        </h2>
                                        <h2
                                            style={{
                                                transitionDelay: `300ms`,
                                            }}
                                            className={`whitespace-pre duration-500 ${!open && ' opacity-0 transition-x-28 overflow-hidden'}`}>
                                            {user.name}
                                        </h2>
                                    </div>

                                </div>

                            </div>
                        ) : null}

                    </div>
                    <div className="mt-4 flex flex-col gap-4 relative">
                        {
                            menus?.map((menu, i) => (
                                <Link to={menu?.link} key={i} className={` ${menu.margin && "mt-5"} group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md`}>
                                    <div>
                                        {React.createElement(menu?.icon, { size: "20" })}
                                    </div>
                                    <h2
                                        style={{
                                            transitionDelay: `${i + 3}00ms`,
                                        }}
                                        className={`whitespace-pre duration-500 ${!open && ' opacity-0 transition-x-28 overflow-hidden'}`}>
                                        {menu.name}
                                    </h2>
                                    <h2 className={`${open ? 'hidden' : ''} absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}>
                                        {menu.name}
                                    </h2>
                                </Link>
                            ))
                        }

                    </div>
                </div>

                <div className="w-full overflow-auto">

                    <div className="mx-auto container p-4">
                        {children}
                    </div>

                </div>

            </section>
            <Footer />
        </>
    )
}
