import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layouts/Layout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { CiImageOn } from "react-icons/ci";
import { MdInsertPhoto } from "react-icons/md";
import { MdPayment } from "react-icons/md";
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
                navigate('/')
            }
        });
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

        axios.post('/api/place-order', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(response => {
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
        });
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
        <Layout>
            {loading ? (
                <div className="flex items-center justify-center">
                    <span className="text-3xl font-semibold">กำลังโหลดหน้าชำระเงิน...</span>
                </div>
            ) : (
                <div>
                    <div className="mb-4">
                        <h1 className="text-[1.5rem] font-semibold">ชำระเงิน</h1>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between gap-4">

                        <div className="w-full md:w-1/2">
                            <div className="grid grid-cols-4 gap-4">

                                <div className="col-span-2">
                                    <label className="text-lg block font-semibold text-black">ชื่อ</label>
                                    <input
                                        className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                                        type="text"
                                        name="firstname"
                                        placeholder="กรุณาใส่ชื่อจริง"
                                        value={firstname} onChange={(event) => setFirstname(event.target.value)}
                                    />
                                    <div className="text-red-700">{error.firstname}</div>
                                </div>

                                <div className="col-span-2">
                                    <label className="text-lg block font-semibold text-black">นามสกุล</label>
                                    <input
                                        className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                                        type="text"
                                        name="lastname"
                                        placeholder="กรุณาใส่นามสกุล"
                                        value={lastname} onChange={(event) => setLastname(event.target.value)}
                                    />
                                    <div className="text-red-700">{error.lastname}</div>
                                </div>

                                <div className="col-span-2">
                                    <label className="text-lg block font-semibold text-black">เบอร์โทรศัพท์</label>
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
                                    <label className="text-lg block font-semibold text-black">อีเมล</label>
                                    <input
                                        className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                                        type="email"
                                        name="email"
                                        placeholder="กรุณาใส่อีเมล"
                                        value={email} onChange={(event) => setEmail(event.target.value)}
                                    />
                                    <div className="text-red-700">{error.email}</div>
                                </div>

                                <div className="col-span-4">
                                    <label className="text-lg block font-semibold text-black">ที่อยู่</label>
                                    <textarea
                                        className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                                        name="address"
                                        placeholder="กรุณาใส่ที่อยู่"
                                        value={address} onChange={(event) => setAddress(event.target.value)}
                                    />
                                    <div className="text-red-700">{error.address}</div>
                                </div>
                            </div>

                            <Button icon={<MdInsertPhoto size={20} />} className="mt-1 w-full" onClick={openModalEvidence}>
                                แนบหลักฐาน
                            </Button>

                            <Modal isOpen={isModalEvidence} onClose={closeModalEvidence}>
                                <div className="p-10 bg-white">
                                    <h1 className="text-2xl font-semibold text-center text-black mb-4">QR Payment</h1>
                                    <p className="text-sm text-center mb-1">ส่งหลักฐานเป็นรูปภาพ</p>
                                    <div>
                                        <div className="mx-auto cursor-pointer relative md:w-[18rem] h-[24rem] overflow-hidden group rounded-lg">
                                            <div
                                                className="absolute w-full h-full bg-black/40 flex items-center justify-center -bottom-20 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                                onClick={handleImageUpload}
                                            >
                                                <div className="flex flex-col items-center text-white text-xl">
                                                    รูปภาพ
                                                    <CiImageOn size={100} />
                                                </div>
                                            </div>
                                            {payment_image ? (
                                                <img className="w-full h-full object-cover" src={URL.createObjectURL(payment_image)} alt="Uploaded Image" />
                                            ) : (
                                                <img className="w-full h-full object-cover" src="http://itrbru.thddns.net:6440/images/product/no_image.png" alt="No Image" />
                                            )}
                                        </div>
                                        <input hidden id="imageInput" type="file" onChange={onFileChange} />
                                        <div className="text-red-700 mt-1">{error.payment_image}</div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <p className="text-black/40 font-semibold">ราคา</p>
                                        <span className="text-lg font-semibold">{totalCartPrice} บาท</span>
                                    </div>
                                </div>

                            </Modal>

                        </div>

                        <div className="w-full md:w-1/2 mt-2 md:mt-0">

                            <div className="mb-2">
                                {carts.length > 0 ? (
                                    carts.map((cart, index) => (

                                        <div id="cartItem" key={index} className="border-b py-1 w-full">
                                            <div className="flex gap-4">
                                                <div className="w-[6rem] h-[7.5rem] overflow-hidden rounded-lg">
                                                    {cart.product.image ? (
                                                        <img className="w-full h-full object-cover" src={`http://itrbru.thddns.net:6440/images/product/${cart.product.image}`} alt={`รูปภาพสินค้า ${cart.product.name}`} />
                                                    ) : (
                                                        <img className="w-full h-full object-cover" src="http://itrbru.thddns.net:6440/images/product/No_image.png" alt="ไม่มีรูปภาพ" />
                                                    )}
                                                </div>
                                                <div className="flex justify-between w-full">
                                                    <div className="flex flex-col justify-between">
                                                        <div>
                                                            <h1 className="text-2xl font-semibold">{cart.product.name}</h1>
                                                            <h2 className="text-black/40">{cart.product.category.name}</h2>
                                                        </div>
                                                        <div>
                                                            <span className="text-2xl font-semibold">{cart.product.price * cart.product_qty} บาท</span>
                                                        </div>
                                                    </div>

                                                    <div className="text-[1.2rem] font-semibold">
                                                        {cart.product_qty}
                                                    </div>

                                                </div>

                                            </div>

                                        </div>
                                    ))

                                ) : (
                                    <div className="flex items-center justify-center border p-4 rounded-lg">
                                        <span className="text-3xl font-semibold">ไม่มีสินค้าในตระกร้า</span>
                                    </div>
                                )}
                            </div>

                            <div className="border rounded-lg p-4">

                                <div className="border-b">
                                    <div className="flex items-center justify-between">
                                        <div className="text-[1rem] font-semibold">
                                            ราคารวม:
                                        </div>

                                        <div className="text-[1.2rem] font-semibold">
                                            {totalCartPrice} บาท
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="mt-2 w-full">

                                {banks.length > 0 ? (
                                    banks.map((bank, index) => (
                                        <div key={index}>

                                            <Button
                                                image={<img className="w-8 h-8 rounded object-cover" src={`http://itrbru.thddns.net:6440/images/bank/logo/${bank.logo}`} alt={`รูปภาพสินค้า ${bank.name}`} />}
                                                onClick={() => openModalBank(bank.id)} className="w-full mt-1">
                                                <div>
                                                    {bank.name}
                                                </div>
                                            </Button>

                                            <Modal isOpen={isModalBank[bank.id]} onClose={() => closeModalBank(bank.id)} title={`บัญชีธนาคาร ${bank.name}`}>
                                                <div className="p-10 bg-white w-[30rem] h-[34rem] overflow-scroll">
                                                    <h1 className="text-xl font-semibold text-center">ธนาคาร {bank.name}</h1>
                                                    <p className="text-sm text-center mb-1">ส่งหลักฐานเป็นรูปภาพ</p>
                                                    <div>
                                                        <div className="mx-auto cursor-pointer relative md:w-[18rem] h-[24rem] overflow-hidden group rounded-lg">
                                                            <div
                                                                className="absolute w-full h-full bg-black/40 flex items-center justify-center -bottom-20 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                                                onClick={handleImageUpload}
                                                            >
                                                                <div className="flex flex-col items-center text-white text-xl">
                                                                    รูปภาพ
                                                                    <CiImageOn size={100} />
                                                                </div>
                                                            </div>
                                                            <img className="w-full h-full object-cover" src={`http://itrbru.thddns.net:6440/images/bank/${bank.image}`} alt={`รูปภาพสินค้า ${bank.name}`} />
                                                            <div className="flex flex-col items-center justify-center">
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between my-2">
                                                        <p className="text-black/40 font-semibold">ราคารวม</p>
                                                        <span className="text-lg font-semibold">{totalCartPrice} บาท</span>
                                                    </div>
                                                    <div className="block">รายละเอียดบัญชีธนาคาร:
                                                        <p>
                                                            {bank.description}
                                                        </p>
                                                    </div>
                                                    <Button icon={<MdPayment size={20} />} className="w-full mt-1" onClick={(e) => submitOrder(e, bank.name)}>
                                                        ชำระเงิน
                                                    </Button>
                                                </div>

                                            </Modal>

                                        </div>
                                    ))
                                ) : (
                                    <div className="mt-1 flex items-center justify-center col-span-2 md:col-span-6 border p-4 rounded-lg">
                                        <span className="text-3xl font-semibold">ไม่มีธนาคาร</span>
                                    </div>
                                )}



                            </div>

                        </div>

                    </div>
                </div >
            )
            }
        </Layout >
    )
}
