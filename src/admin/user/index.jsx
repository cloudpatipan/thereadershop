import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Layouts/Sidebar';
import { CiSearch } from "react-icons/ci";
import { PiToggleRight, PiTrashSimpleThin } from "react-icons/pi";
import { PiListBulletsThin } from "react-icons/pi";
import { PiSquaresFourThin } from "react-icons/pi";
import { PiToggleLeftThin } from "react-icons/pi";
import { PiToggleRightThin } from "react-icons/pi";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";
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
            if (response.data.status === 200) {
                setUsers(response.data.users);
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

        try {
            const response = await axios.delete(`/api/users/${id}`);
            if (response.data.status === 200) {
                Swal.fire({
                    icon: "success",
                    text: response.data.message,
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "black",
                    focusConfirm: false,
                });
                fetchUsers();
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


    const updateUserRole = async(user_id, role) => {
        // สลับสถานะ 0 เป็น 1 และ 1 เป็น 0
        const newRole = role === 'admin' ? 'user' : 'admin';

        try {
            const response = await axios.put(`/api/user-updaterole/${user_id}/${newRole}`);
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
        } catch (error) {
            Swal.fire({
              icon: "warning",
              text: error,
              confirmButtonText: "ตกลง",
              confirmButtonColor: "black",
              focusConfirm: false,
            });
          }
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
                                <button onClick={toggleFormat} className="border rounded-full w-10 h-10 flex items-center justify-center">
                                    {isTableFormat ? <PiSquaresFourThin size={20} /> : <PiListBulletsThin size={20} />}
                                </button>

                                <div className="relative">
                                    <input type="text" placeholder="ค้นหาบัญชีผู้ใช้"
                                        className="w-[10rem] pl-8 placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                    <CiSearch className="absolute top-2 left-0" />
                                </div>
                            </div>

                            <div className="border p-4 rounded overflow-x-scroll no-scrollbar">
                                {isTableFormat ? (
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left py-1 border-b">
                                                <th>รหัส</th>
                                                <th>รูปภาพ</th>
                                                <th>ชื่อ</th>
                                                <th>ระดับ</th>
                                                <th>ปรับระดับ</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displayedUsers.length > 0 ? (
                                                displayedUsers.map((user, index) => (
                                                    <tr key={index} className="border-b py-1">
                                                        <td>{user.id}</td>
                                                        <td>
                                                            <div className="w-[3rem] h-[3rem] overflow-hidden rounded-lg">
                                                                {user.avatar ? (
                                                                    <img className="w-full h-full object-cover" src={`${baseUrl}/images/avatar/${user.avatar}`} alt={`รูปภาพของ ${user.name}`} />
                                                                ) : (
                                                                    <img className="w-full h-full object-cover" src={`${baseUrl}/images/product/no_image.png`} alt={`ไม่มีรูปภาพ`} />
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td>{user.name}</td>
                                                        <td><span className="border rounded-full px-2">{user.role}</span></td>
                                                        <td>
                                                            <button
                                                                type="button"
                                                                className={`w-[2rem] h-[2rem] flex items-center justify-center rounded-full border transition-all duration-300`}
                                                                onClick={() => updateUserRole(user.id, user.role)}
                                                            >
                                                                {user.role === 'admin' ? <PiToggleRightThin size={25} /> : <PiToggleLeftThin size={25} />}
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <div className="flex items-center gap-2">
                                                                <button type="button" className="border p-2 rounded-full"
                                                                    onClick={() => deleteUser(user.id)}>
                                                                    <PiTrashSimpleThin size={20} />
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
                                                        <div className="absolute w-full h-full flex items-center justify-center"></div>
                                                        {user.avatar ? (
                                                            <img className="w-full h-full object-cover" src={`${baseUrl}/images/avatar/${user.avatar}`} alt="" />
                                                        ) : (
                                                            <img className="w-full h-full object-cover" src={`${baseUrl}/images/product/no_image.png`} alt={`ไม่มีรูปภาพ`} />
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col gap-4">

                                                        <div className="flex justify-between items-center mt-2">
                                                            <p className="text-clip overflow-hidden">{user.name}</p>
                                                            <p className="border rounded-full px-2 w-[40%]">{user.role}</p>
                                                        </div>

                                                        <div className="flex justify-between items-center border-t py-1">
                                                            <button
                                                                type="button"
                                                                className={`w-[2rem] h-[2rem] flex items-center justify-center rounded-full border transition-all duration-300`}
                                                                onClick={() => updateUserRole(user.id, user.role)}
                                                            >
                                                                {user.role === 'admin' ? <PiToggleRightThin size={25} /> : <PiToggleLeftThin size={25} />}
                                                            </button>
                                                            <button type="button" className="border w-[2rem] h-[2rem] rounded-full flex items-center justify-center transition-all duration-300"
                                                                onClick={() => deleteUser(user.id)}>
                                                                <PiTrashSimpleThin size={20} />
                                                            </button>
                                                        </div>

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

                        </>
                    )}
                </section>
            </Sidebar>
        </>
    )
}
