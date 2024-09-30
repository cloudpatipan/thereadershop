import React, { useState, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { PiEyeThin } from "react-icons/pi";
import { PiEyeSlashThin } from "react-icons/pi";
import { UserContext } from '../../context/UserContext';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { PiArrowLineLeftThin } from "react-icons/pi";
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

        const formData = new FormData();

        formData.append('email', email);
        formData.append('password', password);

        try {
            await axios.get('/sanctum/csrf-cookie');
            const response = await axios.post('/api/login', formData);
            if (response.data.status === 200) {
                if (response.data.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
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
            <h1 className="text-2xl mb-4">เข้าสู่ระบบ</h1>
            <form onSubmit={SubmitLogin}>
                <div className="flex flex-col gap-4">

                    <div>
                        <label>อีเมล</label>
                        <input
                            className="pr-6 block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                            type={'email'}
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
                        <div className="relative">
                            <input
                                className="pr-6 block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                                type={showPassword ? "text" : "password"}
                                autoComplete='current-password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="รหัสผ่าน"
                            />
                            <button type="button" onClick={toggleShowPassword} className="absolute top-0 right-0 mt-2 text-sm">
                                {showPassword ? <PiEyeThin size={20} /> : <PiEyeSlashThin size={20} />}
                            </button>
                        </div>
                        {error && error.password && (
                            <div className={`my-2 text-sm text-[#d70000]`}>
                                {error.password}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Button name={'เข้าสู่ระบบ'} icon={<PiArrowLineLeftThin size={20} />} type={SubmitLogin} />
                    </div>

                </div>

            </form>
        </div>
    );
}
