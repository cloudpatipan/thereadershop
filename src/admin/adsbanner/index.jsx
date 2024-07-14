import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Layouts/Sidebar';
import { CiEdit } from "react-icons/ci";
import { PiEyeThin, PiPlus, PiPlusThin } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";
import { PiTrashSimpleThin } from "react-icons/pi";
import { PiListBulletsThin } from "react-icons/pi";
import { PiSquaresFourThin } from "react-icons/pi";
import { PiToggleLeftThin } from "react-icons/pi";
import { PiToggleRightThin } from "react-icons/pi";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";
import { PiArticleThin } from "react-icons/pi";
import baseUrl from '../../routes/BaseUrl';
import { Rings } from 'react-loader-spinner';
import Button from '../../components/Button';
export default function ViewAdsbanner() {
    const [loading, setLoading] = useState(true);
    const [Adsbanners, setAdsbanners] = useState([]);
    const [deletingId, setDeletingId] = useState(null);
    const [pageNumber, setPageNumber] = useState(0);
    const AdsbannersPerPage = 10; // จำนวนสินค้าต่อหน้า

    const handlePageClick = ({ selected }) => {
        setPageNumber(selected);
    };

    useEffect(() => {
        fetchAdsbanners();
    }, [pageNumber]);

    const fetchAdsbanners = async () => { // แก้ชื่อฟังก์ชั่นเป็น fetchAdsbanner แทน fectAdsbanner
        try {
            const response = await axios.get(`/api/adsbanners`);
            setAdsbanners(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching Adsbanners:', error);
        }
    }

    const deleteAdsbanner = (e, id) => {
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
                setAdsbanners(prev => prev.filter(Adsbanner => Adsbanner.id !== id));
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

    const pageCount = Math.ceil(Adsbanners.length / AdsbannersPerPage);
    const displayedAdsbanners = Adsbanners.slice(pageNumber * AdsbannersPerPage, (pageNumber + 1) * AdsbannersPerPage);

    const [isTableFormat, setIsTableFormat] = useState(true);

    const toggleFormat = () => {
        setIsTableFormat(!isTableFormat);
    };


    return (
        <>
            <Sidebar>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4  mb-2 rounded-lg">
                    <Link to={"create"}>
                        <Button icon={<PiPlusThin size={26} />} type="submit">
                            <div>
                                เพิ่มแบนเนอร์
                            </div>
                        </Button>
                    </Link>

                    <div className="flex items-center gap-x-4">

                        <button onClick={toggleFormat} className="border  rounded-full p-2">
                            {isTableFormat ? <PiSquaresFourThin size={20} /> : <PiListBulletsThin size={20} />}
                        </button>

                    </div>

                </div>

                {loading ? (
                    (<Rings
                        visible={true}
                        height="500"
                        width="500"
                        color="black"
                        ariaLabel="rings-loading"
                        wrapperClass="flex justify-center"
                    />)
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
                                    {displayedAdsbanners.length > 0 ? (
                                        displayedAdsbanners
                                            .map((Adsbanner, index) => (
                                                <tr key={index}>
                                                    <td className="py-1 border-b">
                                                        {Adsbanner.id}
                                                    </td>

                                                    <td className="py-1 border-b">
                                                        {Adsbanner.image ? (
                                                            <img className="w-48 h-10 rounded object-cover" src={`${baseUrl}/images/Adsbanner/${Adsbanner.image}`} alt="" />
                                                        ) : (
                                                            <img className="w-12 h-18 rounded object-cover" src="${baseUrl}/images/product/No_image.png" alt="No Image" />
                                                        )}
                                                        {console.log(Adsbanner.image)}
                                                    </td>
                                                    <td className="py-1 border-b">
                                                        <div className="flex items-center gap-2">
                                                            <Link to={`${Adsbanner.id}/edit`}>
                                                                <button className="border p-2 rounded-full ">
                                                                    <CiEdit size={20} />
                                                                </button>
                                                            </Link>
                                                            <button type="button" onClick={(e) => deleteAdsbanner(e, Adsbanner.id)} className="border p-2 rounded-full  flex justify-end hover:text-red-700">
                                                                {deletingId === Adsbanner.id ? "กำลังลบ..." : <PiTrashSimpleThin size={20} />}
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
                                {displayedAdsbanners.length > 0 ? (
                                    displayedAdsbanners
                                        .map((Adsbanner, index) => (
                                            <div className="mx-auto" key={index}>
                                                <Link to={`/Adsbanner/${Adsbanner.id}`}> {/* ใส่ URL ที่เหมาะสม */}
                                                    <div className="relative overflow-hidden rounded-lg group">
                                                        <div className="absolute w-full h-full border/40 flex items-center justify-center -bottom-20 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                            <div className="flex flex-col items-center  text-xl">
                                                                รายละเอียด
                                                                <PiArticleThin size={28} />
                                                            </div>
                                                        </div>
                                                        {Adsbanner.image ? (
                                                            <img className="w-full h-full object-cover" src={`${baseUrl}/images/Adsbanner/${Adsbanner.image}`} alt="" />
                                                        ) : (
                                                            <img className="w-full h-full object-cover" src={`${baseUrl}/images/product/No_image.png`} alt={`ไม่มีรูปภาพ`} />
                                                        )}
                                                        <div className="absolute top-1 left-1">
                                                            {Adsbanner.logo ? (
                                                                <img className="w-24 h-24 rounded-lg object-cover" src={`${baseUrl}/images/Adsbanner/${Adsbanner.logo}`} alt="" />
                                                            ) : (
                                                                <img className="w-full h-full object-cover" src={`${baseUrl}/images/product/No_image.png`} alt={`ไม่มีรูปภาพ`} />
                                                            )}
                                                        </div>
                                                    </div>
                                                </Link>

                                                <h1 className="mt-2 font-bold text-xl h-[3.375rem] text-clip overflow-hidden">{Adsbanner.name}</h1>
                                                <div className="mt-1 flex justify-between items-center gap-2">
                                                    <Link to={`${Adsbanner.id}/edit`}>
                                                        <button className="border p-2 rounded-full ">
                                                            <CiEdit size={20} />
                                                        </button>
                                                    </Link>
                                                    <button type="button" className="border p-2 rounded-full "
                                                        onClick={() => deleteAdsbanner(Adsbanner.id)}>
                                                        <PiTrashSimpleThin size={20} />
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
                {pageCount > 1 && (
                    <ReactPaginate
                        previousLabel={
                            <span className="w-10 h-10 flex items-center justify-center border rounded-full">
                                <IoMdArrowDropleft size={20} />
                            </span>
                        }
                        nextLabel={
                            <span className="w-10 h-10 flex items-center justify-center border rounded-full">
                                <IoMdArrowDropright size={20} />
                            </span>
                        }
                        pageCount={pageCount}
                        breakLabel={<span className="mr-4">...</span>}
                        onPageChange={handlePageClick}
                        containerClassName="flex justify-center items-center gap-2 mt-2"
                        pageClassName="block w-10 h-10 flex items-center justify-center border rounded-full"
                        activeClassName="border-4"
                    />
                )}

            </Sidebar>
        </>
    )
}
