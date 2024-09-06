import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Layouts/Sidebar';

import { CiImageOn } from "react-icons/ci";
import { FaRegSave } from "react-icons/fa";
import Button from '../../components/Button';
import baseUrl from '../../routes/BaseUrl';
import { PiArrowLineLeftThin } from 'react-icons/pi';
export default function EditAdsBanner() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [products, setProducts] = useState('');
    const [product_id, setProductId] = useState('');
    const [image, setImage] = useState('');
    const [error, setError] = useState(null);
    const [newImage, setNewImage] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdsBanners();
    }, [id]);

    const fetchAdsBanners = async () => {
        try {
            const response = await axios.get(`/api/adsbanners/${id}`);
            if (response.data.status === 200) {
                setProductId(response.data.adsbanner.product_id);
                setImage(response.data.adsbanner.image);
                console.log(response.data.adsbanner)
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
    };

    const updateAdsBanner = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('_method', 'PATCH');
        formData.append('product_id', product_id);

        if (newImage) {
            formData.append('image', newImage);
        }

        try {
            const response = await axios.post(`/api/adsbanners/${id}`, formData, {
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
                navigate("/admin/adsbanner");
            } else if (response.data.status === 400) {
                Swal.fire({
                    icon: "error",
                    text: response.data.message,
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "black",
                    focusConfirm: false,
                });
            } else if (response.data.status === 422) {
                setError(response.data.errors);
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

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`/api/products`);
            if (response.data.status === 200) {
                setProducts(response.data.products);
                setLoading(false);
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

    const handleImageUploadImage = () => {
        document.getElementById('imageInput').click();
    };


    const onFileChangeImage = (event) => {
        const file = event.target.files[0];
        setNewImage(file);
    }


    return (
        <Sidebar>
            <h1 className="text-2xl mb-4">แบนเนอร์ (แก้ไข)</h1>
            <form onSubmit={updateAdsBanner}>

                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">

                        <div className="col-span-2">
                            <div className="mx-auto cursor-pointer relative w-full h-[14rem] overflow-hidden group rounded-lg">
                                <div
                                    className="absolute w-full h-full bg-black/40 flex items-center justify-center -bottom-20 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                    onClick={handleImageUploadImage}
                                >
                                    <div className="flex flex-col items-center text-white text-xl">
                                        รูปภาพ
                                        <CiImageOn size={100} />
                                    </div>
                                </div>
                                {newImage ? (
                                    <img className="w-full h-full object-cover" src={URL.createObjectURL(newImage)} alt={`อัพโหลดรูปภาพ`} />
                                ) : image ? (
                                    <img className="w-full h-full object-cover" src={`${baseUrl}/images/adsbanner/${image}`} alt={`รูปภาพของ ${id}`} />
                                ) : (
                                    <img className="w-full h-full object-cover" src={`${baseUrl}/images/product/No_image.png`} alt={`ไม่มีรูปภาพ`} />
                                )}
                            </div>
                            <input hidden id="imageInput" type="file" onChange={onFileChangeImage} />
                            {error && error.image && (
                                <div className={`my-2 text-sm text-[#d70000]`}>
                                    {error.image}
                                </div>
                            )}
                        </div>

                        <div className="col-span-2">
                            <label>สินค้าที่เกี่ยวข้อง</label>
                            <select
                                className="block w-full border-0 rounded-md text-black py-1.5 px-4 ring-1 ring-black/40 ring-inset-gray-300 placeholder:text-black/40 focus:ring-inset focus:ring-black text-sm md:text-sm leading-6"
                                value={product_id} onChange={(event) => setProductId(event.target.value)}
                            >
                                <option disabled>-- เลือกสินค้า --</option>
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>ไม่มีประเภทสินค้า</option>
                                )}
                            </select>
                            {error && error.product_id && (
                                <div className={`my-2 text-sm text-[#d70000]`}>
                                    {error.product_id}
                                </div>
                            )}
                        </div>

                    </div>

                    <div className="flex justify-end">
                        <Button type={'submit'} name={'บันทึก'} icon={<PiArrowLineLeftThin size={20} />} />
                    </div>
                </div>

            </form>

        </Sidebar>
    );
}
