import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { CgDetailsMore } from "react-icons/cg";
import { IoMdArrowDropright, IoMdArrowDropleft } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { MdOutlineErrorOutline } from "react-icons/md";
import { IoCartOutline } from "react-icons/io5";
import Button from '../../components/Button';
import { CartContext } from '../../context/CartContext';
import baseUrl from '../../routes/BaseUrl';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Rings } from 'react-loader-spinner';
import { PiArrowFatLineLeftThin, PiArrowFatLineRightThin, PiShoppingCartSimpleThin } from 'react-icons/pi';
export default function ProductPopular() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const [quantity, setQuantity] = useState(1); // จำนวนสินค้าค่าเริ่ม ต้นเป็น 1
  const { setCartCount } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const productsPerPage = 12;
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchProduct();
  }, [pageNumber]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products-popular`);
      if (response.data.status === 200) {
        setProducts(response.data.products);
        setLoading(false);
      }
    } catch (error) {
      Swal.fire({
        icon: "warning",
        text: "กรุณาเข้าสู่ระบบ",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "black",
        focusConfirm: false,
      });
    }
  }


  const addToCart = async (product_id) => {

    const data = {
      product_id: product_id,
      product_qty: quantity,
    };

    try {
      const response = await axios.post('/api/add-to-cart', data);
      if (response.data.status === 200) {
        setCartCount((prevCount) => prevCount + 1);
        Swal.fire({
          icon: "success",
          text: response.data.message,
          confirmButtonText: "ตกลง",
          confirmButtonColor: "black",
          focusConfirm: false,
        });
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
        text: "กรุณาเข้าสู่ระบบ",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "black",
        focusConfirm: false,
      });
    }
  }

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(pageNumber * productsPerPage, (pageNumber + 1) * productsPerPage);

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
        <>

          <div className="border rounded-lg p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">

              <div>
                <h1 className="text-xl">แนะนำสินค้ายอดนิยม</h1>
              </div>

              <div className="relative">
                <input type="text" placeholder="ค้นหาสินค้ายอดนิยม"
                  className="md:w-[10rem] w-full pl-8 placeholder:text-sm text-sm border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <FaSearch className="absolute top-2 left-0" />
              </div>

            </div>

            <div>
              <div className={`grid grid-container grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 my-1`}>
                {displayedProducts.length > 0 ? (
                  displayedProducts.map((product, index) => (
                    <div key={index} className="overflow-hidden">
                      <Link to={`/product/detail/${product.slug}`}>
                        <div className="relative overflow-hidden rounded-lg group h-[16rem]">
                          <div className="absolute w-full h-full bg-black/40 flex items-center justify-center group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <div className="flex flex-col items-center text-white text-xl">
                              รายละเอียด
                              <CgDetailsMore size={28} />
                            </div>
                          </div>
                          {product.image ? (
                            <img className="rounded-lg w-full h-full object-cover" src={`${baseUrl}/images/product/${product.image}`} alt={`รูปภาพสินค้า ${product.name}`} />
                          ) : (
                            <img className="w-full h-full object-cover" src={`${baseUrl}/images/product/no_image.png`} alt={`ไม่มีรูปภาพ`} />
                          )}
                        </div>
                      </Link>
                      <div className="mt-1">
                        <p className="text-sm text-ellipsis overflow-hidden text-balance h-[4rem]">{product.name}</p>
                        <p className="text-xs text-clip overflow-hidden text-black/40 font-semibold">{product.category.name}</p>
                        <span className="text-base">{product.price} บาท</span>
                        {product.qty > 0 ? (
                          <Button onClick={(e) => addToCart(product.id)} className={`w-full mt-1`} name={'เพิ่ม'} icon={<PiShoppingCartSimpleThin size={20} />} />
                        ) : (
                          <Button type="disabled" name={'สินค้าหมด'} icon={<MdOutlineErrorOutline size={25} />} />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center rounded-lg col-span-3 md:col-span-6">
                    <span className="text-3xl font-semibold">ไม่มีสินค้ายอดนิยม</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {pageCount > 1 && (
                        <ReactPaginate
                            previousLabel={
                                <span className="w-10 h-10 flex items-center justify-center border rounded-full">
                                    <PiArrowFatLineLeftThin size={20} />
                                </span>
                            }
                            nextLabel={
                                <span className="w-10 h-10 flex items-center justify-center border rounded-full">
                                    <PiArrowFatLineRightThin size={20} />
                                </span>
                            }
                            pageCount={pageCount}
                            breakLabel={<span className="mr-4">...</span>}
                            onPageChange={handlePageClick}
                            containerClassName="flex justify-center items-center gap-2 mt-2"
                            pageClassName="block w-10 h-10 flex items-center justify-center border rounded-full"
                            activeClassName="bg-black text-white"
                        />
                    )}
        </>
      )}
    </>
  );
}
