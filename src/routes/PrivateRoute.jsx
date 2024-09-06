import React, { useState, useEffect, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Rings } from 'react-loader-spinner'
import { UserContext } from '../context/UserContext';
export default function PrivateRoute() {

  const { token } = useContext(UserContext);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkingAuthenticated();
  }, []);

  const checkingAuthenticated = async () => {
    try {
      await axios.get(`/sanctum/csrf-cookie`, { credentials: 'include' });
      const response = await axios.get('/api/checkingAuthenticated');
      if (response.data.status === 200) {
        setAuthenticated(true)
        setLoading(false);
      } else if (response.data.status === 401) {
        Swal.fire({
          icon: "warning",
          text: response.data.message,
          confirmButtonText: "ตกลง",
          confirmButtonColor: "black",
          focusConfirm: false,
        });
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

  if (loading) {
    return <>
      (<Rings
        visible={true}
        height="500"
        width="500"
        color="black"
        ariaLabel="rings-loading"
        wrapperClass="flex justify-center"
      />)
    </>

  }

  return authenticated ? <Outlet /> : null;
}