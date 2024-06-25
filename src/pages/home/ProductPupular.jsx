import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { CgDetailsMore } from "react-icons/cg";
import { IoMdArrowDropright, IoMdArrowDropleft } from "react-icons/io";
import { FaSearch } from "react-icons/fa";

export default function ProductPopular({ products }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(0);
  const productsPerPage = 12;

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(pageNumber * productsPerPage, (pageNumber + 1) * productsPerPage);

  return (
    <section>
      <div>
        <div className="flex flex-col md:flex-row justify-between">

          <div>
            <h1 className="text-2xl font-semibold">แนะนำสินค้ายอดนิยม</h1>
          </div>

          <div className="relative">
            <input type="text" placeholder="ค้นหาสินค้ายอดนิยม"
              className="md:w-[10rem] w-full pl-8 placeholder:text-sm text-base border-b appearance-none focus:outline-none bg-transparent text-black py-1"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <FaSearch className="absolute top-2 left-0" />
          </div>

        </div>

        <div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 my-4 rounded-lg border p-4">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product, index) => (
                <div key={index}>
                  <Link to={`/product/detail/${product.slug}`}>
                    <div className="relative overflow-hidden rounded-lg group">
                      <div className="absolute w-full h-full bg-black/40 flex items-center justify-center -bottom-20 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="flex flex-col items-center text-white text-xl">
                          รายละเอียด
                          <CgDetailsMore size={28} />
                        </div>
                      </div>
                      {product.image ? (
                        <img className="rounded-lg w-full h-full object-cover" src={` https://c45c-2405-9800-b540-dc40-d538-9787-5ce1-fc75.ngrok-free.app/images/product/${product.image}`} alt={product.name} />
                      ) : (
                        <img className="rounded-lg w-full h-full object-cover" src=" https://c45c-2405-9800-b540-dc40-d538-9787-5ce1-fc75.ngrok-free.app/images/product/No_image.png" alt="No Image" />
                      )}
                    </div>
                  </Link>
                  <div className="p-2 text-center">
                    <p className="text-sm md:text-base font-semibold text-clip overflow-hidden">{product.name}</p>
                    <p className="text-sm text-clip overflow-hidden text-black/40 font-semibold">{product.category.name}</p>
                    <span className="font-bold">฿ {product.price}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center rounded-lg col-span-3 md:col-span-6">
                <span className="text-3xl font-semibold">ไม่มีสินค้ายอดนิยม</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <ReactPaginate
        previousLabel={
          <span className="w-10 h-10 flex items-center justify-center bg-black rounded-full text-white">
            <IoMdArrowDropleft size={20} />
          </span>
        }
        nextLabel={
          <span className="w-10 h-10 flex items-center justify-center bg-black rounded-full text-white">
            <IoMdArrowDropright size={20} />
          </span>
        }
        pageCount={pageCount}
        breakLabel={
          <span className="mr-4">
            ...
          </span>
        }
        onPageChange={handlePageClick}
        containerClassName="flex justify-center items-center gap-2 mt-2"
        pageClassName="block border- border-solid border-black bg-black w-10 h-10 flex items-center justify-center rounded-full text-white"
        activeClassName="bg-black/40"
      />
    </section>
  );
}
