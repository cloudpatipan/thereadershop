import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Layouts/Sidebar';
import { CiImageOn } from "react-icons/ci";
import Button from '../../components/Button';

export default function CreateAdsBanner() {
    const navigate = useNavigate();

    const [products, setProducts] = useState("");
    const [product_id, setProductId] = useState("");
    const [image, setImage] = useState();
    const [validationError, setValidationError] = useState(null);

    const addAdsBanner = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('product_id', product_id);
        formData.append('image', image);
        try {
            const response = await axios.post('/api/adsbanners', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Swal.fire({
                icon: "success",
                text: response.data.message,
                confirmButtonText: "ตกลง",
                confirmButtonColor: "black",
                focusConfirm: false,
            });
            navigate("/admin/adsbanner");
        } catch (error) {
            if (error.response && error.response.status === 422) {
                console.error('Validation Error:', error.response.data.errors);
                setValidationError(error.response.data.errors);
            } else {
                Swal.fire({
                    text: error.response ? error.response.data.message : "An error occurred",
                    icon: "error",
                });
            }
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => { // แก้ชื่อฟังก์ชั่นเป็น fetchProducts แทน fectProducts
        try {
            const response = await axios.get(`/api/products`);
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    const handleImageUploadImage = () => {
        document.getElementById('imageInput').click();
    };

    const onFileChangeImage = (event) => {
        const file = event.target.files[0];
        setImage(file);
    }

    return (
        <Sidebar>
            <h1 className="text-2xl font-semibold text-center mb-8">เพิ่มแบนเนอร์</h1>
            <form onSubmit={addAdsBanner}>
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
                            {image ? (
                                <img className="w-full h-full object-cover" src={URL.createObjectURL(image)} alt="Uploaded Image" />
                            ) : (
                                <img className="w-full h-full object-cover" src="https://b3d5-2405-9800-b540-dc40-e4c6-fa23-b554-9155.ngrok-free.app/images/product/no_image.png" alt="No Image" />
                            )}
                        </div>
                        <input hidden id="imageInput" type="file" onChange={onFileChangeImage} />
                        {validationError && validationError.image && (
                            <div className="text-red-500 text-sm mt-2">{validationError.image[0]}</div>
                        )}
                    </div>

                    <div className="col-span-2">
                            <label className="text-lg block text-black font-semibold">สินค้าที่เกี่ยวข้อง</label>
                            <select
                                className="block w-full border-0 rounded-md text-black py-1.5 px-4 ring-1 ring-black/40 ring-inset-gray-300 placeholder:text-black/40 focus:ring-inset focus:ring-black text-sm md:text-sm leading-6"
                                value={product_id} onChange={(event) => setProductId(event.target.value)}
                            >
                                <option disabled value="">-- เลือกสินค้า --</option>
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled value="">ไม่มีประเภทสินค้า</option>
                                )}
                            </select>
                            {validationError && validationError.category_id && (
                                <div className="text-red-500 text-sm mt-2">{validationError.category_id[0]}</div>
                            )}
                        </div>

                    </div>

                <Button type="submit" className="mt-8 w-full relative flex justify-center items-center gap-2 border-2 rounded-full border-black bg-transparent py-2 px-5 font-medium uppercase text-black hover:text-white hover:bg-black transition-all duration-300">
                    <div>บันทึก</div>
                </Button>
            </form>
        </Sidebar>
    );
}
