import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Layouts/Sidebar';
import { FaSearch } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";
import { IoAddCircleOutline } from "react-icons/io5";
import { IoTrashBinOutline } from "react-icons/io5";
import { FaToggleOn } from "react-icons/fa";
import { FaToggleOff } from "react-icons/fa6";
export default function ViewCategory() {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [deletingId, setDeletingId] = useState(null);
    const [updateStatus, setUpdateStatus] = useState(null);
    const categoriesPerPage = 10; // จำนวนสินค้าต่อหน้า

    useEffect(() => {
        fetchCategories();
    }, [pageNumber]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`/api/categories`);
            setCategories(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    const pageCount = Math.ceil(categories.total / categoriesPerPage); // จำนวนหน้าทั้งหมด

    const handlePageClick = ({ selected }) => {
        setPageNumber(selected);
    };


    const deleteCategory = (e, id) => {
        e.preventDefault();
        setDeletingId(id);

        axios.delete(`/api/categories/${id}`).then(response => {
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
        });
    }

    const updateCategoryStatus = (category_id, status) => {
        // สลับสถานะ 0 เป็น 1 และ 1 เป็น 0
        const newStatus = status === 1 ? 0 : 1;

        axios.put(`/api/category-updatestatus/${category_id}/${newStatus}`)
            .then(response => {
                if (response.data.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        text: response.data.message,
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: 'black',
                        focusConfirm: false,
                    });
                    const updatedCategories = categories.map(category => {
                        if (category.id === category_id) {
                            return {
                                ...category,
                                status: newStatus
                            };
                        }
                        return category;
                    });
                    setCategories(updatedCategories);
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
            })
            .catch(error => {
                console.error('Error updating order status:', error);
            });
    };

    return (
        <>
            <Sidebar>

                <div className="flex flex-col md:flex-row justify-between items-center gap-4  mb-2 rounded-lg">
                    <div>
                        <Link to={"create"}>
                            <button type="submit" className="relative flex justify-center items-center gap-2 border-2 rounded-full border-black bg-transparent py-2 px-5 font-medium uppercase text-black hover:text-white hover:bg-black transition-all duration-300">
                                <div>
                                    <IoAddCircleOutline size={26} />
                                </div>
                                <div>
                                    เพิ่มประเภทสินค้า
                                </div>
                            </button>
                        </Link>
                    </div>

                    <div className="relative">
                        <input type="text" placeholder="ค้นหาประเภทสินค้า"
                            className="w-full md:w-[10rem] pl-8 placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <FaSearch className="absolute top-2 left-0" />
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center">
                        <span className="text-3xl font-semibold">กำลังโหลด...</span>
                    </div>
                ) : (
                    <div className="border p-4 rounded">
                        <table className="w-full overflow-x-scroll">
                            <thead>
                                <tr className="text-left">
                                    <th className="py-1 border-b">รหัส</th>
                                    <th className="py-1 border-b">สลัก</th>
                                    <th className="py-1 border-b">ชื่อ</th>
                                    <th className="py-1 border-b">สถานะ</th>
                                    <th className="py-1 border-b"></th>
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
                                            <tr key={index}>
                                                <td className="py-1 border-b">{category.id}</td>
                                                <td className="py-1 border-b">{category.slug}</td>
                                                <td className="py-1 border-b">{category.name}</td>
                                                <td className="py-1 border-b">
                                                    <button
                                                        type="button"
                                                        className={`p-2 rounded-full bg-black text-white transition-all duration-300`}
                                                        onClick={() => updateCategoryStatus(category.id, category.status)}
                                                    >
                                                        {category.status === 1 ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                                                    </button>
                                                </td>
                                                <td className="py-1 border-b">
                                                    <div className="flex items-center gap-2">
                                                        <Link to={`${category.id}/edit`}>
                                                            <button className="bg-black p-2 rounded-full text-white">
                                                                <MdEdit size={20} />
                                                            </button>
                                                        </Link>
                                                        <button type="button" onClick={(e) => deleteCategory(e, category.id)} className="bg-black p-2 rounded-full text-white flex justify-end hover:text-red-700">
                                                            {deletingId === category.id ? "กำลังลบ..." : <IoTrashBinOutline size={20} />}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                ) : (
                                    <tr>
                                        <td className="py-1 border-b text-[1.5rem] font-semibold text-center" colSpan={8}>
                                            ไม่พบข้อมูลประเภทสินค้า
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                {/* ส่วนของ Pagination */}
                <ReactPaginate
                    previousLabel={
                        <span className="w-10 h-10 flex items-center justify-center bg-black rounded-full text-white">
                            <IoMdArrowDropleft />
                        </span>
                    }
                    nextLabel={
                        <span className="w-10 h-10 flex items-center justify-center bg-black rounded-full text-white">
                            <IoMdArrowDropright />
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
