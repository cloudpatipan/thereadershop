import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { MdOutlineFullscreen } from "react-icons/md";
import axios from 'axios';
import Swal from 'sweetalert2';
import Layout from '../../components/Layouts/Layout';
import ModalImage from '../../components/ModalImage';
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { MdOutlineErrorOutline } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import Button from '../../components/Button';
import { CartContext } from '../../context/CartContext';
import { CgDetailsMore } from "react-icons/cg";
export default function ProductDetail() {

    const navigate = useNavigate();
    const { setCartCount } = useContext(CartContext);
    const [product, setProduct] = useState([]);
    const [product_random, setProductRandom] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1); // จำนวนสินค้าค่าเริ่ม ต้นเป็น 1
    const { slug } = useParams();

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prevCount => prevCount - 1);
        }
    }
    const handleIncrement = () => {
        if (quantity < product.qty) {
            setQuantity(prevCount => prevCount + 1);
        } else {
            Swal.fire({
                text: "จำนวนสินค้าสูงสุดแล้ว",
                icon: "warning",
                confirmButtonText: "ตกลง",
                confirmButtonColor: "black",
                focusConfirm: false,
            });
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        axios.get(`/api/product-detail/${slug}`).then(response => {
            if (response.data.status === 200) {
                setProduct(response.data.products);
                document.title = response.data.products.name
                setProductRandom(response.data.product_random);
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
        })
    }

    const addToCart = async () => {
        const data = {
            product_id: product.id,
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

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Layout>
                <section>
                    {loading ? (
                        <div className="flex justify-center items-start min-h-screen">
                            <h1 className="text-[2rem] font-semibold">กำลังโหลด...</h1>
                        </div>
                    ) : (
                        <div>
                            <div className="flex flex-col md:flex-row gap-8 justify-between p-4 border rounded-lg">

                                <div className="w-full md:w-[30%] relative overflow-hidden rounded-lg group">
                                    <div className="absolute w-full h-full bg-black/40 flex items-center justify-center -bottom-20 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <div className="flex flex-col items-center text-white text-xl">
                                            <MdOutlineFullscreen className="cursour-pointer size-28 hover:size-32 transition-all duration-50" onClick={openModal} />
                                        </div>
                                    </div>
                                    {product.image ? (
                                        <img className="w-full h-full object-cover" src={`https://c45c-2405-9800-b540-dc40-d538-9787-5ce1-fc75.ngrok-free.app/images/product/${product.image}`} alt="" />
                                    ) : (
                                        <img className="w-full h-full object-cover" src="https://c45c-2405-9800-b540-dc40-d538-9787-5ce1-fc75.ngrok-free.app/images/product/No_image.png" alt="No Image" />
                                    )}
                                    <div>
                                        <ModalImage isOpen={isModalOpen} onClose={closeModal}>
                                            {product.image ? (
                                                <img className="rounded-lg w-full h-full object-cover" src={`https://c45c-2405-9800-b540-dc40-d538-9787-5ce1-fc75.ngrok-free.app/images/product/${product.image}`} alt="" />
                                            ) : (
                                                <img className=" rounded-lg w-full h-full object-cover" src="https://c45c-2405-9800-b540-dc40-d538-9787-5ce1-fc75.ngrok-free.app/images/product/No_image.png" alt="No Image" />
                                            )}
                                        </ModalImage>
                                    </div>

                                </div>

                                <div className="w-full md:w-[80%]">
                                    <h2 className="text-sm md:text-base block text-black/30 md:text-base font-semibold">{product.category.name}</h2>
                                    <h1 className="text-base md:text-2xl font-semibold mb-4">{product.name}</h1>
                                    <span className="text-sm md:text-xl font-semibold">รายละเอียด</span>
                                    <p className="text-base md:text-xl">{product.description}</p>
                                    <p className="mt-4 text-base md:text-xl font-semibold">
                                        <span className="font-semibold text-sm md:text-base block text-black/30">
                                            ราคารวม
                                        </span>
                                        {product.price} บาท
                                    </p>

                                    <div className="my-4 flex items-center justify-center gap-4 rounded-full bg-black/10 h-8 w-24 font-medium uppercase">
                                        <button onClick={handleDecrement}><FaMinus /></button>
                                        <div>
                                            {quantity}
                                        </div>
                                        <button onClick={handleIncrement}><FaPlus /></button>
                                    </div>

                                    {product.qty > 0 ? (
                                        <Button onClick={addToCart} type="submit" icon={<HiOutlineShoppingBag size={26} />}>
                                            เพิ่มลงตระกร้า
                                        </Button>
                                    ) : (
                                        <Button type="disabled" icon={<MdOutlineErrorOutline size={25} />}>
                                            สินค้าหมด
                                        </Button>
                                    )}

                                </div>
                            </div>

                            <div>
                                <h1 className="text-base md:text-2xl font-semibold mt-4">สินค้าที่คุณอาจจะสนใจ</h1>

                                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-4 border p-4 rounded-lg">
                                    {product_random.length > 0 ? (
                                        product_random.map((item, index) => (
                                            <div key={index}>
                                                <a href={`/product/detail/${item.slug}`}>
                                                    <div className="relative overflow-hidden rounded-lg group">
                                                        <div className="absolute w-full h-full bg-black/40 flex items-center justify-center -bottom-20 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                            <div className="flex flex-col items-center text-white text-xl">
                                                                รายละเอียด
                                                                <CgDetailsMore size={28} />
                                                            </div>
                                                        </div>
                                                        {item.image ? (
                                                            <img className="rounded-lg w-full h-full object-cover" src={` https://c45c-2405-9800-b540-dc40-d538-9787-5ce1-fc75.ngrok-free.app/images/product/${item.image}`} alt={item.name} />
                                                        ) : (
                                                            <img className="rounded-lg w-full h-full object-cover" src=" https://c45c-2405-9800-b540-dc40-d538-9787-5ce1-fc75.ngrok-free.app/images/product/No_image.png" alt="No Image" />
                                                        )}
                                                    </div>
                                                </a>
                                                <div className="p-2 text-center">
                                                    <p className="text-sm md:text-base font-semibold text-clip overflow-hidden">{item.name}</p>
                                                    <p className="text-sm text-clip overflow-hidden text-black/40 font-semibold">{item.category.name}</p>
                                                    <span className="font-bold">฿ {item.price}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex items-center justify-center rounded-lg col-span-3 md:col-span-6">
                                            <span className="text-3xl font-semibold">ไม่มีสินค้าที่สุ่ม</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </Layout>
        </>
    )
}
