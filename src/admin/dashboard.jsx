import React, { useEffect, useState } from 'react'
import OrderChart from '../components/OrderChart'
import Sidebar from '../components/Layouts/Sidebar'
import axios from 'axios';
import { FaUserFriends } from "react-icons/fa";
import { TbCashBanknoteFilled } from "react-icons/tb";
import { FaBox } from "react-icons/fa";
export default function Dashboard() {

  const [orderTotalSum, setOrderTotalSum] = useState([]);
  const [userCount, setUserCount] = useState([]);
  const [productCount, setProductCount] = useState([]);

  useEffect(() => {
    fetchOrder();
    fetchUsers();
    fetchProducts();
  }, []);

  const fetchOrder = async () => { 
    axios.get(`/api/orderDashboard`).then(response => {
        if (response.data.status === 200) {
          const orders = response.data.orders;
          const values = orders.map(data =>
            data.orderitems.reduce((total, item) => total + item.price, 0)
          );
          const sum = values.reduce((acc, value) => acc + value, 0);
          setOrderTotalSum(sum);
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
      })
  }

    const fetchUsers = async () => { 
      axios.get(`/api/userDashboard`).then(response => {
        if (response.data.status === 200) {
          const userCount = response.data.users;
          setUserCount(userCount);
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
        }
      })
    }

    const fetchProducts = async () => { 
      axios.get(`/api/productDashboard`).then(response => {
        if (response.data.status === 200) {
          const productCount = response.data.products;
          setProductCount(productCount);
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
        }
      })
    }


  return (
    <Sidebar>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

      <div className="bg-white rounded-lg border flex items-center justify-between p-4">
          <div className="flex flex-col">
            <h2>ยอดขายทั้งหมด</h2>
            <p className="text-[1.5rem] font-semibold">{orderTotalSum}</p>
            <p>บาท</p>
          </div>
          <TbCashBanknoteFilled size={100}/>
        </div>

        <div className="bg-white rounded-lg border flex items-center justify-between p-4">
          <div className="flex flex-col">
            <h2>ผู้ใช้ทั้งหมด</h2>
            <p className="text-[1.5rem] font-semibold">{userCount}</p>
            <p>คน</p>
          </div>
          <FaUserFriends size={100}/>
        </div>

        <div className="bg-white rounded-lg border flex items-center justify-between p-4">
          <div className="flex flex-col">
            <h2>สินค้าทั้งหมด</h2>
            <p className="text-[1.5rem] font-semibold">{productCount}</p>
            <p>คน</p>
          </div>
          <FaBox size={80}/>
        </div>

      </div>

      <div className="border p-4 rounded-lg overflow-x-scroll">
          <OrderChart />
        </div>

    </Sidebar>
  )
}
