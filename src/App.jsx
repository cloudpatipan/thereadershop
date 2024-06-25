import React, { useState, useContext } from 'react';
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home'
import ProductDetail from './pages/product_detail/ProductDetail';

import ViewProduct from './admin/product';
import CreateProduct from './admin/product/create';
import EditProduct from './admin/product/edit';

import ViewCategory from './admin/category';
import CreateCategory from './admin/category/create';
import EditCategory from './admin/category/edit';

import ViewBrand from './admin/brand';
import CreateBrand from './admin/brand/create';
import EditBrand from './admin/brand/edit';

import ViewBank from './admin/bank';
import CreateBank from './admin/bank/create';
import EditBank from './admin/bank/edit';

import ViewAdsBanner from './admin/adsbanner';
import CreateAdsBanner from './admin/adsbanner/create';
import EditAdsBanner from './admin/adsbanner/edit';

import ViewOrder from './admin/order';
import DetailOrder from './admin/order/detail';

import ViewUser from './admin/user';

import Cart from './pages/cart/Cart';

import NotFound from './pages/not_found/NotFound';
import EditProfile from './pages/profile/EditProfile';

import axios from 'axios';

import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';
import Checkout from './pages/checkout/Checkout';
import Order from './pages/checkorder/Order';
import Dashboard from './admin/dashboard';
import CategoryAll from './pages/category/Category';
import CategoryProduct from './pages/category/CategoryProduct';


export default function App() {

  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = "http://itrbru.thddns.net:6440/";
  axios.defaults.headers.post['Accept'] = 'application/json';
  axios.defaults.headers.post['Content-Type'] = 'application/json';

  axios.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
  });

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category" element={<CategoryAll />} />
        <Route path="/category/:slug" element={<CategoryProduct />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/detail/:slug" element={<ProductDetail />} />

        <Route path="/" element={<PrivateRoute />}>
          <Route path="/profile" element={<EditProfile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order" element={<Order />} />
        </Route>

        {/* Route สำหรับแอดมิน */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/user" element={<ViewUser />} />
          <Route path="/admin/product" element={<ViewProduct />} />
          <Route path="/admin/product/create" element={<CreateProduct />} />
          <Route path="/admin/product/:id/edit" element={<EditProduct />} />
          <Route path="/admin/category" element={<ViewCategory />} />
          <Route path="/admin/category/create" element={<CreateCategory />} />
          <Route path="/admin/category/:id/edit" element={<EditCategory />} />

          <Route path="/admin/brand" element={<ViewBrand />} />
          <Route path="/admin/brand/create" element={<CreateBrand />} />
          <Route path="/admin/brand/:id/edit" element={<EditBrand />} />

          <Route path="/admin/order" element={<ViewOrder />} />
          <Route path="/admin/order/:id" element={<DetailOrder />} />

          <Route path="/admin/bank" element={<ViewBank />} />
          <Route path="/admin/bank/create" element={<CreateBank />} />
          <Route path="/admin/bank/:id/edit" element={<EditBank />} />

          <Route path="/admin/adsbanner" element={<ViewAdsBanner />} />
          <Route path="/admin/adsbanner/create" element={<CreateAdsBanner />} />
          <Route path="/admin/adsbanner/:id/edit" element={<EditAdsBanner />} />

          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
