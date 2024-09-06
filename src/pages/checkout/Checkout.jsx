import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layouts/Layout';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { CiImageOn } from "react-icons/ci";
import { MdInsertPhoto } from "react-icons/md";
import { MdPayment } from "react-icons/md";
import baseUrl from '../../routes/BaseUrl';
import { Rings } from 'react-loader-spinner'
import { IoMdArrowDropleft } from 'react-icons/io';
import { PiImageThin } from 'react-icons/pi';
export default function Checkout() {

    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalCartPrice, setTotalCartPrice] = useState(0);

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [payment_image, setPaymentImage] = useState(null);

    const navigate = useNavigate();

    const [isModalEvidence, setIsModalEvidence] = useState(false);

    const openModalEvidence = () => {
        setIsModalEvidence(true);
    };

    const closeModalEvidence = () => {
        setIsModalEvidence(false);
    };

    const [isModalBank, setIsModalBank] = useState({});

    const openModalBank = (bankId) => {
        setIsModalBank((prev) => ({ ...prev, [bankId]: true }));
    };

    const closeModalBank = (bankId) => {
        setIsModalBank((prev) => ({ ...prev, [bankId]: false }));
    };

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        calculateTotalPrice();
    }, [carts]);

    const calculateTotalPrice = () => {
        const total = carts.reduce((sum, cart) => sum + (cart.product.price * cart.product_qty), 0);
        setTotalCartPrice(total);
    }

    const fetchCart = async () => {
        try {
            const response = await axios.get(`/api/cart`);
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
                navigate('/')
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

    const [error, setError] = useState([]);

    const submitOrder = async (e, payment_mode) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('firstname', firstname);
        formData.append('lastname', lastname);
        formData.append('phone', phone);
        formData.append('email', email);
        formData.append('address', address);
        formData.append('payment_mode', payment_mode);
        formData.append('payment_image', payment_image);

        if (!payment_image) {
            Swal.fire({
                icon: "error",
                text: "กรุณาแนบรูปภาพหลักฐาน",
                confirmButtonText: "ตกลง",
                confirmButtonColor: "black",
                focusConfirm: false,
            });
            return;
        }

        try {
            const response = await axios.post('/api/place-order', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.status === 200) {
                Swal.fire({
                    icon: "success",
                    text: response.data.message,
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "black",
                    focusConfirm: false,
                });
                setError([]);
                navigate("/");
            } else if (response.data.status === 422) {
                setError(response.data.errors);
                console.log(response.data.errors);
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

    const handleImageUpload = () => {
        document.getElementById('imageInput').click();
    };

    const onFileChange = (event) => {
        const file = event.target.files[0];
        setPaymentImage(file);
    }

    const [banks, setBanks] = useState([]);

    useEffect(() => {
        fetchBanks();
    }, []);

    const fetchBanks = async () => {
        try {
            const response = await axios.get(`/api/banks-list`);
            setBanks(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

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
                <Layout>
                    <div className="mb-4">
                        <h1 className="text-base md:text-2xl">ชำระเงิน</h1>
                    </div>

                    <Link to={`/cart`}>
                        <Button name={'กลับ'} icon={<IoMdArrowDropleft size={20} />} className={`mb-4`} />
                    </Link>

                    <div className="flex flex-col md:flex-row justify-between gap-4">

                        <div className="w-full md:w-1/2 border p-8 rounded-lg">
                            <div className="grid grid-cols-4 gap-4">

                                <div className="col-span-2">
                                    <label>ชื่อ</label>
                                    <input
                                        className="block w-full placeholder:text-sm text-sm md:text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                                        type="text"
                                        name="firstname"
                                        placeholder="ชื่อจริง"
                                        value={firstname} onChange={(event) => setFirstname(event.target.value)}
                                    />
                                    <div className="text-red-700">{error.firstname}</div>
                                </div>

                                <div className="col-span-2">
                                    <label>นามสกุล</label>
                                    <input
                                        className="block w-full placeholder:text-sm text-sm md:text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                                        type="text"
                                        name="lastname"
                                        placeholder="นามสกุล"
                                        value={lastname} onChange={(event) => setLastname(event.target.value)}
                                    />
                                    <div className="text-red-700">{error.lastname}</div>
                                </div>

                                <div className="col-span-2">
                                    <label>เบอร์โทรศัพท์</label>
                                    <input
                                        className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                                        type="tel"
                                        name="phone"
                                        placeholder="กรุณาใส่เบอร์โทรศัพท์"
                                        value={phone} onChange={(event) => setPhone(event.target.value)}
                                    />
                                    <div className="text-red-700">{error.phone}</div>
                                </div>

                                <div className="col-span-2">
                                    <label>อีเมล</label>
                                    <input
                                        className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                                        type="email"
                                        name="email"
                                        placeholder="อีเมล"
                                        value={email} onChange={(event) => setEmail(event.target.value)}
                                    />
                                    <div className="text-red-700">{error.email}</div>
                                </div>

                                <div className="col-span-4">
                                    <label>ที่อยู่</label>
                                    <textarea
                                        className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                                        name="address"
                                        placeholder="ที่อยู่"
                                        value={address} onChange={(event) => setAddress(event.target.value)}
                                    />
                                    <div className="text-red-700">{error.address}</div>
                                </div>
                            </div>

                            <Button name={'แนบหลักฐาน'} icon={<PiImageThin size={25} />} className="mt-4 w-full" onClick={openModalEvidence} />

                            <Modal isOpen={isModalEvidence} onClose={closeModalEvidence}>
                                <div className="h-[25rem] overflow-y-scroll">
                                    <h1 className="text-2xl  text-center text-black mb-4">QR Payment</h1>
                                    <p className="text-sm text-center mb-4">ส่งหลักฐานเป็นรูปภาพ</p>
                                    <div>
                                        <div className="mx-auto cursor-pointer relative overflow-hidden group rounded-lg">
                                            <div
                                                className="absolute w-full h-full bg-black/40 flex items-center justify-center -bottom-20 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                                onClick={handleImageUpload}
                                            >
                                                <div className="flex flex-col items-center text-white text-xl">
                                                    รูปภาพ
                                                    <PiImageThin size={100} />
                                                </div>
                                            </div>
                                            {payment_image ? (
                                                <img className="w-full h-full object-cover" src={URL.createObjectURL(payment_image)} alt="อัพโหลดรูปภาพ" />
                                            ) : (
                                                <img className="w-full h-full object-cover" src={`${baseUrl}/images/product/no_image.png`} alt={`ไม่มีรูปภาพ`} />
                                            )}
                                        </div>
                                        <input hidden id="imageInput" type="file" onChange={onFileChange} />
                                        <div className="text-red-700 mt-1">{error.payment_image}</div>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <p className="text-black/40 ">ราคา</p>
                                        <span className="text-lg ">{totalCartPrice} บาท</span>
                                    </div>
                                </div>

                            </Modal>

                        </div>

                            <div className="border rounded-lg flex flex-col gap-4 p-4 w-full md:w-1/2">

                                <div>
                                    {carts.length > 0 ? (
                                        carts.map((cart, index) => (

                                            <div id="cartItem" key={index} className="border-b w-full pb-1">
                                                <div className="flex gap-4">
                                                    <div className="overflow-hidden rounded w-[10rem]">
                                                        {cart.product.image ? (
                                                            <img className="w-full h-full object-cover" src={`${baseUrl}/images/product/${cart.product.image}`} alt={`รูปภาพสินค้า ${cart.product.name}`} />
                                                        ) : (
                                                            <img className="w-full h-full object-cover" src="${baseUrl}/images/product/No_image.png" alt="ไม่มีรูปภาพ" />
                                                        )}
                                                    </div>
                                                    <div className="flex justify-between w-full">
                                                        <div className="flex flex-col justify-between">
                                                            <div>
                                                                <h1>{cart.product.name}</h1>
                                                                <h2 className="text-xs">{cart.product.category.name}</h2>
                                                            </div>
                                                            <div>
                                                                <span>{cart.product.price * cart.product_qty} บาท</span>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            {cart.product_qty}
                                                        </div>

                                                    </div>

                                                </div>

                                            </div>
                                        ))

                                    ) : (
                                        <div className="flex items-center justify-center border p-4 rounded-lg">
                                            <span className="text-3xl ">ไม่มีสินค้าในตระกร้า</span>
                                        </div>
                                    )}
                                </div>

                                <div className="border rounded-lg p-4">

                                    <div className="border-b">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                ราคารวม:
                                            </div>

                                            <div>
                                                {totalCartPrice} บาท
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="w-full">

                                    {banks.length > 0 ? (
                                        banks.map((bank, index) => (
                                            <div key={index}>

                                                <Button
                                                    name={bank?.name}
                                                    image={<img className="w-6 h-6 rounded object-cover" src={`${baseUrl}/images/bank/logo/${bank.logo}`} alt={`รูปภาพสินค้า ${bank.name}`} />}
                                                    onClick={() => openModalBank(bank.id)} className="w-full"/>

                                                <Modal isOpen={isModalBank[bank.id]} onClose={() => closeModalBank(bank.id)} title={`บัญชีธนาคาร ${bank.name}`}>
                                                    <div className="h-[25rem] overflow-y-scroll no-scrollbar flex flex-col gap-4">
                                                        <h1 className="text-xl text-center">ธนาคาร {bank.name}</h1>
                                                        <p className="text-sm text-center">ส่งหลักฐานเป็นรูปภาพ</p>
                                                        <div>
                                                            <div className="mx-auto cursor-pointer relative overflow-hidden group rounded-lg">
                                                                <img className="w-full h-full object-cover" src={`${baseUrl}/images/bank/${bank.image}`} alt={`รูปภาพสินค้า ${bank.name}`} />
                                                                <div className="flex flex-col items-center justify-center">
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <p className="text-black/40 ">ราคารวม</p>
                                                            <span className="text-sm md:text-lg ">{totalCartPrice} บาท</span>
                                                        </div>
                                                        <div className="block">รายละเอียดบัญชีธนาคาร:
                                                            <p className="text-sm">
                                                                {bank.description}
                                                            </p>
                                                        </div>
                                                        <Button name={'ชำระเงิน'} icon={<MdPayment size={20} />} className="w-full" onClick={(e) => submitOrder(e, bank.name)}/>
                                                    </div>

                                                </Modal>

                                            </div>
                                        ))
                                    ) : (
                                        <div className="mt-1 flex items-center justify-center col-span-2 md:col-span-6 border p-4 rounded-lg">
                                            <span className="text-3xl ">ไม่มีธนาคาร</span>
                                        </div>
                                    )}

                                </div>

                            </div>
                    </div>
                </Layout>
            )
            }
        </>
    )
}
