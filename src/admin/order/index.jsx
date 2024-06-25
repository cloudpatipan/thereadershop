import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Layouts/Sidebar';
import { FaSearch } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import { IoMdArrowDropright, IoMdArrowDropleft } from 'react-icons/io';
import { IoAddCircleOutline } from 'react-icons/io5';
import { IoTrashBinOutline } from 'react-icons/io5';
import { FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { BiShow } from "react-icons/bi";
import Modal from '../../components/Modal';
import Button from '../../components/Button';
export default function ViewOrder() {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [deletingId, setDeletingId] = useState(null);
    const [updateStatus, setUpdateStatus] = useState(null);
    const orderPerPage = 10; // จำนวนสินค้าต่อหน้า

    useEffect(() => {
        fetchOrder();
    }, [pageNumber, updateStatus]);

    const fetchOrder = async () => {
        try {
            const response = await axios.get(`/api/orders`);
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching order:', error);
        }
    };

    const fetchOrderItems = async (orderId) => { // ฟังก์ชันสำหรับโหลดข้อมูล order items ตาม orderId
        try {
            const response = await axios.get(`/api/orders/${orderId}/orderitems`);
            setOrderItems(response.data);
        } catch (error) {
            console.error('Error fetching order items:', error);
        }
    };

    const pageCount = Math.ceil(orders.total / orderPerPage); // จำนวนหน้าทั้งหมด

    const handlePageClick = ({ selected }) => {
        setPageNumber(selected);
    };

    const deleteOrder = (e, id) => {
        e.preventDefault();
        setDeletingId(id);

        axios.delete(`/api/orders/${id}`).then(response => {
            if (response.data.status === 200) {
                Swal.fire({
                    icon: 'success',
                    text: response.data.message,
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: 'black',
                    focusConfirm: false,
                });

                // อัปเดตรายการที่มีอยู่โดยการโหลดข้อมูลใหม่
                fetchOrder();
                setDeletingId(null); // เครียทุกอย่างใน ไอดี ตระกร้า
            } else if (response.data.status === 400) {
                Swal.fire({
                    icon: 'error',
                    text: response.data.message,
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: 'black',
                    focusConfirm: false,
                });
                setDeletingId(null);
            }
        });
    };

    const updateOrderStatus = (order_id, status) => {
        // สลับสถานะ 0 เป็น 1 และ 1 เป็น 0
        const newStatus = status === 1 ? 0 : 1;

        axios.put(`/api/order-updatestatus/${order_id}/${newStatus}`)
            .then(response => {
                if (response.data.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        text: response.data.message,
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: 'black',
                        focusConfirm: false,
                    });
                    const updatedOrders = orders.map(order => {
                        if (order.id === order_id) {
                            return {
                                ...order,
                                status: newStatus
                            };
                        }
                        return order;
                    });
                    setOrders(updatedOrders);
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

    const [isModalOrder, setIsModalOrder] = useState({});

    const openModalOrder = (orderId) => {
        setIsModalOrder((prev) => ({ ...prev, [orderId]: true }));
    };

    const closeModalOrder = (orderId) => {
        setIsModalOrder((prev) => ({ ...prev, [orderId]: false }));
    };

    return (
        <>
            <Sidebar>

                <div className="flex justify-end items-center gap-4  mb-2 rounded-lg">

                    <div className="relative">
                        <input type="text" placeholder="ค้นหารายการใบสั่งซื้อ"
                            className="w-[10rem] pl-8 placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
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
                                    <th className="py-1 border-b">ชื่อ</th>
                                    <th className="py-1 border-b">นามสกุล</th>
                                    <th className="py-1 border-b">เลขที่ EMS</th>
                                    <th className="py-1 border-b">สถานะ</th>
                                    <th className="py-1 border-b">ดู</th>
                                    <th className="py-1 border-b"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length > 0 ? (
                                    orders
                                        .filter(order => {
                                            // ใช้คำค้นหาในชื่อสินค้า
                                            return order.tracking_no.toLowerCase().includes(searchTerm.toLowerCase());
                                        })
                                        .map((order, index) => (
                                            <tr key={index}>
                                                <td className="py-1 border-b">{order.id}</td>
                                                <td className="py-1 border-b">{order.firstname}</td>
                                                <td className="py-1 border-b">{order.lastname}</td>
                                                <td className="py-1 border-b">{order.tracking_no}</td>
                                                <td className="py-1 border-b">
                                                    <button
                                                        type="button"
                                                        className={`p-2 rounded-full bg-black text-white transition-all duration-300`}
                                                        onClick={() => updateOrderStatus(order.id, order.status)}
                                                    >
                                                        {order.status === 1 ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                                                    </button>
                                                </td>

                                                <td className="py-1 border-b">
                                                <Link to={`${order.id}`}>
                                                <button type="button" className="bg-black p-2 rounded-full text-white flex justify-end">
                                                        <BiShow size={20} />
                                                    </button>
                                                </Link>

                                                </td>
                                                <td className="py-1 border-b">
                                                    <div className="flex items-center gap-2">
                                                        <button type="button" onClick={(e) => deleteOrder(e, order.id)} className="bg-black p-2 rounded-full text-white flex justify-end hover:text-red-700">
                                                            {deletingId === order.id ? "กำลังลบ..." : <IoTrashBinOutline size={20} />}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                ) : (
                                    <tr>
                                        <td className="py-1 border-b text-[1.5rem] font-semibold text-center" colSpan={8}>
                                            ไม่พบข้อมูลรายการใบสั่งซื้อ
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div >
                )
                }
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
            </Sidebar >
        </>
    )
}
