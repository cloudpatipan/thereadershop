import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
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

    const navigate = useNavigate();

    useEffect(() => {
        fetchBanks();
    }, [pageNumber]);

    const fetchBanks = async () => {
        try {
            const response = await axios.get(`/api/banks`);
            if (response.data.status === 200) {
                setBanks(response.data.banks);
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

    const deleteBank = async (e, id) => {
        e.preventDefault();
        setDeletingId(id);

        try {
            const response = await axios.delete(`/api/banks/${id}`);
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
        } catch (error) {
            if (error.response.status === 401) {
                Swal.fire({
                    icon: "warning",
                    text: "กรุณาเข้าสู่ระบบ",
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "black",
                    focusConfirm: false,
                });
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

    const filteredBanks = banks.filter(bank => bank.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const pageCount = Math.ceil(filteredBanks.length / banksPerPage);
    const displayedBanks = filteredBanks.slice(pageNumber * banksPerPage, (pageNumber + 1) * banksPerPage);

    const [isTableFormat, setIsTableFormat] = useState(true);

    const toggleFormat = () => {
        setIsTableFormat(!isTableFormat);
    };


    const updateBankStatus = async (bank_id, status) => {
        // สลับสถานะ 0 เป็น 1 และ 1 เป็น 0
        const newStatus = status === 1 ? 0 : 1;

        try {
            const response = await axios.put(`/api/bank-updatestatus/${bank_id}/${newStatus}`);
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

                    <div className="flex items-center gap-x-4">

                        <button onClick={toggleFormat} className="border  rounded-full p-2">
                            {isTableFormat ? <PiSquaresFourThin size={20} /> : <PiListBulletsThin size={20} />}
                        </button>


                        <div className="relative">
                            <input type="text" placeholder="ค้นหาธนาคาร"
                                className="w-full md:w-[10rem] pl-8 placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <CiSearch className="absolute top-2 left-0" />
                        </div>
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
                                                            <img className="w-12 h-12 rounded object-cover" src={`${baseUrl}/images/bank/logo/${bank.logo}`} alt="" />
                                                        ) : (
                                                            <img className="w-full h-full object-cover" src={`${baseUrl}/images/product/No_image.png`} alt={`ไม่มีรูปภาพ`} />
                                                        )}
                                                    </td>

                                                    <td className="py-1 border-b">
                                                        {bank.image ? (
                                                            <img className="w-12 h-18 rounded object-cover" src={`${baseUrl}/images/bank/${bank.image}`} alt="" />
                                                        ) : (
                                                            <img className="w-full h-full object-cover" src={`${baseUrl}/images/product/No_image.png`} alt={`ไม่มีรูปภาพ`} />
                                                        )}
                                                    </td>
                                                    <td className="py-1 border-b">{bank.name}</td>
                                                    <td className="py-1 border-b"><div className="text-justify w-full" dangerouslySetInnerHTML={{ __html: bank.description }} /></td>
                                                    <td className="py-1 border-b">
                                                        <button
                                                            type="button"
                                                            className={`p-2 rounded-full border  transition-all duration-300`}
                                                            onClick={() => updateBankStatus(bank.id, bank.status)}
                                                        >
                                                            {bank.status === 1 ? <PiToggleRightThin size={25} /> : <PiToggleLeftThin size={25} />}
                                                        </button>
                                                    </td>
                                                    <td className="py-1 border-b">
                                                        <div className="flex items-center gap-2">
                                                            <Link to={`${bank.id}/edit`}>
                                                                <button className="border p-2 rounded-full ">
                                                                    <CiEdit size={20} />
                                                                </button>
                                                            </Link>
                                                            <button type="button" onClick={(e) => deleteBank(e, bank.id)} className="border p-2 rounded-full  flex justify-end hover:text-red-700">
                                                                {deletingId === bank.id ? "กำลังลบ..." : <PiTrashSimpleThin size={20} />}
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

                                                        {bank.image ? (
                                                            <img className="object-cover" src={`${baseUrl}/images/bank/${bank.image}`} alt="" />
                                                        ) : (
                                                            <img className="w-full h-full object-cover" src={`${baseUrl}/images/product/No_image.png`} alt={`ไม่มีรูปภาพ`} />
                                                        )}
                                                        <div className="absolute top-1 left-1">
                                                            {bank.logo ? (
                                                                <img className="w-24 h-24 rounded-lg object-cover" src={`${baseUrl}/images/bank/logo/${bank.logo}`} alt="" />
                                                            ) : (
                                                                <img className="w-full h-full object-cover" src={`${baseUrl}/images/product/No_image.png`} alt={`ไม่มีรูปภาพ`} />
                                                            )}
                                                        </div>
                                                    </div>
                                                </Link>

                                                <h1 className="mt-2 h-[3.375rem] text-clip overflow-hidden">{bank.name}</h1>
                                                <div className="mt-1 flex justify-between items-center gap-2">
                                                    <Link to={`${bank.id}/edit`}>
                                                        <button className="border p-2 rounded-full ">
                                                            <CiEdit size={20} />
                                                        </button>
                                                    </Link>
                                                    <button type="button" className="border p-2 rounded-full "
                                                        onClick={() => deleteBank(bank.id)}>
                                                        <PiTrashSimpleThin size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <div className="col-span-5">
                                        <div className="flex justify-center items-center font-semibold">ไม่พบข้อมูลธนาคาร</div>
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
