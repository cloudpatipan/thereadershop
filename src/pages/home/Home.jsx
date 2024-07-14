import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layouts/Layout'
import ProductFeatured from './ProductFeatured'
import Header from '../../components/Header'
import ProductPopular from './ProductPupular'
import axios from 'axios'
import { PiUsersThin } from "react-icons/pi";
import { PiArchiveThin } from "react-icons/pi";
import { FiBox } from "react-icons/fi";
import Info from '../../components/Info'
import { Rings } from 'react-loader-spinner'
import CategoryAll from '../category/Category'
import CategoryList from '../category/CategoryList'
export default function Home() {

  document.title = "หน้าหลัก";

  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [productLast, setProductLast] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    const userResponse = await axios.get(`/api/userCount`);
    const productResponse = await axios.get(`/api/productCount`);

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
      }
    }

    setLoading(false);
  };

  return (
    <Layout>
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
        <>
          <Header />
          <div className="grid grid-col-1 md:grid-cols-2 gap-y-2 gap-x-2 mb-1">
            <div className="bg-white rounded-lg border flex items-center justify-between p-4">
              <div className="flex flex-col text-sm">
                <p>ผู้ใช้ทั้งหมด</p>
                <p className="text-base">{userCount}</p>
                <p>คน</p>
              </div>
              <PiUsersThin size={80} />
            </div>

            <div className="bg-white rounded-lg border flex items-center justify-between p-4">
            <div className="flex flex-col text-sm">
                <h2>สินค้าทั้งหมด</h2>
                <p className="text-base">{productCount}</p>
                <p>ชิ้น</p>
              </div>
              <PiArchiveThin size={80} />
            </div>

          </div>
          <Info>
            {productLast.name}
          </Info>
          <CategoryList/>
          <ProductFeatured/>
          <ProductPopular/>
        </>
      )}
    </Layout>
  );
}
