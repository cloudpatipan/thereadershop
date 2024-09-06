import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react';
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
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import baseUrl from '../../routes/BaseUrl';
import { Rings } from 'react-loader-spinner';
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
                        return product;
                    });
                    setProducts(updatedProducts);
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
                                    <th>ชื่อ</th>
                                    <th>นามสกุล</th>
                                    <th>เลขที่ EMS</th>
                                    <th>สถานะ</th>
                                    <th>ดู</th>
                                    <th></th>
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
                                                <td>{order.id}</td>
                                                <td>{order.firstname}</td>
                                                <td>{order.lastname}</td>
                                                <td>{order.tracking_no}</td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className={`p-2 rounded-full border  transition-all duration-300`}
                                                        onClick={() => updateOrderStatus(order.id, order.status)}
                                                    >
                                                        {order.status === 1 ? <PiToggleRightThin size={25} /> : <PiToggleLeftThin size={25} />}
                                                    </button>
                                                </td>

                                                <td>
                                                    <Link to={`${order.id}`}>
                                                        <button type="button" className="border p-2 rounded-full  flex justify-end">
                                                            <PiEyeThin size={20} />
                                                        </button>
                                                    </Link>

                                                </td>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <button type="button" onClick={(e) => deleteOrder(e, order.id)} className="border p-2 rounded-full  flex justify-end hover:text-red-700">
                                                            {deletingId === order.id ? "กำลังลบ..." : <PiTrashSimpleThin size={20} />}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                ) : (
                                    <tr>
                                        <td className="py-1 border-b text-[1.5rem] text-center" colSpan={8}>
                                            ไม่พบข้อมูลรายการใบสั่งซื้อ
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div >
                )
                }
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

            </Sidebar >
        </>
    )
}
