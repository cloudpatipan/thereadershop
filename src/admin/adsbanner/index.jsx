import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Layouts/Sidebar';
import { IoMdTrash } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";
import { HiListBullet } from "react-icons/hi2";
import { HiSquares2X2 } from "react-icons/hi2";
import { CgDetailsMore } from "react-icons/cg";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";
import { IoTrashBinOutline } from "react-icons/io5";
import baseUrl from '../../routes/BaseUrl';
export default function ViewAdsBanner() {
    const [loading, setLoading] = useState(true);
    const [AdsBanners, setAdsBanners] = useState([]);
    const [deletingId, setDeletingId] = useState(null);
    const [pageNumber, setPageNumber] = useState(0);
    const AdsBannersPerPage = 10; // จำนวนสินค้าต่อหน้า

    const handlePageClick = ({ selected }) => {
        setPageNumber(selected);
    };

    useEffect(() => {
        fetchAdsBanners();
    }, [pageNumber]);

    const fetchAdsBanners = async () => { // แก้ชื่อฟังก์ชั่นเป็น fetchadsbanner แทน fectadsbanner
        try {
            const response = await axios.get(`/api/adsbanners`);
            setAdsBanners(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching adsbanners:', error);
        }
    }

    const deleteAdsBanner = (e, id) => {
        e.preventDefault();
        setDeletingId(id);

        axios.delete(`/api/adsbanners/${id}`).then(response => {
            if (response.data.status === 200) {
                Swal.fire({
                    icon: "success",
                    text: response.data.message,
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "black",
                    focusConfirm: false,
                });

                // อัปเดตรายการที่มีอยู่โดยการกรองออก
                setAdsBanners(prev => prev.filter(AdsBanner => AdsBanner.id !== id));
                setDeletingId(null); // เครียทุกอย่างใน ไอดี ตระกร้า
            } else if (response.data.status === 400) {
                Swal.fire({
                    icon: "error",
                    text: response.data.message,
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "black",
                    focusConfirm: false,
                });
                setDeletingId(null);
            }
        });
    }

    const pageCount = Math.ceil(AdsBanners.length / AdsBannersPerPage);
    const displayedAdsBanners = AdsBanners.slice(pageNumber * AdsBannersPerPage, (pageNumber + 1) * AdsBannersPerPage);

    const [isTableFormat, setIsTableFormat] = useState(true);

    const toggleFormat = () => {
        setIsTableFormat(!isTableFormat);
    };


    return (
        <>
            <Sidebar>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4  mb-2 rounded-lg">
                    <Link to={"create"}>
                        <button type="submit" className="w-full relative flex justify-center items-center gap-2 border-2 rounded-full border-black bg-transparent py-2 px-5 font-medium uppercase text-black hover:text-white hover:bg-black transition-all duration-300">
                            <div>
                                <IoAddCircleOutline size={26} />
                            </div>
                            <div>
                                เพิ่มแบนเนอร์
                            </div>
                        </button>
                    </Link>

                    <div className="flex items-center gap-x-4">

                        <button onClick={toggleFormat} className="bg-black text-white rounded-full p-2">
                            {isTableFormat ? <HiSquares2X2 size={20} /> : <HiListBullet size={20} />}
                        </button>

                    </div>

                </div>

                {loading ? (
                    <div className="flex items-center justify-center">
                        <span className="text-3xl font-semibold">กำลังโหลด...</span>
                    </div>
                ) : (
                    <div className="border p-4 rounded overflow-x-scroll">
                        {isTableFormat ? (
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left">
                                        <th className="py-1 border-b">รหัสแบนเนอร์</th>
                                        <th className="py-1 border-b">รูปภาพ</th>
                                        <th className="py-1 border-b">สถานะ</th>
                                        <th className="py-1 border-b"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedAdsBanners.length > 0 ? (
                                        displayedAdsBanners
                                            .map((adsbanner, index) => (
                                                <tr key={index}>
                                                    <td className="py-1 border-b">
                                                        {adsbanner.id}
                                                    </td>

                                                    <td className="py-1 border-b">
                                                        {adsbanner.image ? (
                                                            <img className="w-48 h-10 rounded object-cover" src={`${baseUrl}/images/adsbanner/${adsbanner.image}`} alt="" />
                                                        ) : (
                                                            <img className="w-12 h-18 rounded object-cover" src="${baseUrl}/images/product/No_image.png" alt="No Image" />
                                                        )}
                                                        {console.log(adsbanner.image)}
                                                    </td>
                                                    <td className="py-1 border-b">
                                                        <div className="flex items-center gap-2">
                                                            <Link to={`${adsbanner.id}/edit`}>
                                                                <button className="bg-black p-2 rounded-full text-white">
                                                                    <MdEdit size={20} />
                                                                </button>
                                                            </Link>
                                                            <button type="button" onClick={(e) => deleteAdsBanner(e, adsbanner.id)} className="bg-black p-2 rounded-full text-white flex justify-end hover:text-red-700">
                                                                {deletingId === adsbanner.id ? "กำลังลบ..." : <IoTrashBinOutline size={20} />}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="py-1 border-b">
                                                <div className="text-2xl font-semibold flex justify-center items-center h-20">
                                                    ไม่พบข้อมูลแบนเนอร์
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-8">
                                {displayedAdsBanners.length > 0 ? (
                                    displayedAdsBanners
                                        .map((adsbanner, index) => (
                                            <div className="mx-auto" key={index}>
                                                <Link to={`/adsbanner/${adsbanner.id}`}> {/* ใส่ URL ที่เหมาะสม */}
                                                    <div className="relative overflow-hidden rounded-lg group">
                                                        <div className="absolute w-full h-full bg-black/40 flex items-center justify-center -bottom-20 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                            <div className="flex flex-col items-center text-white text-xl">
                                                                รายละเอียด
                                                                <CgDetailsMore size={28} />
                                                            </div>
                                                        </div>
                                                        {adsbanner.image ? (
                                                            <img className="object-cover" src={`${baseUrl}/images/adsbanner/${adsbanner.image}`} alt="" />
                                                        ) : (
                                                            <img className="object-cover" src="${baseUrl}/images/adsbanner/no_image.png" alt="No Image" />
                                                        )}
                                                        <div className="absolute top-1 left-1">
                                                            {adsbanner.logo ? (
                                                                <img className="w-24 h-24 rounded-lg object-cover" src={`${baseUrl}/images/adsbanner/${adsbanner.logo}`} alt="" />
                                                            ) : (
                                                                <img className="w-24 h-24 rounded-lg object-cover" src="${baseUrl}/images/adsbanner/no_image.png" alt="No Image" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </Link>

                                                <h1 className="mt-2 font-bold text-xl h-[3.375rem] text-clip overflow-hidden">{adsbanner.name}</h1>
                                                <div className="mt-1 flex justify-between items-center gap-2">
                                                    <Link to={`${adsbanner.id}/edit`}>
                                                        <button className="bg-black p-2 rounded-full text-white">
                                                            <MdEdit size={20} />
                                                        </button>
                                                    </Link>
                                                    <button type="button" className="bg-black p-2 rounded-full text-white"
                                                        onClick={() => deleteadsbanner(adsbanner.id)}>
                                                        <IoMdTrash size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <div className="col-span-5">
                                        <div className="text-[1.5rem] flex justify-center items-center font-semibold">ไม่พบข้อมูลแบนเนอร์</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
                {/* ส่วนของ Pagination */}
                <ReactPaginate
                    previousLabel={
                        <span className="w-10 h-10 flex items-center justify-center bg-black rounded-full text-white">
                            <IoMdArrowDropleft size={20} />
                        </span>
                    }
                    nextLabel={
                        <span className="w-10 h-10 flex items-center justify-center bg-black rounded-full text-white">
                            <IoMdArrowDropright size={20} />
                        </span>
                    }
                    pageCount={pageCount}
                    breakLabel={
                        <span className="mr-4">
                            ...
                        </span>
                    }
                    onPageChange={handlePageClick}
                    containerClassName="flex justify-center items-center gap-2 mt-2"
                    pageClassName="block border- border-solid border-black bg-black w-10 h-10 flex items-center justify-center rounded-full text-white"
                    activeClassName="bg-black/40"
                />
            </Sidebar>
        </>
    )
}
