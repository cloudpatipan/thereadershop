import React, { useState, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { UserContext } from '../../context/UserContext';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { IoIosLogIn } from "react-icons/io";
export default function Login() {
    const navigate = useNavigate();
    const { setUser, setToken } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const [error, setError] = useState([]);

    const SubmitLogin = async (e) => {
        e.preventDefault();

        const data = { email, password };

        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post('/api/login', data).then(res => {
                if (res.data.status === 200) {
                    if (res.data.role === 'admin') {
                        navigate('/admin/product');
                    } else {
                        navigate('/');
                    }
                    Swal.fire({
                        icon: "success",
                        text: res.data.message,
                        confirmButtonText: "ตกลง",
                        confirmButtonColor: "black",
                        focusConfirm: false,
                    });
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('user', res.data.user.name);
                    setUser(res.data.user);
                    setToken(res.data.token);
                } else if (res.data.status === 400) {
                    Swal.fire({
                        icon: "warning",
                        text: res.data.message,
                        confirmButtonText: "ตกลง",
                        confirmButtonColor: "black",
                        focusConfirm: false,
                    });
                } else if (res.data.status === 422) {
                    setError(res.data.errors);
                }

            });
        })
    }

    return (
        <div>
            <h1 className="text-2xl  text-center text-black mb-4">เข้าสู่ระบบ</h1>
            <form onSubmit={SubmitLogin}>
                <div>
                    <label className="text-sm md:text-base block  text-black">อีเมล</label>
                    <input
                        className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="กรุณาใส่อีเมล"
                    />
                    <div className="text-red-700 text-sm">{error.email}</div>
                </div>

                <div className="mt-4">
                    <label className="text-sm md:text-base block text-black ">รหัสผ่าน</label>
                    <div className="relative">
                        <input
                            className="pr-6 block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                            type={showPassword ? "text" : "password"}
                            autoComplete='current-password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="กรุณาใส่รหัสผ่าน"
                        />
                        <button type="button" onClick={toggleShowPassword} className="text-black absolute top-0 right-0 mt-2 text-sm">
                            {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                        </button>
                    </div>
                    <div className="text-red-700 text-sm">{error.password}</div>
                </div>
                <button
                    type="submit"
                    className="mt-8 w-full relative flex justify-center items-center gap-2 border-2 rounded-full border-black bg-transparent py-2 px-5 font-medium uppercase text-black hover:text-white hover:bg-black transition-all duration-300"
                >
                    <div>เข้าสู่ระบบ</div>
                </button>
            </form>
        </div>
    );
}
