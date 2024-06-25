import React, { useState, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

export default function Register() {
    const navigate = useNavigate(); 
    const { setUser, setToken } = useContext(UserContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

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
                        text: res.data.message,  // Display the message from response
                        confirmButtonText: "ตกลง",
                        confirmButtonColor: "black",
                        focusConfirm: false,
                    });
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('user', res.data.user.name);
                    setUser(res.data.user);
                    setToken(res.data.token);
                    navigate('/');
                } else {
                    Swal.fire({
                        icon: "error",
                        text: res.data.message,  // Display the message from response
                        confirmButtonText: "ตกลง",
                        confirmButtonColor: "black",
                        focusConfirm: false,
                    });
                }
            }).catch(error => {
                if (error.response && error.response.data && error.response.data.errors) {
                    setValidationErrors(error.response.data.errors);
                }
            });
        });
    }

    return (
        <div className="p-10 bg-white w-[25rem]">
            <h1 className="text-2xl font-semibold text-center text-black mb-4">สมัครสมาชิก</h1>
            <form onSubmit={submitRegister}>
                <div>
                    <label className="text-lg block font-semibold text-black">ชื่อ</label>
                    <input 
                        className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        placeholder="กรุณาใส่ชื่อ"
                    />
                    {validationErrors.name && (
                        <div className="text-red-500 text-sm mt-2">{validationErrors.name[0]}</div>
                    )}
                </div>
                <div className="mt-2">
                    <label className="text-lg block font-semibold text-black">อีเมล</label>
                    <input 
                        className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="กรุณาใส่อีเมล"
                    />
                    {validationErrors.email && (
                        <div className="text-red-500 text-sm mt-2">{validationErrors.email[0]}</div>
                    )}
                </div>
                <div className="mt-2">
                    <label className="text-lg block font-semibold text-black">รหัสผ่าน</label>
                    <input 
                        className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="กรุณาใส่รหัสผ่าน"
                    />
                    {validationErrors.password && (
                        <div className="text-red-500 text-sm mt-2">{validationErrors.password[0]}</div>
                    )}
                </div>
                <div className="mt-2">
                    <label className="text-lg block font-semibold text-black">ยืนยันรหัสผ่าน</label>
                    <input 
                        className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                        type="password" 
                        value={passwordConfirmation} 
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        placeholder="กรุณาใส่รหัสผ่านอีกครั้ง"
                    />
                    {validationErrors.password_confirmation && (
                        <div className="text-red-500 text-sm mt-2">{validationErrors.password_confirmation[0]}</div>
                    )}
                </div>
                <button 
                    type="submit" 
                    className="mt-8 w-full relative flex justify-center items-center gap-2 border-2 rounded-full border-black bg-transparent py-2 px-5 font-medium uppercase text-black hover:text-white hover:bg-black transition-all duration-300"
                >
                    <div>สมัครสมาชิก</div>
                </button>
            </form>
        </div>
    );
}
