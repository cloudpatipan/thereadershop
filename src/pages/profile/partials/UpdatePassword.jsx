import React, { useContext, useState } from 'react';
import { UserContext } from '../../../context/UserContext';
import Swal from 'sweetalert2';
import axios from 'axios';

import { FaRegSave } from "react-icons/fa";
export default function UpdatePassword() {
    
  const { user, token } = useContext(UserContext);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [validationError, setValidationError] = useState(null);
  
  const formData = new FormData();

  formData.append('currentPassword', currentPassword);
  formData.append('newPassword', newPassword);
  formData.append('newPasswordConfirmation', newPasswordConfirmation);
  

  const updatePassword = async (e) => {
    e.preventDefault();
  
      axios.post(`/api/profile/update-password`, {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirmation
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }).then(response => {
        if(response.data.status === 200)
            {
              Swal.fire({
                icon: "success",
                text: response.data.message,
                confirmButtonText: "ตกลง",
                confirmButtonColor: "black",
                focusConfirm: false,
              }).then(() => {
                window.location.reload();
              })
            } else if(response.data.status === 400)
            {
                Swal.fire({
                    icon: "error",
                    text: response.data.message,
                    confirmButtonText: "ตกลง",
                    confirmButtonColor: "black",
                    focusConfirm: false,
                  }).then(() => {
                    // เคีรย์ข้อมูลในฟิลดิ์ทั้งหมด
                    setCurrentPassword("");
                    setNewPassword("");
                    setNewPasswordConfirmation("");
                  });
            } else if(response.data.status === 401)
              {
                  navigate('/');
                  Swal.fire({
                      icon: "warning",
                      text: response.data.message,
                      confirmButtonText: "ตกลง",
                      confirmButtonColor: "black",
                      focusConfirm: false,
                  });
              }
    });
  }


  return (
    <form onSubmit={updatePassword}>
      
    <div className="col-span-1 md:col-span-2">
                          <label className="block mb-2">รหัสผ่านปัจจุบัน</label>
                          <input 
                          className="block w-full border-0 rounded-md text-black py-1.5 px-4 ring-1 ring-black/40 ring-inset-gray-300 placeholder:text-black/40 focus:ring-inset focus:ring-black text-sm md:text-sm leading-6" 
                          type="password" 
                          value={currentPassword} 
                          onChange={(event) => setCurrentPassword(event.target.value)} 
                          placeholder="กรุณาใส่รหัสผ่านปัจจุบัน"
                        />
      {validationError && validationError.currentPassword && (
        <div className="text-red-500 text-sm mt-2">{validationError.currentPassword[0]}</div>
      )}
    </div>

    <div className="col-span-1 md:col-span-2">
                          <label className="block mb-2">รหัสผ่านใหม่</label>
                          <input 
                            className="block w-full border-0 rounded-md text-black py-1.5 px-4 ring-1 ring-black/40 ring-inset-gray-300 placeholder:text-black/40 focus:ring-inset focus:ring-black text-sm md:text-sm leading-6" 
                            type="password" 
                            value={newPassword} 
                            onChange={(event) => setNewPassword(event.target.value)} 
                            placeholder="กรุณาใส่รหัสผ่านใหม่"
                          />
      {validationError && validationError.newPassword && (
      <div className="text-red-500 text-sm mt-2">{validationError.newPassword[0]}</div>
      )}
    </div>

    <div className="col-span-1 md:col-span-2">
                          <label className="block mb-2">ยืนยันรหัสผ่านใหม่</label>
                          <input 
                          className="block w-full border-0 rounded-md text-black py-1.5 px-4 ring-1 ring-black/40 ring-inset-gray-300 placeholder:text-black/40 focus:ring-inset focus:ring-black text-sm md:text-sm leading-6" 
                          type="password" 
                          value={newPasswordConfirmation} 
                          onChange={(event) => setNewPasswordConfirmation(event.target.value)} 
                          placeholder="กรุณาใส่รหัสผ่านใหม่อีกครั้ง"
                        />
      {validationError && validationError.newPasswordConfirmation && (
        <div className="text-red-500 text-sm mt-2">{validationError.newPasswordConfirmation[0]}</div>
      )}
    </div>

    <button type="submit" className="mt-2 relative flex justify-center w-full items-center gap-2 border-2 rounded-lg border-black bg-transparent py-2 px-5 font-medium uppercase text-black transition-colors before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:origin-top-left before:scale-x-0 before:bg-black before:transition-transform before:duration-300 before:content-[''] hover:text-white before:hover:scale-x-100">
              <div>
              <FaRegSave size={20}/>
              </div>
              <div>
                  บันทึก
              </div>
    </button>

    </form>
  )
}
