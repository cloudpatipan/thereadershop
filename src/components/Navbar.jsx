import React, { useEffect, useContext, useState } from 'react';
import Modal from './Modal';
import Dropdown from './Dropdown';
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import { Link } from 'react-router-dom';
import { GiHamburgerMenu } from "react-icons/gi";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { IoIosLogIn, IoIosLogOut } from "react-icons/io";
import { FaUserPlus } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { MdFullscreen } from "react-icons/md";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { FaBagShopping } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import Button from './Button';
import { UserContext } from '../context/UserContext';
import { CartContext } from '../context/CartContext';
export default function Navbar() {

  const navigate = useNavigate();
  const { user, token, setUser, setToken } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [carts, setCarts] = useState([]);
  const { cartCount, setCartCount } = useContext(CartContext);

  useEffect(() => {
    if (token) {
      fetchUserData();
      fetchCart();
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/profile');
      if (response.data.status === 200) {
        setUser(response.data.user);
      } else {
        handleResponseError(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const fetchCart = async () => {
    axios.get(`/api/cart`).then(response => {
      if (response.data.status === 200) {
        setCarts(response.data.carts);
        setCartCount(response.data.carts.length);
        setLoading(false);
      } else if (response.data.status === 400) {
        Swal.fire({
          icon: "error",
          text: response.data.message,
          confirmButtonText: "ตกลง",
          confirmButtonColor: "black",
          focusConfirm: false,
        });
      } else if (response.data.status === 401) {
        Swal.fire({
          icon: "warning",
          text: response.data.message,
          confirmButtonText: "ตกลง",
          confirmButtonColor: "black",
          focusConfirm: false,
        });
        navigate('/')
      }
    });
  }

  const handleResponseError = (data) => {
    // จัดการข้อผิดพลาดที่ได้รับจากเซิร์ฟเวอร์
    console.error('Response error:', data);
  };

  const SubmitLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/logout', null,);
      navigate('/');
      setIsModalOpenLogin(false);
      setIsModalOpenRegister(false);
      setIsDropdownOpen(false);
      // แสดงข้อความสำเร็จ
      Swal.fire({
        icon: "success",
        text: response.data.message,
        confirmButtonText: "ตกลง",
        confirmButtonColor: "black",
        focusConfirm: false,
      });
      // ล้างข้อมูลใน localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } catch (error) {
      await Swal.fire({
        icon: "error",
        text: response.data.message,
        confirmButtonText: "ตกลง",
        confirmButtonColor: "black",
        focusConfirm: false,
      });
    }
  };

  const [isModalOpenLogin, setIsModalOpenLogin] = useState(false);

  const openModalLogin = () => {
    setIsModalOpenLogin(true);
  };

  const closeModalLogin = () => {
    setIsModalOpenLogin(false);
  };

  const [isModalOpenRegister, setIsModalOpenRegister] = useState(false);

  const openModalRegister = () => {
    setIsModalOpenRegister(true);
  };

  const closeModalRegister = () => {
    setIsModalOpenRegister(false);
  };


  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCloseDropdown = () => {
    setIsDropdownOpen(false);
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [isModalOpenAvatar, setIsModalOpenAvatar] = useState(false);

  const openModalAvatar = () => {
    setIsModalOpenAvatar(true);
  };

  const closeModalAvatar = () => {
    setIsModalOpenAvatar(false);
  };

  return (
    <nav className="w-full mx-auto gap-4 text-black mt-4">
      <div className="flex items-center justify-between">

        <Link to={'/'}>
          <h1 className="text-2xl font-semibold text-[#fc823f]">The Reader</h1>
        </Link>

        <div className="hidden md:flex gap-4">
          <Link to={'/'} className="relative flex justify-center items-center gap-2 border-2 rounded-full border-black bg-transparent py-2 px-5 font-medium uppercase text-black hover:text-white hover:bg-black ease-in-out hover:-translate-y-1 transition-all duration-300">
            หน้าหลัก
          </Link>
          <Link to={'/category'} className="relative flex justify-center items-center gap-2 border-2 rounded-full border-black bg-transparent py-2 px-5 font-medium uppercase text-black hover:text-white hover:bg-black ease-in-out hover:-translate-y-1 transition-all duration-300">
            ประเภทสินค้า
          </Link>
        </div>

        <div>
          {!localStorage.getItem('token') ? (
            <div className="hidden md:flex items-center gap-4">
              <Button className="text-sm md:text-base" icon={<IoIosLogIn size={25} />} onClick={openModalLogin}>
                เข้าสู่ระบบ
              </Button>

              <Modal isOpen={isModalOpenLogin} onClose={closeModalLogin}>
                <Login />
              </Modal>

              <Button className="text-sm md:text-base" icon={<FaUserPlus size={25} />} onClick={openModalRegister}>
                สมัครสมาชิก
              </Button>

              <Modal isOpen={isModalOpenRegister} onClose={closeModalRegister}>
                <Register />
              </Modal>
            </div>
          ) : (
            <div>

              {user && token ? (
                <div className="flex gap-4">

                  <Link to={'/cart'}>
                    <button className="text-black w-[3rem] h-[3rem] rounded-full overflow-hidden cursor-pointer group shadow-md flex items-center justify-center">
                      <div className="relative">
                        {cartCount ? (
                          <div className="absolute top-[-0.2rem] right-[-0.2rem] w-[1rem] h-[1rem] flex items-center justify-center bg-black text-white rounded-full">
                            {cartCount}
                          </div>
                        ) : null}
                        <LiaShoppingBagSolid size={30} />
                      </div>
                    </button>
                  </Link>

                  <Dropdown
                    header={
                      <div className="w-[3rem] h-[3rem] rounded-full overflow-hidden cursor-pointer" onClick={handleToggleDropdown}>
                        {user.avatar ? (
                          <img className="w-full h-full object-cover" src={`https://c45c-2405-9800-b540-dc40-d538-9787-5ce1-fc75.ngrok-free.app/images/avatar/${user.avatar}`} alt={`รูปภาพของ ${user.name}`} />
                        ) : (
                          <img className="w-full h-full object-cover" src="https://c45c-2405-9800-b540-dc40-d538-9787-5ce1-fc75.ngrok-free.app/images/product/No_image.png" alt="No Image" />
                        )}
                      </div>
                    }
                  >

                    <div className="flex items-center gap-x-4">
                      <div onClick={openModalAvatar} className="relative cursor-pointer w-[4rem] h-[4rem] rounded-full overflow-hidden group">
                        <div className="absolute w-full h-full bg-black/40 flex items-center justify-center -bottom-20 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="flex flex-col items-center text-white text-xl">
                            <MdFullscreen className="cursour-pointer" />
                          </div>
                        </div>

                        {user.avatar ? (
                          <img className="w-full h-full object-cover" src={` https://c45c-2405-9800-b540-dc40-d538-9787-5ce1-fc75.ngrok-free.app/images/avatar/${user.avatar}`} alt={`รูปภาพของ ${user.name}`} />
                        ) : (
                          <img className="w-full h-full object-cover" src=" https://c45c-2405-9800-b540-dc40-d538-9787-5ce1-fc75.ngrok-free.app/images/product/no_image.png" alt="No Image" />
                        )}
                      </div>
                      <Modal isOpen={isModalOpenAvatar} onClose={closeModalAvatar}>
                        <div className="w-[24rem] h-[34rem] overflow-hidden">
                          {user.avatar ? (
                            <img className="w-full h-full object-cover" src={` https://c45c-2405-9800-b540-dc40-d538-9787-5ce1-fc75.ngrok-free.app/images/avatar/${user.avatar}`} alt={`รูปภาพของ ${user.name}`} />
                          ) : (
                            <img className="w-full h-full object-cover" src=" https://c45c-2405-9800-b540-dc40-d538-9787-5ce1-fc75.ngrok-free.app/images/product/no_image.png" alt="No Image" />
                          )}
                        </div>
                      </Modal>
                      <div className="flex flex-col">
                        <div className="text-xs text-center relative flex justify-center items-center gap-2 rounded-full bg-black font-medium uppercase text-white">
                          {user.role}
                        </div>
                        <p className="text-xl font-semibold text-black">{user.name}</p>
                      </div>

                    </div>

                    {user.role == 'admin' && ( // เช็คว่ามีผู้ใช้ล็อคอินและเป็น admin หรือไม่
                      <Link to={'/dashboard'}>
                        <Button icon={<RiAdminFill size={20} />} className="mt-1 w-full">
                          แอดมิน
                        </Button>
                      </Link>
                    )}
                    <Link to={'/order'}>
                      <Button icon={<FaBagShopping size={20} />} className="mt-1 w-full">
                        รายการสังซื้อ
                      </Button>
                    </Link>
                    <Link to={'/profile'}>
                      <Button icon={<FaUser size={20} />} className="mt-1 w-full">
                        โปรไฟล์
                      </Button>
                    </Link>

                    <Button icon={<IoLogOut size={25} />} className="mt-1 w-full" onClick={SubmitLogout} >
                      ออกจการะบบ
                    </Button>
                  </Dropdown>
                </div>
              ) : null}

            </div>
          )}

        </div>

        <div className="md:hidden">
          <button className="bg-black text-white p-2 rounded-full" id="menu-toggle" onClick={toggleMenu}>
            <GiHamburgerMenu size={25} />
          </button>
        </div>

      </div>
      <div>

        {isMenuOpen ? (
          <div className=" bg-white z-1 flex flex-col md:hidden font-medium uppercase">
            <Link to={'/'} className="bg-white flex justify-center items-center border rounded-full bg-transparent py-2 px-5 font-medium uppercase text-black hover:text-white hover:bg-black transition-all duration-300 mt-1">
              หน้าหลัก
            </Link>
            <Link to={'/category'} className="bg-white flex justify-center items-center border rounded-full bg-transparent py-2 px-5 font-medium uppercase text-black hover:text-white hover:bg-black transition-all duration-300 mt-1">
              ประเภทสินค้า
            </Link>
            <button className="bg-white flex justify-center items-center border rounded-full bg-transparent py-2 px-5 font-medium uppercase text-black hover:text-white hover:bg-black transition-all duration-300 mt-1" onClick={openModalLogin}>
              เข้าสู่ระบบ
            </button>

            <Modal isOpen={isModalOpenLogin} onClose={closeModalLogin}>
              <Login />
            </Modal>

            <button className="bg-white flex justify-center items-center border rounded-full bg-transparent py-2 px-5 font-medium uppercase text-black hover:text-white hover:bg-black transition-all duration-300 mt-1" onClick={openModalRegister}>
              สมัครสมาชิก
            </button>

            <Modal isOpen={isModalOpenRegister} onClose={closeModalRegister}>
              <Register />
            </Modal>
            {user && user.role == 'admin' && ( // เช็คว่ามีผู้ใช้ล็อคอินและเป็น admin หรือไม่
              <Link to={'/admin/product'} className="bg-white relative flex justify-center items-center border rounded-full bg-transparent py-2 px-5 font-medium uppercase text-black hover:text-white hover:bg-black transition-all duration-300 mt-1">
                แอดมิน
              </Link>
            )}
          </div>
        ) : null}

      </div>

    </nav>
  )
}