import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Layouts/Sidebar';
import { FaSearch } from "react-icons/fa";
import { IoMdTrash } from "react-icons/io";
import { HiListBullet } from "react-icons/hi2";
import { HiSquares2X2 } from "react-icons/hi2";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";
import { FaToggleOn } from "react-icons/fa";
import { FaToggleOff } from "react-icons/fa6";
import baseUrl from '../../routes/BaseUrl';
import { Rings } from 'react-loader-spinner';
export default function ViewUser() {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const usersPerPage = 10; // จำนวนสินค้าต่อหน้า
    const [isTableFormat, setIsTableFormat] = useState(true);
    const [loading, setLoading] = useState(true); // Added loading state

    const handlePageClick = ({ selected }) => {
        setPageNumber(selected);
    };

    useEffect(() => {
        fetchUsers();
    }, [pageNumber]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`/api/users`);
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching Users:', error);
            setLoading(false);
        }
    }

    const deleteUser = async (id) => {
        const isConfirmed = await Swal.fire({
            title: "คุณแน่ใจใช่ไหม?",
            text: "คุณจะไม่สามารถย้อนกลับได้",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ใช่, ต้องการลบ",
            cancelButtonText: "ยกเลิก",
        }).then((result) => {
            return result.isConfirmed;
        });

        if (!isConfirmed) {
            return;
        }

        await axios.delete(`/api/users/${id}`)
            .then((response) => {
                Swal.fire({
                    icon: "success",
                    text: response.data.message,
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "black",
                    focusConfirm: false,
                });
                fetchUsers();
            })
            .catch((error) => {
                Swal.fire({
                    text: error.response.data.message,
                    icon: "error"
                });
            });
    }

    const updateUserRole = (user_id, role) => {
        // สลับสถานะ 0 เป็น 1 และ 1 เป็น 0
        const newRole = role === 'admin' ? 'user' : 'admin';

        axios.put(`/api/user-updaterole/${user_id}/${newRole}`)
            .then(response => {
                if (response.data.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        text: response.data.message,
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: 'black',
                        focusConfirm: false,
                    });
                    const updatedUsers = users.map(user => {
                        if (user.id === user_id) {
                            return {
                                ...user,
                                role: newRole
                            };
                        }
                        return user;
                    });
                    setUsers(updatedUsers);
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


    const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const pageCount = Math.ceil(filteredUsers.length / usersPerPage);
    const displayedUsers = filteredUsers.slice(pageNumber * usersPerPage, (pageNumber + 1) * usersPerPage);

    const toggleFormat = () => {
        setIsTableFormat(!isTableFormat);
    };

    return (
        <>
            <Sidebar>
                <section>
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
                        <>
                            <div className="flex justify-end items-center gap-4 mb-2 rounded-lg">
                                <button onClick={toggleFormat} className="bg-black text-white rounded-full p-2">
                                    {isTableFormat ? <HiSquares2X2 size={20} /> : <HiListBullet size={20} />}
                                </button>

                                <div className="relative">
                                    <input type="text" placeholder="ค้นหาบัญชีผู้ใช้"
                                        className="w-[10rem] pl-8 placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                    <FaSearch className="absolute top-2 left-0" />
                                </div>
                            </div>

                            <div className="border p-4 rounded overflow-x-scroll">
                                {isTableFormat ? (
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left">
                                                <th className="py-1 border-b">รหัส</th>
                                                <th className="py-1 border-b">รูปภาพ</th>
                                                <th className="py-1 border-b">ชื่อ</th>
                                                <th className="py-1 border-b">ระดับ</th>
                                                <th className="py-1 border-b">ปรับระดับ</th>
                                                <th className="py-1 border-b"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displayedUsers.length > 0 ? (
                                                displayedUsers.map((user, index) => (
                                                    <tr key={index}>
                                                        <td className="py-1 border-b">{user.id}</td>
                                                        <td className="py-1 border-b">
                                                            <div className="w-[3rem] h-[3rem] overflow-hidden rounded-lg">
                                                                {user.avatar ? (
                                                                    <img className="w-full h-full object-cover" src={`${baseUrl}/images/avatar/${user.avatar}`} alt={`รูปภาพของ ${user.name}`} />
                                                                ) : (
                                                                    <img className="w-full h-full object-cover" src={`${baseUrl}/images/product/no_image.png`} alt={`ไม่มีรูปภาพ`} />
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="py-1 border-b">{user.name}</td>
                                                        <td className="py-1 border-b"><span className="bg-black text-white rounded-lg px-2">{user.role}</span></td>
                                                        <td className="py-1 border-b">
                                                            <button
                                                                type="button"
                                                                className={`text-white w-[2rem] h-[2rem] flex items-center justify-center rounded-full bg-black transition-all duration-300`}
                                                                onClick={() => updateUserRole(user.id, user.role)}
                                                            >
                                                                {user.role === 'admin' ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                                                            </button>
                                                        </td>
                                                        <td className="py-1 border-b">
                                                            <div className="flex items-center gap-2">
                                                                <button type="button" className="bg-black p-2 rounded-full text-white"
                                                                    onClick={() => deleteUser(user.id)}>
                                                                    <IoMdTrash size={20} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="py-1 border-b">
                                                        <div className="text-2xl font-semibold flex justify-center items-center h-20">
                                                            ไม่พบข้อมูลผู่ใช้
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                        {displayedUsers.length > 0 ? (
                                            displayedUsers.map((user, index) => (
                                                <div className="mx-auto w-[10rem]" key={index}>
                                                    <div className="relative overflow-hidden  h-[10rem] rounded-lg group">
                                                        <div className="absolute w-full h-full bg-black/40 flex items-center justify-center -bottom-20 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                                        {user.avatar ? (
                                                            <img className="w-full h-full object-cover" src={`${baseUrl}/images/avatar/${user.avatar}`} alt="" />
                                                        ) : (
                                                            <img className="w-full h-full object-cover" src={`${baseUrl}/images/product/no_image.png`} alt={`ไม่มีรูปภาพ`} />
                                                        )}
                                                    </div>

                                                    <div className="flex items-center justify-between mt-2">
                                                        <p className="font-bold text-xl text-clip overflow-hidden">{user.name}</p>
                                                        <p className="bg-black text-white rounded-lg px-2">{user.role}</p>
                                                    </div>

                                                    <div className="mt-1 flex justify-between items-center gap-2">
                                                        <button
                                                            type="button"
                                                            className={`text-white w-[2rem] h-[2rem] flex items-center justify-center rounded-full bg-black transition-all duration-300`}
                                                            onClick={() => updateUserRole(user.id, user.role)}
                                                        >
                                                            {user.role === 'admin' ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                                                        </button>
                                                        <button type="button" className="bg-black p-2 rounded-full text-white"
                                                            onClick={() => deleteUser(user.id)}>
                                                            <IoMdTrash size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-5">
                                                <div className="text-[1.5rem] flex justify-center items-center font-semibold">ไม่พบข้อมูลผู่ใช้</div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

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
                                    <span className="mr-4">...</span>
                                }
                                onPageChange={handlePageClick}
                                containerClassName="flex justify-center items-center gap-2 mt-2"
                                pageClassName="block border- border-solid border-black bg-black w-10 h-10 flex items-center justify-center rounded-full text-white"
                                activeClassName="bg-black/40"
                            />
                        </>
                    )}
                </section>
            </Sidebar>
        </>
    )
}
