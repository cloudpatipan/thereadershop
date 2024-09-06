import React, { useEffect, useState } from 'react'
import OrderChart from '../components/OrderChart'
import Sidebar from '../components/Layouts/Sidebar'
import axios from 'axios';
import { PiMoneyWavyThin, PiShoppingCartSimpleThin } from "react-icons/pi";
import { PiUsersThin } from "react-icons/pi";

import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
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
    try {
      const response = await axios.get(`/api/orderDashboard`);
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

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`/api/userCount`);
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

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`/api/productCount`);
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

  const cards = [
    { title: "ยอดขายทั้งหมด", count: orderTotalSum, unit: "บาท" , icon: <PiMoneyWavyThin size={80} /> },
    { title: "ผู้ใช้ทั้งหมด", count: userCount, unit: "คน", icon: <PiUsersThin size={80} /> },
    { title: "สินค้าทั้งหมด", count: productCount, unit: "ชิ้น", icon: <PiShoppingCartSimpleThin size={80} /> },
  ]

  return (
    <Sidebar>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {
            cards?.map((card, i) => (
              <div key={i} className="bg-white rounded-lg border flex items-center justify-between p-4">
                <div className="flex flex-col">
                  <h2>{card?.title}</h2>
                  <p className="text-[1.5rem]">{card?.count}</p>
                  <p>{card?.unit}</p>
                </div>
                {card?.icon}
              </div>
            ))
          }
        </div>

        <div>
          <h1 className="text-base md:text-2xl mb-4">ออร์เดอร์สินค้า</h1>

          <div className="border p-4 rounded-lg overflow-x-scroll no-scrollbar">
            <OrderChart />
          </div>
        </div>

      </div>

    </Sidebar>
  )
}
