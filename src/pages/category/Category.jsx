import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import { IoMdArrowDropright, IoMdArrowDropleft } from "react-icons/io";
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

                        <Link to={`/`}>
                        <Button icon={<IoMdArrowDropleft size={20}/>} className={`mb-2`}>
                            กลับ
                        </Button>
                        </Link>

                        <div div className="grid grid-cols-1 md:grid-cols-4 gap-4" >
                            {
                                categories.length > 0 ? (
                                    categories.map((category, index) => (
                                        <div key={index}>
                                            <Link to={`/category/${category.slug}`}>
                                                <div className="rounded-lg border p-4 relative flex justify-between items-center gap-2 border rounded-full bg-transparent font-medium uppercase text-black hover:text-white hover:bg-black transition-all duration-300">
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
