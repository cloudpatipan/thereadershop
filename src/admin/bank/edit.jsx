import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Layouts/Sidebar';

import { CiImageOn } from "react-icons/ci";
import Button from '../../components/Button';
import baseUrl from '../../routes/BaseUrl';
import { PiArrowLeftThin, PiArrowLineLeftThin } from 'react-icons/pi';
export default function EditBank() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [logo, setLogo] = useState('');
    const [status, setStatus] = useState(false);
    const [error, setError] = useState(null);
    const [newImage, setNewImage] = useState(null);
    const [newLogo, setNewLogo] = useState(null);


    useEffect(() => {
        fetchBank();
    }, [id]);

    const fetchBank = async () => {
        try {
            const response = await axios.get(`/api/banks/${id}`);
            if (response.data.status === 200) {
                setName(response.data.bank.name);
                setDescription(response.data.bank.description);
                setImage(response.data.bank.image);
                setLogo(response.data.bank.logo);
                setStatus(response.data.bank.status);
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

    const updateBank = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('_method', 'PATCH');
        formData.append('name', name);

        if (newImage) {
            formData.append('image', newImage);
        }

        if (newLogo) {
            formData.append('logo', newLogo);
        }

        formData.append('description', description);
        formData.append('status', status ? 1 : 0);

        try {
            const response = await axios.post(`/api/banks/${id}`, formData, {
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
                navigate("/admin/bank");
            } else if (response.data.status === 400) {
                Swal.fire({
                    icon: "error",
                    text: response.data.message,
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "black",
                    focusConfirm: false,
                });
                navigate("/admin/bank");
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

    const handleImageUploadImage = () => {
        document.getElementById('imageInput').click();
    };

    const handleImageUploadLogo = () => {
        document.getElementById('logoInput').click();
    };

    const onFileChangeImage = (event) => {
        const file = event.target.files[0];
        setNewImage(file);
    }

    const onFileChangeLogo = (event) => {
        const file = event.target.files[0];
        setNewLogo(file);
    }

    return (
        <Sidebar>

            <h1 className="text-2xl mb-4">ธนาคาร (แก้ไข)</h1>
            <form onSubmit={updateBank}>


                <div className="flex flex-col gap-4">
                    <div className="p-4 overflow-x-scroll no-scrollbar flex flex-col md:flex-row justify-center gap-4 border rounded-lg">

                        <div className="flex items-center gap-4">
                            <div>
                                <label>โลโก้</label>
                                <div className="md:h-[15rem] md:w-[15rem] cursor-pointer relative overflow-hidden group rounded-lg">
                                    <div
                                        className="absolute w-full h-full bg-black/40 flex items-center justify-center -bottom-20 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                        onClick={handleImageUploadLogo}
                                    >
                                        <div className="flex flex-col items-center text-white text-xl">
                                            รูปภาพ
                                            <CiImageOn size={100} />
                                        </div>
                                    </div>
                                    {newLogo ? (
                                        <img className="w-full h-full object-cover" src={URL.createObjectURL(newLogo)} alt={`อัพโหลดรูปภาพ`} />
                                    ) : logo ? (
                                        <img className="w-full h-full object-cover" src={`${baseUrl}/images/bank/logo/${logo}`} alt={`รูปภาพของ ${name}`} />
                                    ) : (
                                        <img className="w-full h-full object-cover" src={`${baseUrl}/images/product/No_image.png`} alt={`ไม่มีรูปภาพ`} />
                                    )}
                                </div>
                                <input hidden id="logoInput" type="file" onChange={onFileChangeLogo} />
                                {error && error.logo && (
                                    <div className="text-red-500 mt-4">{error.logo[0]}</div>
                                )}
                            </div>

                            <div>
                                <label>คิวอาร์โค้ด</label>
                                <div className=" md:h-[15rem] md:w-[10rem] cursor-pointer relative overflow-hidden group rounded-lg">
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
                                        <img className="w-full h-full object-cover" src={URL.createObjectURL(newImage)} alt="อัพโหลดรูปภาพ" />
                                    ) : image ? (
                                        <img className="w-full h-full object-cover" src={`${baseUrl}/images/bank/${image}`} alt={`รูปภาพของธนาค ${name}`} />
                                    ) : (
                                        <img className="w-full h-full object-cover" src={`${baseUrl}/images/product/No_image.png`} alt={`ไม่มีรูปภาพ`} />
                                    )}
                                </div>
                                <input hidden id="imageInput" type="file" onChange={onFileChangeImage} />
                                {error && error.image && (
                                    <div className="text-red-500 mt-4">{error.image[0]}</div>
                                )}
                            </div>

                        </div>

                        <div className="flex flex-col gap-4 w-full ">
                            <div>
                                <label>ชื่อ</label>
                                <div>
                                    <input
                                        className="pr-6 block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                                        type={`text`}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="ชื่อ"
                                    />
                                </div>
                                {error && error.name && (
                                    <div className={`my-2 text-sm text-[#d70000]`}>
                                        {error.name}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label>รายละเอียด</label>
                                <div>
                                    <textarea
                                        className="pr-6 block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                                        type={`text`}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="รายละเอียด"
                                    />
                                </div>
                                {error && error.description && (
                                    <div className={`my-2 text-sm text-[#d70000]`}>
                                        {error.description}
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
                                    <div className="text-red-500 mt-4">{error.status[0]}</div>
                                )}
                            </div>
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
