import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Layouts/Sidebar';
import { CiEdit } from "react-icons/ci";
import { PiPlusThin } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";
import { PiTrashSimpleThin } from "react-icons/pi";
import { PiListBulletsThin } from "react-icons/pi";
import { PiSquaresFourThin } from "react-icons/pi";
import { PiToggleLeftThin } from "react-icons/pi";
import { PiToggleRightThin } from "react-icons/pi";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";
import { PiArticleThin } from "react-icons/pi";
import baseUrl from '../../routes/BaseUrl';
import { Rings } from 'react-loader-spinner';
import Button from '../../components/Button';
export default function ViewProduct() {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [deletingId, setDeletingId] = useState(null);
    const [updateStatus, setUpdateStatus] = useState(null);
    const [pageNumber, setPageNumber] = useState(0);
    const productsPerPage = 10; // จำนวนสินค้าต่อหน้า

    const handlePageClick = ({ selected }) => {
        setPageNumber(selected);
    };

    useEffect(() => {
        fetchProducts();
    }, [pageNumber]);

    const fetchProducts = async () => { // แก้ชื่อฟังก์ชั่นเป็น fetchProducts แทน fectProducts
        try {
            const response = await axios.get(`/api/products`);
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    const deleteProduct = (e, id) => {
        e.preventDefault();
        setDeletingId(id);

        axios.delete(`/api/products/${id}`).then(response => {
            if (response.data.status === 200) {
                Swal.fire({
                    icon: "success",
                    text: response.data.message,
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "black",
                    focusConfirm: false,
                });

                // อัปเดตรายการที่มีอยู่โดยการกรองออก
                setProducts(prev => prev.filter(product => product.id !== id));
                setDeletingId(null); // เครียทุกอย่างใน ไอดี ตระกร้า
            } else if (response.data.status === 400) {
                Swal.fire({
                    icon: "error",
                    text: response.data.message,
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "black",
                    focusConfirm: false,
                });
                setDeletingId(null);
            }
        });
    }

    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const pageCount = Math.ceil(filteredProducts.length / productsPerPage);
    const displayedProducts = filteredProducts.slice(pageNumber * productsPerPage, (pageNumber + 1) * productsPerPage);

    const [isTableFormat, setIsTableFormat] = useState(true);

    const toggleFormat = () => {
        setIsTableFormat(!isTableFormat);
    };


    const updateProductStatus = (product_id, status) => {
        // สลับสถานะ 0 เป็น 1 และ 1 เป็น 0
        const newStatus = status === 1 ? 0 : 1;

        axios.put(`/api/product-updatestatus/${product_id}/${newStatus}`)
            .then(response => {
                if (response.data.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        text: response.data.message,
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: 'black',
                        focusConfirm: false,
                    });
                    const updatedProducts = products.map(product => {
                        if (product.id === product_id) {
                            return {
                                ...product,
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

    const updateProductFeatured = (product_id, featured) => {
        // สลับสถานะ 0 เป็น 1 และ 1 เป็น 0
        const newFeatured = featured === 1 ? 0 : 1;

        axios.put(`/api/product-updatefeatured/${product_id}/${newFeatured}`)
            .then(response => {
                if (response.data.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        text: response.data.message,
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: 'black',
                        focusConfirm: false,
                    });
                    const updatedProducts = products.map(product => {
                        if (product.id === product_id) {
                            return {
                                ...product,
                                featured: newFeatured
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


    const updateProductPopular = (product_id, popular) => {
        // สลับสถานะ 0 เป็น 1 และ 1 เป็น 0
        const newPopular = popular === 1 ? 0 : 1;

        axios.put(`/api/product-updatepopular/${product_id}/${newPopular}`)
            .then(response => {
                if (response.data.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        text: response.data.message,
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: 'black',
                        focusConfirm: false,
                    });
                    const updatedProducts = products.map(product => {
                        if (product.id === product_id) {
                            return {
                                ...product,
                                popular: newPopular
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


    return (
        <>
            <Sidebar>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2 rounded-lg">

                    <div>
                        <Link to={"create"}>
                            <Button icon={<PiPlusThin size={25} />} type="submit">
                                เพิ่มสินค้า
                            </Button>
                        </Link>
                    </div>


                    <div className="flex items-center gap-x-4">

                        <button onClick={toggleFormat} className="border flex items-center justify-center rounded-full w-10 h-10">
                            {isTableFormat ? <PiSquaresFourThin size={20} /> : <PiListBulletsThin size={20} />}
                        </button>


                        <div className="relative">
                            <input type="text" placeholder="ค้นหาสินค้า"
                                className="w-full md:w-[10rem] pl-8 placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            <CiSearch className="absolute top-2 left-0" />
                        </div>
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
                    <div className="border p-4 rounded overflow-x-scroll">
                        {isTableFormat ? (
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left">
                                        <th className="py-1 border-b">รูปภาพ</th>
                                        <th className="py-1 border-b">ชื่อ</th>
                                        <th className="py-1 border-b">ราคา</th>
                                        <th className="py-1 border-b">จำนวน</th>
                                        <th className="py-1 border-b">ประเภท</th>
                                        <th className="py-1 border-b">แบรนด์</th>
                                        <th className="py-1 border-b">แนะนำ</th>
                                        <th className="py-1 border-b">ยอดนิยม</th>
                                        <th className="py-1 border-b">สถานะ</th>
                                        <th className="py-1 border-b"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedProducts.length > 0 ? (
                                        displayedProducts
                                            .filter(product => {
                                                // ใช้คำค้นหาในชื่อสินค้า
                                                return product.name.toLowerCase().includes(searchTerm.toLowerCase());
                                            })
                                            .map((product, index) => (
                                                <tr key={index}>
                                                    <td className="py-1 border-b">
                                                        {product.image ? (
                                                            <img className="w-12 h-18 rounded object-cover" src={`${baseUrl}/images/product/${product.image}`} alt="" />
                                                        ) : (
                                                            <img className="w-12 h-18 rounded object-cover" src="${baseUrl}/images/product/no_image.png" alt="No Image" />
                                                        )}
                                                    </td>
                                                    <td className="py-1 border-b">{product.name}</td>
                                                    <td className="py-1 border-b">{product.price}</td>
                                                    <td className="py-1 border-b">{product.qty}</td>
                                                    <td className="py-1 border-b">
                                                        {product.category.name}
                                                    </td>
                                                    <td className="py-1 border-b">
                                                        {product.brand.name}
                                                    </td>
                                                    <td className="py-1 border-b">
                                                        <button
                                                            type="button"
                                                            className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-300`}
                                                            onClick={() => updateProductFeatured(product.id, product.featured)}
                                                        >
                                                            {product.featured === 1 ? <PiToggleLeftThin size={25} /> : <PiToggleRightThin size={25} />}
                                                        </button>
                                                    </td>
                                                    <td className="py-1 border-b">
                                                        <button
                                                            type="button"
                                                            className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-300`}
                                                            onClick={() => updateProductPopular(product.id, product.popular)}
                                                        >
                                                            {product.popular === 1 ? <PiToggleLeftThin size={25} /> : <PiToggleRightThin size={25} />}
                                                        </button>
                                                    </td>
                                                    <td className="py-1 border-b">
                                                        <button
                                                            type="button"
                                                            className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-300`}
                                                            onClick={() => updateProductStatus(product.id, product.status)}
                                                        >
                                                            {product.status === 1 ? <PiToggleLeftThin size={25} /> : <PiToggleRightThin size={25} />}
                                                        </button>
                                                    </td>
                                                    <td className="py-1 border-b">
                                                        <div className="flex items-center gap-2">
                                                            <Link to={`${product.id}/edit`}>
                                                                <button className="border p-2 rounded-full ">
                                                                    <CiEdit size={20} />
                                                                </button>
                                                            </Link>
                                                            <button type="button" onClick={(e) => deleteProduct(e, product.id)} className="border p-2 rounded-full flex justify-end hover:text-red-700">
                                                                {deletingId === product.id ? "กำลังลบ..." : <PiTrashSimpleThin size={20} />}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className="py-1 border-b">
                                                <div className="flex justify-center items-center h-20">
                                                    ไม่พบข้อมูลสินค้า
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <div className="grid grid-container grid-cols-3 md:grid-cols-5 gap-8">
                                {displayedProducts.length > 0 ? (
                                    displayedProducts
                                        .filter(product => {
                                            // ใช้คำค้นหาในชื่อสินค้า
                                            return product.name.toLowerCase().includes(searchTerm.toLowerCase());
                                        })
                                        .map((product, index) => (
                                            <div key={index}>
                                                <Link to={`/product/detail/${product.slug}`}>
                                                    <div className="relative overflow-hidden rounded-lg group">
                                                        <div className="absolute w-full h-full bg-black/40 flex items-center justify-center -bottom-20 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                            <div className="flex flex-col items-center text-white drop-shadow  text-xl">
                                                                รายละเอียด
                                                                <PiArticleThin size={28} />
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
                                                </div>
                                                <div className="mt-1 flex justify-between items-center gap-2">
                                                    <Link to={`${product.id}/edit`}>
                                                        <button className="border p-2 rounded-full ">
                                                            <CiEdit size={20} />
                                                        </button>
                                                    </Link>
                                                    <button type="button" className="border p-2 rounded-full "
                                                        onClick={() => deleteProduct(product.id)}>
                                                        <PiTrashSimpleThin size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <div className="col-span-5">
                                        <div className="flex justify-center items-center">ไม่พบข้อมูลสินค้า</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
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

            </Sidebar>
        </>
    )
}
