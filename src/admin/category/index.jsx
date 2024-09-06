import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Layouts/Sidebar';
import { CiEdit } from "react-icons/ci";
import { PiEyeThin, PiPlusThin } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";
import { PiTrashSimpleThin } from "react-icons/pi";
import { PiListBulletsThin } from "react-icons/pi";
import { PiSquaresFourThin } from "react-icons/pi";
import { PiToggleLeftThin } from "react-icons/pi";
import { PiToggleRightThin } from "react-icons/pi";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";
import { Rings } from 'react-loader-spinner';
import Button from '../../components/Button';

export default function ViewCategory() {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [deletingId, setDeletingId] = useState(null);
    const categoryPerPage = 10; // จำนวนสินค้าต่อหน้า

    useEffect(() => {
        fetchCategory();
    }, [pageNumber]);

    const fetchCategory = async () => {
        try {
            const response = await axios.get(`/api/categories`);
            if (response.data.status === 200) {
                setCategories(response.data.categories);
                setLoading(false);
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

    const pageCount = Math.ceil(categories.total / categoryPerPage);

    const handlePageClick = ({ selected }) => {
        setPageNumber(selected);
    };


    const deleteCategory = async(e, id) => {
        e.preventDefault();
        setDeletingId(id);

        try {
            const response = await axios.delete(`/api/categories/${id}`);
            if (response.data.status === 200) {
                Swal.fire({
                    icon: "success",
                    text: response.data.message,
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "black",
                    focusConfirm: false,
                });

                // อัปเดตรายการที่มีอยู่โดยการกรองออก
                setCategories(prev => prev.filter(category => category.id !== id));
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
            Swal.fire({
                icon: "warning",
                text: error,
                confirmButtonText: "ตกลง",
                confirmButtonColor: "black",
                focusConfirm: false,
            });
        }
    }


    const updateCategoryStatus = async(category_id, status) => {
        // สลับสถานะ 0 เป็น 1 และ 1 เป็น 0
        const newStatus = status === 1 ? 0 : 1;

        try {
            const response = await axios.put(`/api/category-updatestatus/${category_id}/${newStatus}`);
            if (response.data.status === 200) {
                Swal.fire({
                    icon: 'success',
                    text: response.data.message,
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: 'black',
                    focusConfirm: false,
                });
                const updatedCategorys = categories.map(category => {
                    if (category.id === category_id) {
                        return {
                            ...category,
                            status: newStatus
                        };
                    }
                    return category;
                });
                setCategories(updatedCategorys);
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
                            {categories.length > 0 ? (
                                categories
                                    .filter(category => {
                                        // ใช้คำค้นหาในชื่อสินค้า
                                        return category.name.toLowerCase().includes(searchTerm.toLowerCase());
                                    })
                                    .map((category, index) => (
                                        <tr key={index} className="text-left py-1 border-b">
                                            <td>{category.id}</td>
                                            <td>{category.slug}</td>
                                            <td>{category.name}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className={`p-2 rounded-full border  transition-all duration-300`}
                                                    onClick={() => updateCategoryStatus(category.id, category.status)}
                                                >
                                                    {category.status === 1 ? <PiToggleRightThin size={25} /> : <PiToggleLeftThin size={25} />}
                                                </button>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <Link to={`${category.id}/edit`}>
                                                        <button className="border p-2 rounded-full ">
                                                            <CiEdit size={20} />
                                                        </button>
                                                    </Link>
                                                    <button type="button" onClick={(e) => deleteCategory(e, category.id)} className="border p-2 rounded-full  flex justify-end hover:text-red-700">
                                                        {deletingId === category.id ? "กำลังลบ..." : <PiTrashSimpleThin size={20} />}
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
