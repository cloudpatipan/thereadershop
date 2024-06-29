import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Rings } from 'react-loader-spinner'
export default function AdminRoute() {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkingAuthenticated();
    }, []);

    const checkingAuthenticated = async () => {
        axios.get('/api/checkingAuthenticatedAdmin').then(response => {
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
            } else if (response.data.status === 403) {
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