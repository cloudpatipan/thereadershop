import React, { useState, useEffect, useContext } from 'react';
import Layout from '../../components/Layouts/Layout';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Rings } from 'react-loader-spinner'
import Button from '../../components/Button';
import { IoMdArrowDropleft } from "react-icons/io";
import { PiArrowFatLineLeftThin } from 'react-icons/pi';
export default function Order() {

    document.title = "รายการสั่งซื้อ";

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrder();
    }, []);

    const fetchOrder = async () => {
        try {
            const response = await axios.get(`/api/order-list`);
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
            {loading ? (
                (<Rings
                    visible={true}
                    height="500"
                    width="500"
                    color="black"
                    ariaLabel="rings-loading"
                    wrapperStyle={{}}
                    wrapperClass="flex justify-center"
                />)
            ) : (
                <Layout>
                    <h1 className="mb-4 text-xl">รายการสังซื้อ</h1>

                    <Link to={`/cart`}>
                        <Button name={'กลับ'} icon={<PiArrowFatLineLeftThin size={20} />} className={`mb-4`} />
                    </Link>

                    <div className="p-4 border rounded-lg overflow-x-scroll no-scrollbar">

                        <table className="w-full">
                            <thead>
                                <tr className="text-left py-1 border-b">
                                    <th>เลขที่สั่งซื้อ</th>
                                    <th>ชื่อ</th>
                                    <th>นามสกุล</th>
                                    <th>ชำระเงินโดย</th>
                                    <th>เลข EMS</th>
                                    <th>สถานะ</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length > 0 ? (
                                    orders.map((order, index) => (
                                        <tr className="py-1 border-b" key={index}>
                                            <td>{order.id}</td>
                                            <td>{order.firstname}</td>
                                            <td>{order.lastname}</td>
                                            <td>{order.payment_mode}</td>
                                            <td>{order.tracking_no}</td>
                                            <td>{order.status === 1 ? "จัดส่งสินค้าเรียบร้อย" : "รอตรวจสอบ"}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="border text-center" colSpan={8}>
                                            <div className="text-2xl">
                                                ไม่พบรายการสั่งซื้อ
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Layout>
            )}
        </>
    )
}
