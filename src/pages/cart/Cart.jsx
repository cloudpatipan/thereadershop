import React, { useState, useEffect, useContext } from 'react';
import Layout from '../../components/Layouts/Layout';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaPlus, FaMinus } from "react-icons/fa6";
import { IoTrashBinOutline } from "react-icons/io5";
import Button from '../../components/Button';
import { IoBagCheckOutline } from "react-icons/io5";
import { CartContext } from '../../context/CartContext';
import baseUrl from '../../routes/BaseUrl';
import { IoMdArrowDropright, IoMdArrowDropleft } from "react-icons/io";
import { Rings } from 'react-loader-spinner'
export default function ViewProduct() {

    document.title = "ตระกร้าสินค้า";

    const navigate = useNavigate();
    const { setCartCount } = useContext(CartContext);
    const [loading, setLoading] = useState(true);
    const [carts, setCarts] = useState([]);
    const [totalCartPrice, setTotalCartPrice] = useState(0);
    const [deletingCartId, setDeletingCartId] = useState(null);

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        calculateTotalPrice();
    }, [carts]);

    const fetchCart = async () => {
        axios.get(`/api/cart`).then(response => {
            if (response.data.status === 200) {
                setCarts(response.data.carts);
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
        });
    }

    const calculateTotalPrice = () => {
        const total = carts.reduce((sum, cart) => sum + (cart.product.price * cart.product_qty), 0);
        setTotalCartPrice(total);
    }

    const handleDecrement = (cart_id) => {
        setCarts(carts =>
            carts.map((cart) =>
                cart_id === cart.id ? { ...cart, product_qty: cart.product_qty > 1 ? cart.product_qty - 1 : 1 } : cart
            )
        );
        updateCartQuantity(cart_id, "decrement");
    }

    const handleIncrement = (cart_id) => {
        setCarts(carts =>
            carts.map((cart) =>
                cart_id === cart.id ? { ...cart, product_qty: cart.product_qty < cart.product.qty ? cart.product_qty + 1 : cart.product_qty } : cart
            )
        );
        updateCartQuantity(cart_id, "increment");
    }

    const updateCartQuantity = (cart_id, scope) => {
        axios.put(`/api/cart-updatequantity/${cart_id}/${scope}`).then(response => {
            if (response.data.status === 400) {
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
        });
    }

    const deleteCartItem = (e, cart_id) => {
        e.preventDefault();
        setDeletingCartId(cart_id);

        axios.delete(`/api/delete-cartitem/${cart_id}`).then(response => {
            if (response.data.status === 200) {
                setCartCount((prevCount) => prevCount - 1);
                Swal.fire({
                    icon: "success",
                    text: response.data.message,
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "black",
                    focusConfirm: false,
                });

                setCarts(prevCarts => prevCarts.filter(cart => cart.id !== cart_id));
                setDeletingCartId(null);
            } else if (response.data.status === 400) {
                Swal.fire({
                    icon: "error",
                    text: response.data.message,
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "black",
                    focusConfirm: false,
                });
                setDeletingCartId(null);
            }
        });
    }

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
                <div>
                    <div className="mb-2">
                        <h1 className="text-base md:text-2xl font-semibold">ตระกร้าสินค้า</h1>
                    </div>
                    <div>

                        <Link to={`/`}>
                            <Button icon={<IoMdArrowDropleft size={20} />} className={`mb-2`}>
                                กลับ
                            </Button>
                        </Link>

                    </div>
                    {carts.length > 0 ? (
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="w-full border p-4 rounded-lg">
                                {carts.map((cart, index) => (
                                    <div key={index} className="border-b py-1">
                                        <div className="flex gap-4">
                                            <div className="w-[6rem] h-[8rem] overflow-hidden rounded-lg">
                                                {cart.product.image ? (
                                                    <img className="rounded-lg w-full h-full object-cover" src={`${baseUrl}/images/product/${cart.product.image}`} alt={`รูปภาพสินค้า ${cart.product.name}`} />
                                                ) : (
                                                    <img className="w-full h-full object-cover" src={`${baseUrl}/images/product/no_image.png`} alt={`ไม่มีรูปภาพ`} />
                                                )}
                                            </div>
                                            <div className="flex justify-between w-full">
                                                <div className="flex flex-col justify-between">
                                                    <div>
                                                        <h1 className="text-base md:text-2xl font-semibold">{cart.product.name}</h1>
                                                        <h2 className="text-black/40">{cart.product.category.name}</h2>
                                                    </div>
                                                    <div>
                                                        <span className="text-base md:text-2xl font-semibold">{cart.product.price * cart.product_qty} บาท</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col justify-between">
                                                    <button type="button" onClick={(e) => deleteCartItem(e, cart.id)} className="flex justify-end hover:text-red-700 transition-all duration-300">
                                                        {deletingCartId === cart.id ? "กำลังลบ..." : <IoTrashBinOutline size={30} />}
                                                    </button>
                                                    <div className="flex items-center justify-center gap-4 rounded-full bg-black/10 h-8 w-24 font-medium uppercase">
                                                        <button type="button" onClick={() => handleDecrement(cart.id)}><FaMinus /></button>
                                                        <div>{cart.product_qty}</div>
                                                        <button type="button" onClick={() => handleIncrement(cart.id)}><FaPlus /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="w-full md:w-1/3 mt-2 md:mt-0">
                                <div className="border rounded-lg p-4">
                                    <div className="border-b py-2">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm md:text-base font-semibold">
                                                ราคาโดยประมาณ:
                                            </div>
                                            <div className="text-base md:text-xl font-semibold">
                                                {totalCartPrice} บาท
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-b py-2">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm md:text-base font-semibold">
                                                ราคารวม:
                                            </div>
                                            <div className="text-base md:text-xl font-semibold">
                                                {totalCartPrice} บาท
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Link to={`/checkout`}>
                                    <div className="mt-2 w-full flex items-center md:justify-end">
                                        <Button icon={<IoBagCheckOutline size={20} />} className="w-full">
                                            ดำเนินการต่อ
                                        </Button>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center border p-4 rounded-lg">
                            <span className="text-3xl font-semibold">ไม่มีสินค้าในตระกร้า</span>
                        </div>
                    )}
                </div>
            )}
        </Layout>
    );
}
