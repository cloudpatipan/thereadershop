import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Layouts/Sidebar';
import { CiEdit } from "react-icons/ci";
import { PiPlusThin } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";
import { PiTrashSimpleThin } from "react-icons/pi";
import { PiToggleLeftThin } from "react-icons/pi";
import { PiToggleRightThin } from "react-icons/pi";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";
import { FaToggleOff } from "react-icons/fa6";
import { Rings } from 'react-loader-spinner';
import Button from '../../components/Button';

export default function ViewBrand() {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [brands, setBrands] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [deletingId, setDeletingId] = useState(null);
    const brandPerPage = 10; // จำนวนสินค้าต่อหน้า
    const navigate = useNavigate();

    useEffect(() => {
        fetchBrand();
    }, [pageNumber]);

    const fetchBrand = async () => {
        try {
            const response = await axios.get(`/api/brands`);
            if (response.data.status === 200) {
                setBrands(response.data.brands);
                setLoading(false);
            }
        } catch (error) {
            if (error.response.status === 401) {
                Swal.fire({
                    icon: "warning",
                    text: "กรุณาเข้าสู่ระบบ",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "black",
                    focusConfirm: false,
                });
              navigate('/');
            } else if (error.response.status === 403) {
                Swal.fire({
                    icon: "warning",
                    text: "กรุณาเข้าสู่ระบบที่มีระดับถึงแอดมิน",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "black",
                    focusConfirm: false,
                });
            }
        }
    }

    const pageCount = Math.ceil(brands.total / brandPerPage);

    const handlePageClick = ({ selected }) => {
        setPageNumber(selected);
    };

    const deleteBrand = async(e, id) => {
        e.preventDefault();
        setDeletingId(id);

        try {
            const response = await axios.delete(`/api/brands/${id}`);
            if (response.data.status === 200) {
                Swal.fire({
                    icon: "success",
                    text: response.data.message,
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "black",
                    focusConfirm: false,
                });

                // อัปเดตรายการที่มีอยู่โดยการกรองออก
                setBrands(prev => prev.filter(brand => brand.id !== id));
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
        } catch (error) {
            if (error.response.status === 401) {
                Swal.fire({
                    icon: "warning",
                    text: "กรุณาเข้าสู่ระบบ",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "black",
                    focusConfirm: false,
                });
              navigate('/');
            } else if (error.response.status === 403) {
                Swal.fire({
                    icon: "warning",
                    text: "กรุณาเข้าสู่ระบบที่มีระดับถึงแอดมิน",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "black",
                    focusConfirm: false,
                });
            }
        }
    }


    const updateBrandStatus = async(brand_id, status) => {
        // สลับสถานะ 0 เป็น 1 และ 1 เป็น 0
        const newStatus = status === 1 ? 0 : 1;

        try {
            const response = await axios.put(`/api/brand-updatestatus/${brand_id}/${newStatus}`);
            if (response.data.status === 200) {
                Swal.fire({
                    icon: 'success',
                    text: response.data.message,
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: 'black',
                    focusConfirm: false,
                });
                const updatedBrands = brands.map(brand => {
                    if (brand.id === brand_id) {
                        return {
                            ...brand,
                            status: newStatus
                        };
                    }
                    return brand;
                });
                setBrands(updatedBrands);
            } else if (response.data.status === 400) {
                Swal.fire({
                    icon: 'error',
                    text: response.data.message,
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: 'black',
                    focusConfirm: false,
                });
            } else if (response.data.status === 401) {
                Swal.fire({
                    icon: 'warning',
                    text: response.data.message,
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: 'black',
                    focusConfirm: false,
                });
            }
    } catch (error) {
        Swal.fire({
            icon: "warning",
            text: error,
            confirmButtonText: "ตกลง",
            confirmButtonColor: "black",
            focusConfirm: false,
        });
    }
}


return (
    <>
        <Sidebar>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4  mb-2 rounded-lg">
                <Link to={"create"}>
                    <Button name={'เพิ่ม'} icon={<PiPlusThin size={25} />} />
                </Link>

                <div className="relative">
                    <input type="text" placeholder="ค้นหาแบรนด์สินค้า"
                        className="w-[10rem] pl-8 placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <CiSearch className="absolute top-2 left-0" />
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
                <div className="border p-4 rounded overflow-x-scroll no-scrollbar">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left py-1 border-b">
                                <th>รหัส</th>
                                <th>สลัก</th>
                                <th>ชื่อ</th>
                                <th>สถานะ</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {brands.length > 0 ? (
                                brands
                                    .filter(brand => {
                                        // ใช้คำค้นหาในชื่อสินค้า
                                        return brand.name.toLowerCase().includes(searchTerm.toLowerCase());
                                    })
                                    .map((brand, index) => (
                                        <tr key={index} className="text-left py-1 border-b">
                                            <td>{brand.id}</td>
                                            <td>{brand.slug}</td>
                                            <td>{brand.name}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className={`p-2 rounded-full border  transition-all duration-300`}
                                                    onClick={() => updateBrandStatus(brand.id, brand.status)}
                                                >
                                                    {brand.status === 1 ? <PiToggleRightThin size={25} /> : <PiToggleLeftThin size={25} />}
                                                </button>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <Link to={`${brand.id}/edit`}>
                                                        <button className="border p-2 rounded-full ">
                                                            <CiEdit size={20} />
                                                        </button>
                                                    </Link>
                                                    <button type="button" onClick={(e) => deleteBrand(e, brand.id)} className="border p-2 rounded-full  flex justify-end hover:text-red-700">
                                                        {deletingId === brand.id ? "กำลังลบ..." : <PiTrashSimpleThin size={20} />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td className="py-1 border-b text-[1.5rem] font-semibold text-center" colSpan={8}>
                                        ไม่พบข้อมูลแบรนด์สินค้า
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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
