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
    const response = await axios.get(`/api/products-popular`);
    setProducts(response.data);
    setLoading(false);
  }


  const addToCart = async (e, product_id) => {
    const data = {
      product_id: product_id,
      product_qty: quantity,
    };

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
  }


  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(pageNumber * productsPerPage, (pageNumber + 1) * productsPerPage);

  return (
    <section>
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

          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between">

              <div>
                <h1 className="text-base">แนะนำสินค้ายอดนิยม</h1>
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
                          <Button onClick={(e) => addToCart(e, product.id)} className={`w-full mt-1`} icon={<IoCartOutline size={20} />}>
                            เพิ่ม
                          </Button>
                        ) : (
                          <Button type="disabled" icon={<MdOutlineErrorOutline size={25} />}>
                            สินค้าหมด
                          </Button>
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
        </>
      )}
    </section>
  );
}
