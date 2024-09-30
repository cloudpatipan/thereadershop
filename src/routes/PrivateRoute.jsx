import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Rings } from 'react-loader-spinner'

export default function PrivateRoute() {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkingAuthenticated();
    }, []);

    const checkingAuthenticated = async () => {
        try {
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