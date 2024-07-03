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
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const [error, setError] = useState([]);

    const submitRegister = async (e) => {
        e.preventDefault();

        if (password !== passwordConfirmation) {
            Swal.fire({
                icon: "error",
                text: "รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน",
                confirmButtonText: "ตกลง",
                confirmButtonColor: "black",
                focusConfirm: false,
            });
            return;
        }

        const data = { name, email, password, password_confirmation: passwordConfirmation };

        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post('/api/register', data).then(res => {
                if (res.data.status === 200) {
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
            <h1 className="text-2xl  text-center text-black mb-4">สมัครสมาชิก</h1>
            <form onSubmit={submitRegister}>
                <div>
                    <label className="text-sm md:text-base block ">ชื่อ</label>
                    <input
                        className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="กรุณาใส่ชื่อ"
                    />
                    <div className="text-red-700 text-sm">{error.name}</div>
                </div>
                <div className="mt-2">
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
                <div className="mt-2">
                    <label className="text-sm md:text-base block  text-black">รหัสผ่าน</label>
                    <input
                        className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="กรุณาใส่รหัสผ่าน"
                    />
                      <div className="text-red-700 text-sm">{error.password}</div>
                </div>
                <div className="mt-2">
                    <label className="text-sm md:text-base block  text-black">ยืนยันรหัสผ่าน</label>
                    <input
                        className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                        type="password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        placeholder="กรุณาใส่รหัสผ่านอีกครั้ง"
                    />
                    <div className="text-red-700 text-sm">{error.password_confirmation}</div>
                </div>
            <Button icon={<PiUserPlusThin size={20}/>} className={`mt-1 w-full`}>
            สมัครสมาชิก
            </Button>
            </form>
        </div>
    );
}
