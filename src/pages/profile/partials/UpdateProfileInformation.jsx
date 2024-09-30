import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import baseUrl from '../../../routes/BaseUrl';
import { PiArrowRightThin, PiCameraThin } from 'react-icons/pi';
import Button from '../../../components/Button';

export function UpdateProfileInformation() {
  const { token, user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [newAvatar, setNewAvatar] = useState(null);
  const [error, setError] = useState([]);
  const navigate = useNavigate();


  console.log(token)

  useEffect(() => {
    if (user) {
      setName(user?.name);
      setAvatar(user?.avatar);
    }
  }, [user]);


  const updateProfile = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (name) {
      formData.append('name', name);
    }
    if (newAvatar) {
      formData.append('avatar', newAvatar);
    }

    try {
      const response = await axios.post(`/api/profile/update-information`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.status === 200) {
        Swal.fire({
          icon: 'success',
          text: response.data.message,
          confirmButtonText: 'ตกลง',
          confirmButtonColor: 'black',
          focusConfirm: false,
        });
        setUser(response.data.user);
      } else if (response.data.status === 400) {
        navigate('/');
        Swal.fire({
          icon: 'error',
          text: response.data.message,
          confirmButtonText: 'ตกลง',
          confirmButtonColor: 'black',
          focusConfirm: false,
        });
      } else if (response.data.status === 422) {
        setError(response.data.errors)
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

  const handleavatarUpload = () => {
    document.getElementById('avatarInput').click();
  };

  const onFileChange = (event) => {
    setNewAvatar(event.target.files[0]);
  };


  return (
    <div>
      <form onSubmit={updateProfile}>
        <div className="flex flex-col gap-4">
          <div className="mx-auto cursor-pointer relative w-[10rem] h-[10rem] overflow-hidden rounded-full group">
            <div
              className="absolute w-full h-full bg-black/40 flex items-center justify-center -bottom-20 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
              onClick={handleavatarUpload}
            >
              <div className="flex flex-col items-center text-white">
                รูปภาพ
                <PiCameraThin size={50} />
              </div>
            </div>
            {newAvatar ? (
              <img className="w-full h-full object-cover" src={URL.createObjectURL(newAvatar)} alt="New Uploaded avatar" />
            ) : user && user.avatar ? (
              <img className="w-full h-full object-cover" src={`${baseUrl}/images/avatar/${user.avatar}`} alt={`รูปภาพของ ${user.name}`} />
            ) : (
              <img className="w-full h-full object-cover" src={`${baseUrl}/images/product/No_image.png`} alt={`ไม่มีรูปภาพ Avatar`} />
            )}
            <input hidden id="avatarInput" type="file" onChange={onFileChange} />
            <div className="text-red-700 text-sm">{error.avatar}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="col-span-1 md:col-span-2">
              <label className="block mb-2">ชื่อ</label>
              <input
                className="block w-full placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
                type="text"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                }}
                placeholder="กรุณาใส่ชื่อ"
              />
              <div className="text-red-700 text-sm">{error.name}</div>
            </div>
          </div>

        </div>

        <div className="flex items-center justify-end">
          <Button name={'บันทึก'} icon={<PiArrowRightThin size={25} />} className={'mt-4'} type="submit" />
        </div>

      </form>
    </div>
  );
}