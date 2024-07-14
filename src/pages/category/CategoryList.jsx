import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Rings } from 'react-loader-spinner';
import { Link } from 'react-router-dom';
export default function CategoryList() {
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
            <h1 className="text-sm mb-1">ประเภทสินค้า</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-y-1 gap-x-4 mb-1" >
                {
                    categories.length > 0 ? (
                        categories.map((category, index) => (
                            <div key={index}>
                                <Link to={`/category/${category.slug}`}>
                                    <div className="text-sm py-2 px-4 relative flex justify-between items-center gap-2 border rounded-full transition-all duration-300">
                                        <div className="flex flex-col">
                                            <p>{category.name}</p>
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
                            <span className="text-sm">ไม่มีประเภทสินค้า</span>
                        </div>
                    )
                }
            </div>
        </div>
    )}
</div>
  )
}
