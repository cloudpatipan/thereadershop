import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function PrivateRoute() {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    useEffect(() => {
        checkingAuthenticated();
    }, []);
    
    const checkingAuthenticated = async () => {
        axios.get('/api/checkingAuthenticated').then(response => {
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
            navigate('/');
          }
        });
      }

    if (loading) {
        return <div className="h-screen flex items-center justify-center">
                    <h1 className="text-[2rem] font-semibold">กำลังโหลด...</h1>
                </div>
    }

    return authenticated ? <Outlet /> : null;
}