import React, { useContext, useState } from 'react';
import { UserContext } from '../../../context/UserContext';
import Swal from 'sweetalert2';
import axios from 'axios';

import { FaRegSave } from "react-icons/fa";
import { PiArrowRightThin } from 'react-icons/pi';
import Button from '../../../components/Button';

export function UpdatePassword() {

  const { user, token } = useContext(UserContext);

  const [current_password, setCurrentPassword] = useState('');
  const [new_password, setNewPassword] = useState('');
  const [new_password_confirmation, setNewPasswordConfirmation] = useState('');
  const [error, setError] = useState([]);

  const updatePassword = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('current_password', current_password);
    formData.append('new_password', new_password);
    formData.append('new_password_confirmation', new_password_confirmation);

    try {
      const response = await axios.post(`/api/profile/update-password`, formData);
      if (response.data.status === 200) {
        Swal.fire({
          icon: "success",
          text: response.data.message,
          confirmButtonText: "ตกลง",
          confirmButtonColor: "black",
          focusConfirm: false,
        });
        // เคีรย์ข้อมูลในฟิลดิ์ทั้งหมด
        setCurrentPassword('');
        setNewPassword('');
        setNewPasswordConfirmation('');
      } else if (response.data.status === 400) {
        Swal.fire({
          icon: "error",
          text: response.data.message,
          confirmButtonText: "ตกลง",
          confirmButtonColor: "black",
          focusConfirm: false,
        }).
          // เคีรย์ข้อมูลในฟิลดิ์ทั้งหมด
          setCurrentPassword('');
        setNewPassword('');
        setNewPasswordConfirmation('');
      } else if (response.data.status === 422) {
        setError(response.data.errors);
        console.log(error)
      }
    } catch (error) {
      if (error.response.status === 401) {
        Swal.fire({
          icon: "warning",
          text: "กรุณาเข้าสู่ระบบ",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "black",
          focusConfirm: false,
        });
        navigate('/');
      }
    }
  }

  return (
    <form onSubmit={updatePassword}>

      <div className="flex flex-col gap-2">
        <div className="col-span-1 md:col-span-2 mb-2">
          <label className="block">รหัสผ่านปัจจุบัน</label>
          <input
            className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
            type="password"
            value={current_password}
            onChange={(event) => setCurrentPassword(event.target.value)}
            placeholder="กรุณาใส่รหัสผ่านปัจจุบัน"
          />
          {error && error.current_password && (
            <div className="text-red-500 text-sm mt-2">{error.current_password}</div>
          )}
        </div>

        <div className="col-span-1 md:col-span-2 mb-2">
          <label className="block mb-2">รหัสผ่านใหม่</label>
          <input
            className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
            type="password"
            value={new_password}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="กรุณาใส่รหัสผ่านใหม่"
          />
          {error && error.new_password && (
            <div className="text-red-500 text-sm mt-2">{error.new_password[0]}</div>
          )}
        </div>

        <div className="col-span-1 md:col-span-2 mb-2">
          <label className="block">ยืนยันรหัสผ่านใหม่</label>
          <input
            className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
            type="password"
            value={new_password_confirmation}
            onChange={(event) => setNewPasswordConfirmation(event.target.value)}
            placeholder="กรุณาใส่รหัสผ่านใหม่อีกครั้ง"
          />
          {error && error.new_password_confirmation && (
            <div className="text-red-500 text-sm mt-2">{error.new_password_confirmation[0]}</div>
          )}
        </div>

      </div>

      <div className="flex items-center justify-end">
        <Button name={'บันทึก'} icon={<PiArrowRightThin size={25} />} className={'mt-4'} type="submit" />
      </div>
    </form>
  )
}
