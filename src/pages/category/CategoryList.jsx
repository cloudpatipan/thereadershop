import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Rings } from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
export default function CategoryList() {
    const [categories, setCategoires] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`/api/category-all`);
            if (response.data.status === 200) {
                setCategoires(response.data.categories);
                setLoading(false);
            }
        } catch (error) {
            await Swal.fire({
                icon: "error",
                text: error,
                confirmButtonText: "ตกลง",
                confirmButtonColor: "black",
                focusConfirm: false,
            });
        }
    }

    return (
        <div>
            {loading ? (
                (<Rings
                    visible={true}
                    height="500"
                    width="500"
                    color="black"
                    ariaLabel="rings-loading"
                    wrapperClass="flex justify-center"
                />)
            ) : (
                <div>
                    <h1 className="text-xl mb-4">ประเภทหนังสือ</h1>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4" >
                        {
                            categories.length > 0 ? (
                                categories.map((category, index) => (
                                    <div key={index}>
                                        <Link to={`/category/${category.slug}`}>
                                            <div className="text-sm py-2 px-4 relative flex justify-between items-center gap-4 border rounded-lg transition-all duration-300">
                                                <div className="flex flex-col">
                                                    <p>{category.name}</p>
                                                </div>
                                                <div>
                                                    {category.product_count} เล่ม
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="flex items-center justify-center rounded-lg col-span-3 md:col-span-6">
                                    <span className="text-sm">ไม่มีประเภทหนังสือ</span>
                                </div>
                            )
                        }
                    </div>
                </div>
            )}
        </div>
    )
}
