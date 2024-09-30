import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Layouts/Sidebar';
import { CiImageOn } from "react-icons/ci";
import Button from '../../components/Button';
import baseUrl from '../../routes/BaseUrl';
import { PiArrowLineLeftThin, PiTrashSimpleThin } from 'react-icons/pi';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // สไตล์สำหรับ Quill

export default function EditProduct() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [qty, setQty] = useState('');
    const [category_id, setCategoryId] = useState('');
    const [brand_id, setBrandId] = useState('');
    const [image, setImage] = useState('');
    const [featured, setFeatured] = useState(false);
    const [popular, setPopular] = useState(false);
    const [status, setStatus] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [additionalImages, setAdditionalImages] = useState([]);

    useEffect(() => {
        fetchProduct();
        fetchCategories();
        fetchBrands();
    }, []);

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`/api/products/${id}`);
            const productData = response.data;
            setName(productData.name);
            setDescription(productData.description);
            setPrice(productData.price);
            setQty(productData.qty);
            setCategoryId(productData.category_id);
            setBrandId(productData.brand_id);
            setImage(productData.image);
            setFeatured(productData.featured);
            setPopular(productData.popular);
            setStatus(productData.status);
            setAdditionalImages(productData.additional_images || []);
        } catch (error) {
            console.error('Error fetching Product:', error);
        }
    };

    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/all-category');
            if (response.data.status === 200) {
                setCategories(response.data.categories);
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

    const [brands, setBrands] = useState([]);

    const fetchBrands = async () => {
        try {
            const response = await axios.get('/api/all-brand');
            if (response.data.status === 200) {
                setBrands(response.data.brands);
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

    const [error, setError] = useState([]);

    const updateProduct = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('_method', 'PATCH');
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('qty', qty);
        formData.append('category_id', category_id);
        formData.append('brand_id', brand_id);
        formData.append('featured', featured ? 1 : 0);
        formData.append('popular', popular ? 1 : 0);
        formData.append('status', status ? 1 : 0);

        if (newImage) {
            formData.append('image', newImage);
        }

        additionalImages.forEach((img, index) => {
            if (img instanceof File) {
                formData.append(`additional_images[${index}]`, img);
            }
        });

        try {
            const response = await axios.post(`/api/products/${id}`, formData, {
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
                navigate("/admin/product");
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

    const onFileChange = (event) => {
        setNewImage(event.target.files[0]);
    }

    const handleImageUpload = () => {
        document.getElementById('imageInput').click();
    };

    const [dragOver, setDragOver] = useState(false);

    const onAdditionalFileChange = (event) => {
        const files = Array.from(event.target.files);
        setAdditionalImages([...additionalImages, ...files]);
    };

    const handleRemoveAdditionalImage = (index) => {
        const updatedImages = [...additionalImages];
        updatedImages.splice(index, 1);
        setAdditionalImages(updatedImages);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const files = Array.from(event.dataTransfer.files);
        setAdditionalImages([...additionalImages, ...files]);
        setDragOver(false);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragOver(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragOver(false);
    };

    const deleteAdditionalImage = (e, additionalImageId) => {
        e.preventDefault();

        axios.delete(`/api/additional-images/${additionalImageId}`).then(response => {
            if (response.data.status === 200) {
                const updatedImages = additionalImages.filter(img => img.id !== additionalImageId);
                setAdditionalImages(updatedImages);
                setError([]);
            } else if (response.data.status === 422) {
                setError(response.data.errors);
                console.log(response.data.errors);
            }
        })
    };


    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['link', 'image'],
            ['clean'],
        ],
    };


    const handleDescriptionChange = (description) => {
        setDescription(description)
    }


    return (
        <Sidebar>
            <h1 className="text-2xl mb-4">สินค้า (แก้ไข)</h1>

            <form onSubmit={updateProduct}>

                <div className="flex flex-col gap-4">

                    <div className="p-4 flex flex-col md:flex-row justify-center gap-4 border rounded-lg">

                        <div className="w-full md:w-[40%]">
                            <div className="cursor-pointer relative overflow-hidden group rounded-lg">
                                <div
                                    className="absolute w-full h-full bg-black/40 flex items-center justify-center -bottom-20 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                    onClick={handleImageUpload}
                                >
                                    <div className="flex flex-col items-center text-white text-xl">
                                        รูปภาพ
                                        <CiImageOn size={100} />
                                    </div>
                                </div>
                                {newImage ? (
                                    <img className="w-full h-full object-cover" src={URL.createObjectURL(newImage)} alt="New Uploaded Image" />
                                ) : image ? (
                                    <img className="w-full h-full object-cover" src={`${baseUrl}/images/product/${image}`} alt={`รูปภาพของ ${name}`} />
                                ) : (
                                    <img className="w-full h-full object-cover" src={`${baseUrl}/images/product/No_image.png`} alt={`ไม่มีรูปภาพ`} />
                                )}
                            </div>
                            <input hidden id="imageInput" type="file" onChange={onFileChange} />
                            {error && error.image && (
                                <div className={`my-2 text-sm text-[#d70000]`}>
                                    {error.image}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:w-[60%]">

                            <div className="col-span-2">
                                <label>ชื่อ</label>
                                <input
                                    className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                                    type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="กรุณาใส่ชื่อ"
                                />
                                {error && error.name && (
                                    <div className={`my-2 text-sm text-[#d70000]`}>
                                        {error.name}
                                    </div>
                                )}
                            </div>

                            <div className="col-span-2">
                                <label>รายละเอียด</label>
                                <ReactQuill
                                    value={description} // ใช้ค่าใน state
                                    onChange={handleDescriptionChange} // เรียกใช้ฟังก์ชันเมื่อมีการเปลี่ยนแปลง
                                    modules={modules}
                                    placeholder={`รายละเอียด`}
                                />
                                {error && error.description && (
                                    <div className={`my-2 text-sm text-[#d70000]`}>
                                        {error.description}
                                    </div>
                                )}
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label>ราคา</label>
                                <input
                                    type="number"
                                    className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                                    value={price} onChange={(event) => setPrice(event.target.value)} placeholder="กรุณาใส่ราคา"
                                />
                                {error && error.price && (
                                    <div className={`my-2 text-sm text-[#d70000]`}>
                                        {error.price}
                                    </div>
                                )}
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label>จำนวน</label>
                                <input
                                    type="number"
                                    className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                                    value={qty} onChange={(event) => setQty(event.target.value)} placeholder="กรุณาใส่จำนวน"
                                />
                                <div className="text-red-700 text-sm">{error.qty}</div>
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label>ประเภท</label>
                                <select
                                    className="text-xs md:text-sm w-full border rounded-md text-black p-1"
                                    value={category_id} onChange={(event) => setCategoryId(event.target.value)}
                                >
                                    <option>-- เลือกประเภท --</option>
                                    {categories.length > 0 ? (
                                        categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option>ไม่มีประเภทสินค้า</option>
                                    )}
                                </select>
                                {error && error.category_id && (
                                    <div className={`my-2 text-sm text-[#d70000]`}>
                                        {error.category_id}
                                    </div>
                                )}
                            </div>

                            <div className="col-span-2 md:col-span-1">
                                <label>แบรนด์</label>
                                <select
                                    className="text-xs md:text-sm w-full border rounded-md text-black p-1"
                                    value={brand_id} onChange={(event) => setBrandId(event.target.value)}
                                >
                                    <option>-- เลือกแบรนด์ --</option>
                                    {brands.length > 0 ? (
                                        brands.map((brand) => (
                                            <option key={brand.id} value={brand.id}>
                                                {brand.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>ไม่มีแบรนด์สินค้า</option>
                                    )}
                                </select>
                                {error && error.brand_id && (
                                    <div className={`my-2 text-sm text-[#d70000]`}>
                                        {error.brand_id}
                                    </div>
                                )}
                            </div>

                            <div>

                                <div className="flex items-center gap-2">
                                    <input className="accent-black"
                                        type="checkbox"
                                        checked={popular}
                                        onChange={(event) => setPopular(event.target.checked)}
                                    />
                                    <label>ยอดนิยม</label>
                                    {error && error.popular && (
                                        <div className={`my-2 text-sm text-[#d70000]`}>
                                            {error.popular}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <input className="accent-black"
                                        type="checkbox"
                                        checked={featured}
                                        onChange={(event) => setFeatured(event.target.checked)}
                                    />
                                    <label>แนะนำ</label>
                                    {error && error.featured && (
                                        <div className={`my-2 text-sm text-[#d70000]`}>
                                            {error.featured}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <input className="accent-black"
                                        type="checkbox"
                                        checked={status}
                                        onChange={(event) => setStatus(event.target.checked)}
                                    />
                                    <label>สถานะ</label>
                                    {error && error.status && (
                                        <div className={`my-2 text-sm text-[#d70000]`}>
                                            {error.status}
                                        </div>
                                    )}
                                </div>

                            </div>

                            <div className="col-span-2"
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}>
                                <label>รูปภาพเพิ่มเติม</label>
                                <input type="file" id="additionalImageInput" multiple onChange={onAdditionalFileChange} style={{ display: 'none' }} />
                                <div
                                    className={`border rounded-lg text-center hover:underline p-4 ${dragOver ? 'border-dashed border-black' : ''}`}
                                    onClick={() => document.getElementById('additionalImageInput').click()}
                                >
                                    อัพโหลดรูปภาพเพิ่มเติมตรงนี้
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2 col-span-2">
                                {additionalImages && additionalImages.map((additional_image, index) => (
                                    <div key={index} className="relative group">
                                        {additional_image.id ? (
                                            <img
                                                className="w-full h-full object-cover rounded"
                                                src={`${baseUrl}/images/product/${additional_image.additional_image}`}
                                                alt={`รูปภาพเพิ่มเติม ${index}`}
                                            />
                                        ) : (
                                            <img
                                                className="w-full h-full object-cover rounded"
                                                src={URL.createObjectURL(additional_image)}
                                                alt={`รูปภาพเพิ่มเติม ${index}`}
                                            />
                                        )}

                                        <div
                                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                            onClick={(e) => additional_image.id ? deleteAdditionalImage(e, additional_image.id) : handleRemoveAdditionalImage(index)}
                                        >
                                            <span className="text-white text-lg"><PiTrashSimpleThin size={50} /></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="text-red-700 text-sm">
                                {error.additional_images && error.additional_images.map((error, index) => (
                                    <div key={index}>{error}</div>
                                ))}
                            </div>

                        </div>

                    </div>

                    <div className="flex justify-end">
                        <Button type={'submit'} name={'บันทึก'} icon={<PiArrowLineLeftThin size={20} />} />
                    </div>
                </div>

            </form>

        </Sidebar >
    );
}