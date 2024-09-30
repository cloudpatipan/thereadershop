import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const navigate = useNavigate;

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      await axios.get(`/sanctum/csrf-cookie`, { credentials: 'include' });
      const response = await axios.get(`/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (response.data.status === 200) {
        setUser(response.data.user);
      } else if (response.data.status === 400) {
        Swal.fire({
          icon: "error",
          text: response.data.message,
          confirmButtonText: "ตกลง",
          confirmButtonColor: "black",
          focusConfirm: false,
        });
        navigate('/');
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
      }
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };
