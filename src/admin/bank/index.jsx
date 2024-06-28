import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Layouts/Sidebar';
import { IoMdTrash } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";
import { HiListBullet } from "react-icons/hi2";
import { HiSquares2X2 } from "react-icons/hi2";
import { CgDetailsMore } from "react-icons/cg";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";
import { IoTrashBinOutline } from "react-icons/io5";
import { FaToggleOn } from "react-icons/fa";
import { FaToggleOff } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa6";
export default function ViewBank() {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [banks, setBanks] = useState([]);
    const [deletingId, setDeletingId] = useState(null);
    const [pageNumber, setPageNumber] = useState(0);
    const banksPerPage = 10; // จำนวนสินค้าต่อหน้า

    const handlePageClick = ({ selected }) => {
        setPageNumber(selected);
    };

    useEffect(() => {
        fetchBanks();
    }, [pageNumber]);

    const fetchBanks = async () => { // แก้ชื่อฟังก์ชั่นเป็น fetchbank แทน fectbank
        try {
            const response = await axios.get(`/api/banks`);
            setBanks(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching Banks:', error);
        }
    }

    const deleteBank = (e, id) => {
        e.preventDefault();
        setDeletingId(id);

        axios.delete(`/api/banks/${id}`).then(response => {
            if (response.data.status === 200) {
                Swal.fire({
                    icon: "success",
                    text: response.data.message,
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "black",
                    focusConfirm: false,
                });

                // อัปเดตรายการที่มีอยู่โดยการกรองออก
                setBanks(prev => prev.filter(bank => bank.id !== id));
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

    const filteredBanks = banks.filter(bank => bank.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const pageCount = Math.ceil(filteredBanks.length / banksPerPage);
    const displayedBanks = filteredBanks.slice(pageNumber * banksPerPage, (pageNumber + 1) * banksPerPage);

    const [isTableFormat, setIsTableFormat] = useState(true);

    const toggleFormat = () => {
        setIsTableFormat(!isTableFormat);
    };


    const updateBankStatus = (bank_id, status) => {
        // สลับสถานะ 0 เป็น 1 และ 1 เป็น 0
        const newStatus = status === 1 ? 0 : 1;
    
        axios.put(`/api/bank-updatestatus/${bank_id}/${newStatus}`)
            .then(response => {
                if (response.data.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        text: response.data.message,
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: 'black',
                        focusConfirm: false,
                    });
                    const updatedBanks = banks.map(bank => {
                        if (bank.id === bank_id) {
                            return {
                                ...bank,
                                status: newStatus
                            };
                        }
                        return bank;
                    });
                    setBanks(updatedBanks);
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
                    <Link to={"create"}>
                        <button type="submit" className="w-full relative flex justify-center items-center gap-2 border-2 rounded-full border-black bg-transparent py-2 px-5 font-medium uppercase text-black hover:text-white hover:bg-black transition-all duration-300">
                            <div>
                                <IoAddCircleOutline size={26} />
                            </div>
                            <div>
                                เพิ่มธนาคาร
                            </div>
                        </button>
                    </Link>

                    <div className="flex items-center gap-x-4">

                        <button onClick={toggleFormat} className="bg-black text-white rounded-full p-2">
                            {isTableFormat ? <HiSquares2X2 size={20} /> : <HiListBullet size={20} />}
                        </button>


                        <div className="relative">
                            <input type="text" placeholder="ค้นหาธนาคาร"
                                className="w-full md:w-[10rem] pl-8 placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <FaSearch className="absolute top-2 left-0" />
                        </div>
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
                                        <th className="py-1 border-b">โลโก้</th>
                                        <th className="py-1 border-b">รูปภาพ</th>
                                        <th className="py-1 border-b">ชื่อ</th>
                                        <th className="py-1 border-b">คำอธิบาย</th>
                                        <th className="py-1 border-b">สถานะ</th>
                                        <th className="py-1 border-b"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedBanks.length > 0 ? (
                                        displayedBanks
                                            .filter(bank => {
                                                // ใช้คำค้นหาในชื่อสินค้า
                                                return bank.name.toLowerCase().includes(searchTerm.toLowerCase());
                                            })
                                            .map((bank, index) => (
                                                <tr key={index}>

                                                    <td className="py-1 border-b">
                                                        {bank.logo ? (
                                                            <img className="w-12 h-12 rounded object-cover" src={`https://b3d5-2405-9800-b540-dc40-e4c6-fa23-b554-9155.ngrok-free.app/images/bank/logo/${bank.logo}`} alt="" />
                                                        ) : (
                                                            <img className="w-12 h-12 rounded object-cover" src="https://b3d5-2405-9800-b540-dc40-e4c6-fa23-b554-9155.ngrok-free.app/images/product/No_image.png" alt="No Image" />
                                                        )}
                                                    </td>

                                                    <td className="py-1 border-b">
                                                        {bank.image ? (
                                                            <img className="w-12 h-18 rounded object-cover" src={`https://b3d5-2405-9800-b540-dc40-e4c6-fa23-b554-9155.ngrok-free.app/images/bank/${bank.image}`} alt="" />
                                                        ) : (
                                                            <img className="w-12 h-18 rounded object-cover" src="https://b3d5-2405-9800-b540-dc40-e4c6-fa23-b554-9155.ngrok-free.app/images/product/No_image.png" alt="No Image" />
                                                        )}
                                                    </td>
                                                    <td className="py-1 border-b">{bank.name}</td>
                                                    <td className="py-1 border-b">{bank.description}</td>
                                                    <td className="py-1 border-b">
                                                    <button
                                                        type="button"
                                                        className={`p-2 rounded-full bg-black text-white transition-all duration-300`}
                                                        onClick={() => updateBankStatus(bank.id, bank.status)}
                                                    >
                                                        {bank.status === 1 ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                                                    </button>
                                                    </td>
                                                    <td className="py-1 border-b">
                                                        <div className="flex items-center gap-2">
                                                            <Link to={`${bank.id}/edit`}>
                                                                <button className="bg-black p-2 rounded-full text-white">
                                                                    <MdEdit size={20} />
                                                                </button>
                                                            </Link>
                                                            <button type="button" onClick={(e) => deleteBank(e, bank.id)} className="bg-black p-2 rounded-full text-white flex justify-end hover:text-red-700">
                                                                {deletingId === bank.id ? "กำลังลบ..." : <IoTrashBinOutline size={20} />}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="py-1 border-b">
                                                <div className="text-2xl font-semibold flex justify-center items-center h-20">
                                                    ไม่พบข้อมูลธนาคาร
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-8">
                                {displayedBanks.length > 0 ? (
                                    displayedBanks
                                        .filter(bank => {
                                            // ใช้คำค้นหาในชื่อสินค้า
                                            return bank.name.toLowerCase().includes(searchTerm.toLowerCase());
                                        })
                                        .map((bank, index) => (
                                            <div className="mx-auto" key={index}>
                                                <Link to={`/bank/${bank.id}`}> {/* ใส่ URL ที่เหมาะสม */}
                                                    <div className="relative overflow-hidden rounded-lg group">
                                                        <div className="absolute w-full h-full bg-black/40 flex items-center justify-center -bottom-20 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                            <div className="flex flex-col items-center text-white text-xl">
                                                                รายละเอียด
                                                                <CgDetailsMore size={28} />
                                                            </div>
                                                        </div>
                                                        {bank.image ? (
                                                            <img className="object-cover" src={`https://b3d5-2405-9800-b540-dc40-e4c6-fa23-b554-9155.ngrok-free.app/images/bank/${bank.image}`} alt="" />
                                                        ) : (
                                                            <img className="object-cover" src="https://b3d5-2405-9800-b540-dc40-e4c6-fa23-b554-9155.ngrok-free.app/images/bank/no_image.png" alt="No Image" />
                                                        )}
                                                        <div className="absolute top-1 left-1">
                                                        {bank.logo ? (
                                                            <img className="w-24 h-24 rounded-lg object-cover" src={`https://b3d5-2405-9800-b540-dc40-e4c6-fa23-b554-9155.ngrok-free.app/images/bank/${bank.logo}`} alt="" />
                                                        ) : (
                                                            <img className="w-24 h-24 rounded-lg object-cover" src="https://b3d5-2405-9800-b540-dc40-e4c6-fa23-b554-9155.ngrok-free.app/images/bank/no_image.png" alt="No Image" />
                                                        )}
                                                        </div>
                                                    </div>
                                                </Link>

                                                <h1 className="mt-2 font-bold text-xl h-[3.375rem] text-clip overflow-hidden">{bank.name}</h1>
                                                <div className="mt-1 flex justify-between items-center gap-2">
                                                    <Link to={`${bank.id}/edit`}>
                                                        <button className="bg-black p-2 rounded-full text-white">
                                                            <MdEdit size={20} />
                                                        </button>
                                                    </Link>
                                                    <button type="button" className="bg-black p-2 rounded-full text-white"
                                                        onClick={() => deleteBank(bank.id)}>
                                                        <IoMdTrash size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <div className="col-span-5">
                                        <div className="text-[1.5rem] flex justify-center items-center font-semibold">ไม่พบข้อมูลธนาคาร</div>
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
