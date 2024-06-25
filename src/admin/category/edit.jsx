import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Layouts/Sidebar';

export default function EditCategory() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [name, setName] = useState("");
    const [status, setStatus] = useState(false);

    useEffect(() => {
        fetchCategory();
    }, []);

    const fetchCategory = async () => {
        try {
            const response = await axios.get(`/api/categories/${id}`);
            const { name, status } = response.data;
            setName(name);
            setStatus(status);
        } catch (error) {
            Swal.fire({
                text: "มีข้อผิดพลาดเกี่ยวกับการดึงข้อมูลสินค้า",
                icon: "error"
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

        axios.post(`/api/categories/${id}`, formData, {
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
                navigate("/admin/category");
            } else if (response.data.status === 422) {
                setError(response.data.errors);
                console.log(response.data.errors);
            }
        });
    }


    return (
        <Sidebar>
            <h1 className="text-2xl font-semibold text-center mb-8">เพิ่มประเภทสินค้า</h1>
            <form onSubmit={updateCategory}>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">

                    <div className="col-span-1 md:col-span-2">
                        <label className="text-lg block text-black font-semibold">ชื่อ</label>
                        <input
                            className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                            type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="กรุณาใส่ชื่อ"
                        />
                        <div className="text-red-700 text-sm">{error.name}</div>
                    </div>

                    <div>
                        <label className="text-lg block text-black font-semibold">สถานะ</label>
                        <input className="accent-black"
                            type="checkbox"
                            checked={status}
                            onChange={(event) => setStatus(event.target.checked)}
                        />
                        <div className="text-red-700 text-sm">{error.status}</div>
                    </div>

                </div>

                <button type="submit" className="mt-8 w-full relative flex justify-center items-center gap-2 border-2 rounded-full border-black bg-transparent py-2 px-5 font-medium uppercase text-black hover:text-white hover:bg-black transition-all duration-300">
                    <div>บันทึก</div>
                </button>
            </form>
        </Sidebar>
    );
}
