import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Layouts/Sidebar';
import { CiImageOn } from "react-icons/ci";
import Button from '../../components/Button';
import { FaSave } from "react-icons/fa";

export default function CreateProduct() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [qty, setQty] = useState("");
    const [category_id, setCategoryId] = useState("");
    const [brand_id, setBrandId] = useState("");
    const [image, setImage] = useState();
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [featured, setFeatured] = useState(false);
    const [popular, setPopular] = useState(false);
    const [status, setStatus] = useState(false);

    useEffect(() => {
        fetchCategories();
        fetchBrands();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/all-category');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching Categories:', error);
        }
    };

    const fetchBrands = async () => {
        try {
            const response = await axios.get('/api/all-brand');
            setBrands(response.data);
        } catch (error) {
            console.error('Error fetching Brands:', error);
        }
    };

    const [error, setError] = useState([]);

    const addProduct = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('qty', qty);
        formData.append('category_id', category_id);
        formData.append('brand_id', brand_id);
        formData.append('image', image);
        formData.append('featured', featured ? 1 : 0);
        formData.append('popular', popular ? 1 : 0);
        formData.append('status', status ? 1 : 0);

        axios.post('api/products', formData, {
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
                navigate("/admin/product");
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
        setImage(file);
    }

    return (
        <Sidebar>
            <h1 className="text-2xl font-semibold text-center mb-8">เพิ่มสินค้า</h1>
            <form onSubmit={addProduct}>
                <div className="p-4 flex flex-col md:flex-row justify-center gap-4 border rounded-lg">
                    <div>
                        <div className="mx-auto cursor-pointer relative md:w-[24rem] md:h-[34rem] overflow-hidden group rounded-lg">
                            <div
                                className="absolute w-full h-full bg-black/40 flex items-center justify-center -bottom-20 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                onClick={handleImageUpload}
                            >
                                <div className="flex flex-col items-center text-white text-xl">
                                    รูปภาพ
                                    <CiImageOn size={100} />
                                </div>
                            </div>
                            {image ? (
                                <img className="w-full h-full object-cover" src={URL.createObjectURL(image)} alt="Uploaded Image" />
                            ) : (
                                <img className="w-full h-full object-cover" src="https://ef9c-2405-9800-b540-dc40-a46a-cab9-89b-365c.ngrok-free.app/images/product/no_image.png" alt="No Image" />
                            )}
                        </div>
                        <input hidden id="imageInput" type="file" onChange={onFileChange} />
                        <div className="text-red-700 text-sm">{error.image}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">
                        <div className="col-span-1 md:col-span-2">
                            <label className="text-lg block text-black font-semibold">ชื่อ</label>
                            <input
                                className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                                type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="กรุณาใส่ชื่อ"
                            />
                            <div className="text-red-700 text-sm">{error.name}</div>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="text-lg block text-black font-semibold">รายละเอียด</label>
                            <textarea
                                className="block w-full placeholder:text-sm text-base border rounded h-20 px-2 appearance-none focus:outline-none bg-transparent text-black py-1"
                                value={description} onChange={(event) => setDescription(event.target.value)} placeholder="กรุณาใส่รายละเอียด"
                            />
                            <div className="text-red-700 text-sm">{error.description}</div>
                        </div>

                        <div>
                            <label className="text-lg block text-black font-semibold">ราคา</label>
                            <input
                                type="number"
                                className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                                value={price} onChange={(event) => setPrice(event.target.value)} placeholder="กรุณาใส่ราคา"
                            />
                            <div className="text-red-700 text-sm">{error.price}</div>
                        </div>

                        <div>
                            <label className="text-lg block text-black font-semibold">จำนวน</label>
                            <input
                                type="number"
                                className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                                value={qty} onChange={(event) => setQty(event.target.value)} placeholder="กรุณาใส่จำนวน"
                            />
                            <div className="text-red-700 text-sm">{error.qty}</div>
                        </div>

                        <div>
                            <label className="text-lg block text-black font-semibold">ประเภท</label>
                            <select
                                className="block w-full border-0 rounded-md text-black py-1.5 px-4 ring-1 ring-black/40 ring-inset-gray-300 placeholder:text-black/40 focus:ring-inset focus:ring-black text-sm md:text-sm leading-6"
                                value={category_id} onChange={(event) => setCategoryId(event.target.value)}
                            >
                                <option disabled value="">-- เลือกประเภท --</option>
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled value="">ไม่มีประเภทสินค้า</option>
                                )}
                            </select>
                            <div className="text-red-700 text-sm">{error.category_id}</div>
                        </div>

                        <div>
                            <label className="text-lg block text-black font-semibold">แบรนด์</label>
                            <select
                                className="block w-full border-0 rounded-md text-black py-1.5 px-4 ring-1 ring-black/40 ring-inset-gray-300 placeholder:text-black/40 focus:ring-inset focus:ring-black text-sm md:text-sm leading-6"
                                value={brand_id} onChange={(event) => setBrandId(event.target.value)}
                            >
                                <option disabled value="">-- เลือกแบรนด์ --</option>
                                {brands.length > 0 ? (
                                    brands.map((brand) => (
                                        <option key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled value="">ไม่มีแบรนด์สินค้า</option>
                                )}
                            </select>
                            <div className="text-red-700 text-sm">{error.brand_id}</div>
                        </div>

                        <div className="col-span-2 gap-4">

                            <div className="flex items-center gap-2">
                                <input className="accent-black"
                                    type="checkbox"
                                    checked={popular}
                                    onChange={(event) => setPopular(event.target.checked)}
                                />
                                <label className="text-lg text-black font-semibold">ยอดนิยม</label>
                                <div className="text-red-700 text-sm">{error.popular}</div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input className="accent-black"
                                    type="checkbox"
                                    checked={featured}
                                    onChange={(event) => setFeatured(event.target.checked)}
                                />
                                <label className=" text-lg block text-black font-semibold">แนะนำ</label>
                                <div className="text-red-700 text-sm">{error.featured}</div>
                            </div>

                            <div className="flex items-center gap-2">                               
                                <input className="accent-black"
                                    type="checkbox"
                                    checked={status}
                                    onChange={(event) => setStatus(event.target.checked)}
                                />
                                 <label className="text-lg block text-black font-semibold">สถานะ</label>
                                <div className="text-red-700 text-sm">{error.status}</div>
                            </div>

                        </div>

                    </div>
                </div>

                <Button icon={<FaSave size={20} />} type="submit" className="mt-1">
                    <div>
                        บันทึก
                    </div>
                </Button>

            </form>
        </Sidebar>
    );
}
