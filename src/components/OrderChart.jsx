import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Sidebar from './Layouts/Sidebar';
import axios from 'axios';
import Swal from 'sweetalert2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
    },
};

export default function OrderChart() {
    const [dataChart, setDataChart] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await axios.get(`/api/orderDashboard`);
            if (response.data.status === 200) {
                const orders = response.data.orders;
                const labels = orders.map(data => data.id);
                const values = orders.map(data =>
                    data.orderitems.reduce((total, item) => total + item.price, 0)
                );

                setDataChart({
                    labels: labels,
                    datasets: [
                        {
                            label: 'ออร์เดอร์',
                            data: values,
                            backgroundColor: 'rgb(0, 0, 0)',
                        },
                    ]
                });
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

return (
    <>
        <Line options={options} data={dataChart} />
    </>
);
}
