import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { CgDetailsMore } from "react-icons/cg";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import Button from '../../components/Button';
import Layout from '../../components/Layouts/Layout';
import baseUrl from '../../routes/BaseUrl';
import { Rings } from 'react-loader-spinner';
import Swal from 'sweetalert2';
import { PiArrowFatLineLeftThin, PiArrowFatLineRightThin } from 'react-icons/pi';
export default function BrandProduct() {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [brand, setBrand] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const { slug } = useParams();
    const productsPerPage = 12; // จำนวนสินค้าต่อหน้า

    useEffect(() => {
        fetchProducts();
    }, [pageNumber]);

    const handlePageClick = ({ selected }) => {
        setPageNumber(selected);
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`/api/product/brand/${slug}`);
            if (response.data.status === 200) {
                setProducts(response.data.product_data.product);
                setBrand(response.data.product_data.brand);
                document.title = response.data.product_data.brand.name
                setLoading(false);
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

    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const pageCount = Math.ceil(filteredProducts.length / productsPerPage);
    const displayedProducts = filteredProducts.slice(pageNumber * productsPerPage, (pageNumber + 1) * productsPerPage);

    return (
        <Layout>
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
                <div>

                    <div className="flex flex-col md:flex-row justify-between">

                        <div>
                            <h1 className="text-base">แบรนด์หนังสือ {brand.name}</h1>
                        </div>

                        <div className="relative">
                            <input type="text" placeholder={`ค้นหาหนังสือ ${brand.name}`}
                                className="w-full md:w-[10rem] pl-8 placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <FaSearch className="absolute top-2 left-0" />
                        </div>

                    </div>

                    <Link to={`/brand`}>
                        <Button icon={<PiArrowFatLineLeftThin size={20} />} className={`mb-4`}>
                            กลับ
                        </Button>
                    </Link>

                    <div>
                        <div className={`grid grid-container grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4`}>
                            {displayedProducts.length > 0 ? (
                                displayedProducts
                                    .filter(product => {
                                        // ใช้คำค้นหาในชื่อสินค้า
                                        return product.name.toLowerCase().includes(searchTerm.toLowerCase());
                                    })
                                    .map((product, index) => (
                                        <div key={index}>
                                            <Link to={`/product/detail/${product.slug}`}>
                                                <div className="relative overflow-hidden rounded-lg group h-[16rem]">
                                                    <div className="absolute w-full h-full bg-black/40 flex items-center justify-center group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                        <div className="flex flex-col items-center text-white text-xl">
                                                            รายละเอียด
                                                            <CgDetailsMore size={28} />
                                                        </div>
                                                    </div>
                                                    {product.image ? (
                                                        <img className="w-full h-full object-cover" src={`${baseUrl}/images/product/${product.image}`} alt={`รูปภาพสินค้า ${product.name}`} />
                                                    ) : (
                                                        <img className="w-full h-full object-cover" src={`${baseUrl}/images/product/no_image.png`} alt={`ไม่มีรูปภาพ`} />
                                                    )}
                                                </div>
                                            </Link>
                                            <div className="mt-1">
                                                <p className="text-sm text-ellipsis overflow-hidden text-balance h-[4rem]">{product.name}</p>
                                                <p className="text-xs text-clip overflow-hidden text-black/40 font-semibold">{product.brand.name}</p>
                                                <span className="text-base">{product.price} บาท</span>
                                            </div>
                                        </div>

                                    ))
                            ) : (
                                <div className="flex items-center justify-center rounded-lg col-span-3 md:col-span-6">
                                    <span className="text-3xl font-semibold">ไม่มีสินค้า</span>
                                </div>
                            )}

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
                    </div>
                </div>
            )}

        </Layout>
    );
}