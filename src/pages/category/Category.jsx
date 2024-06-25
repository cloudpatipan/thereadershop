import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import { Link } from 'react-router-dom';

export default function CategoryAll() {
    const [categories, setCategoires] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTypes();
    }, []);

    const fetchTypes = async () => {
        try {
            const response = await axios.get(`/api/category-all`);
            setCategoires(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    document.title = "ประเภทสินค้า";

    return (
        <Layout>

            <div>
                {loading ? (
                    <div className="flex items-center justify-center">
                        <span className="text-3xl font-semibold">กำลังโหลด...</span>
                    </div>
                ) : (
                    <div>
                        <h1 className="text-2xl font-semibold">ประเภทสินค้า</h1>

                        <div div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-4" >
                            {
                                categories.length > 0 ? (
                                    categories.map((category, index) => (
                                        <div key={index}>
                                            <Link to={`/category/${category.slug}`}>
                                                <div className="rounded-lg border flex items-center justify-between p-4">
                                                    <div className="flex flex-col">
                                                        <h2>{category.name}</h2>
                                                    </div>
                                                    <div>
                                                        {category.product_count} สินค้า
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center justify-center rounded-lg col-span-3 md:col-span-6">
                                        <span className="text-3xl font-semibold">ไม่มีประเภทสินค้า</span>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                )}
            </div>

        </Layout>
    )
}
