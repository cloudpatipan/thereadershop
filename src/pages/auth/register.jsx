import React, { useState, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { PiUserPlusThin } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import Button from '../../components/Button';
export default function Register() {
    const navigate = useNavigate();
    const { setUser, setToken } = useContext(UserContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setPasswordConfirmation] = useState('');

    const [error, setError] = useState([]);

    const submitRegister = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('password_confirmation', password_confirmation);

        try {
            await axios.get('/sanctum/csrf-cookie');
            const response = await axios.post('/api/register', formData);
            if (response.data.status === 200) {
                Swal.fire({
                    icon: "success",
                    text: response.data.message,
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "black",
                    focusConfirm: false,
                });
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', response.data.user.name);
                setUser(response.data.user);
                setToken(response.data.token);
            } else if (response.data.status === 400) {
                Swal.fire({
                    icon: "warning",
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
        <div>
            <h1 className="text-2xl mb-4">สมัครสมาชิก</h1>
            <form onSubmit={submitRegister}>

                <div className="flex flex-col gap-4">

                    <div>
                        <label>ชื่อ</label>
                        <input
                            className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="ชื่อ"
                        />
                        {error && error.name && (
                            <div className={`my-2 text-sm text-[#d70000]`}>
                                {error.name}
                            </div>
                        )}
                    </div>
                    <div className="mt-2">
                        <label className="text-sm md:text-base block  text-black">อีเมล</label>
                        <input
                            className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="อีเมล"
                        />
                        {error && error.email && (
                            <div className={`my-2 text-sm text-[#d70000]`}>
                                {error.email}
                            </div>
                        )}

                    </div>
                    <div>
                        <label>รหัสผ่าน</label>
                        <input
                            className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="รหัสผ่าน"
                        />
                        {error && error.password && (
                            <div className={`my-2 text-sm text-[#d70000]`}>
                                {error.password}
                            </div>
                        )}
                    </div>
                    <div className="mt-2">
                        <label className="text-sm md:text-base block  text-black">ยืนยันรหัสผ่าน</label>
                        <input
                            className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                            type="password"
                            value={password_confirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            placeholder="ยืนยันรหัสผ่าน"
                        />
                        {error && error.password_confirmation && (
                            <div className={`my-2 text-sm text-[#d70000]`}>
                                {error.password_confirmation}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Button name={'สมัครสมาชิก'} icon={<PiUserPlusThin size={20} />} onClick={submitRegister} />
                    </div>

                </div>

            </form>
        </div>
    );
}
