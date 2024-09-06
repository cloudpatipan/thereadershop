import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Layouts/Sidebar';
import Button from '../../components/Button';
import { PiArrowLineLeftThin } from 'react-icons/pi';

export default function EditCategory() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [name, setName] = useState('');
    const [status, setStatus] = useState(false);

    useEffect(() => {
        fetchCategory();
    }, [id]);

    const fetchCategory = async () => {
        try {
            const response = await axios.get(`/api/categories/${id}`);
            if (response.data.status === 200) {
                setName(response.data.category.name);
                setStatus(response.data.category.status);
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

    const updateCategory = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('_method', 'PATCH');
        formData.append('name', name);
        formData.append('status', status ? 1 : 0);

        try {
            const response = await axios.post(`/api/categories/${id}`, formData);
            if (response.data.status === 200) {
                Swal.fire({
                    icon: "success",
                    text: response.data.message,
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "black",
                    focusConfirm: false,
                });
                setError([]);
                navigate("/admin/category");
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


    return (
        <Sidebar>
            <h1 className="text-2xl mb-4">แบรนด์ (แก้ไข)</h1>
            <form onSubmit={updateCategory}>

                <div className="flex flex-col gap-4">
                    <div className="p-4 border rounded grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">

                        <div className="col-span-1 md:col-span-2">
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

                    <div className="flex justify-end">
                        <Button type={'submit'} name={'บันทึก'} icon={<PiArrowLineLeftThin size={20} />} />
                    </div>

                </div>
            </form>


        </Sidebar>
    );
}
