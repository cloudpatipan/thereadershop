import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import CategoryList from './CategoryList';
export default function CategoryAll() {

    document.title = "ประเภทสินค้า";

    return (
        <Layout>
            <CategoryList/>
        </Layout>
    )
}
