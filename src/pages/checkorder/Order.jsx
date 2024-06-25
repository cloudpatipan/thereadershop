import React, { useState, useEffect, useContext } from 'react';
import Layout from '../../components/Layouts/Layout';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaPlus, FaMinus } from "react-icons/fa6";
import { IoTrashBinOutline } from "react-icons/io5";
import Button from '../../components/Button';
import { IoBagCheckOutline } from "react-icons/io5";
export default function Order() {

    document.title = "รายการสั่งซื้อ";

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrder();
    }, []);

    const fetchOrder = async () => {
        axios.get(`/api/order-list`).then(response => {
            if (response.data.status === 200) {
                setOrders(response.data.orders);
                setLoading(false);
                console.log(response.data.orders)
            } else if (response.data.status === 400) {
                Swal.fire({
                    icon: "error",
                    text: response.data.message,
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "black",
                    focusConfirm: false,
                });
            } else if (response.data.status === 401) {
                Swal.fire({
                    icon: "warning",
                    text: response.data.message,
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "black",
                    focusConfirm: false,
                });
                navigate('/');
            }
        });
    }

    return (
        <Layout>
            <section>
                {loading ? (
                    <div className="flex items-center justify-center">
                        <h1 className="text-[2rem] font-semibold">กำลังโหลดรายการสั่งซื้อ...</h1>
                    </div>
                ) : (
                    <div>
                    <h1 className="mb-4 text-base md:text-2xl font-semibold">รายการสังซื้อ</h1>
                    <div className="p-4 border rounded-lg">

                        <table className="w-full overflow-x-scroll text-sm md:text-base">
                            <thead>
                                <tr className="text-left">
                                    <th className="py-1 border-b">เลขที่สั่งซื้อ</th>
                                    <th className="py-1 border-b">ชื่อ</th>
                                    <th className="py-1 border-b">นามสกุล</th>
                                    <th className="py-1 border-b">ชำระเงินโดย</th>
                                    <th className="py-1 border-b">เลข EMS</th>
                                    <th className="py-1 border-b">สถานะ</th>
                                    <th className="py-1 border-b"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length > 0 ? (
                                    orders.map((order, index) => (
                                        <tr key={index}>
                                            <td className="py-1 border-b">{order.id}</td>
                                            <td className="py-1 border-b">{order.firstname}</td>
                                            <td className="py-1 border-b">{order.lastname}</td>
                                            <td className="py-1 border-b">{order.payment_mode}</td>
                                            <td className="py-1 border-b">{order.tracking_no}</td>
                                            <td className="py-1 border-b">{order.status === 1 ? "จัดส่งสินค้าเรียบร้อย" : "รอตรวจสอบ"}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="py-1 border-b">
                                            <div className="text-2xl font-semibold flex justify-center items-center h-20">
                                                ไม่พบรายการสั่งซื้อ
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    </div>
                )}
            </section>
        </Layout>
    )
}
