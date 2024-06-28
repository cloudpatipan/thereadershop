import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layouts/Layout'
import ProductFeatured from './ProductFeatured'
import Header from '../../components/Header'
import ProductPopular from './ProductPupular'
import axios from 'axios'
import { FaUserFriends } from "react-icons/fa";
import { FaBox } from "react-icons/fa";
import Info from '../../components/Info'

export default function Home() {

  document.title = "หน้าหลัก";

  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [productLast, setProductLast] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userResponse = await axios.get(`/api/userDashboard`);
      const productResponse = await axios.get(`/api/productDashboard`);
      const featuredResponse = await axios.get(`/api/products-featured`);
      const popularResponse = await axios.get(`/api/products-popular`);

      if (userResponse.data.status === 200) {
        setUserCount(userResponse.data.users)
      }

      if (productResponse.data.status === 200) {
        const { products, lastProduct } = productResponse.data;

        // เซ็ตจำนวนผลิตภัณฑ์
        setProductCount(products);

        // ตรวจสอบว่ามีข้อมูลผลิตภัณฑ์ที่รับมาหรือไม่
        if (lastProduct) {
          const { id, name } = lastProduct;
          const formattedLastProduct = {
            id,
            name,
          };
          setProductLast(formattedLastProduct);
          console.log(formattedLastProduct);
        }
      }

      setFeaturedProducts(featuredResponse.data);
      setPopularProducts(popularResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <Layout>
      {loading ? (
        <div className="flex items-center justify-center">
          <span className="text-3xl font-semibold">กำลังโหลด...</span>
        </div>
      ) : (
        <>
          <Header />
          <div className="grid grid-col-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg border flex items-center justify-between p-4">
              <div className="flex flex-col">
                <h2>ผู้ใช้ทั้งหมด</h2>
                <p className="text-[1.5rem] font-semibold">{userCount}</p>
                <p>คน</p>
              </div>
              <FaUserFriends size={100} />
            </div>

            <div className="bg-white rounded-lg border flex items-center justify-between p-4">
              <div className="flex flex-col">
                <h2>สินค้าทั้งหมด</h2>
                <p className="text-[1.5rem] font-semibold">{productCount}</p>
                <p>ชิ้น</p>
              </div>
              <FaBox size={80} />
            </div>

          </div>
          <Info>
            {productLast.name}
          </Info>
          <ProductFeatured products={featuredProducts} />
          <ProductPopular products={popularProducts} />
        </>
      )}
    </Layout>
  );
}
