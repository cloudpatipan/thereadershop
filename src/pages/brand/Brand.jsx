import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layouts/Layout';
import BrandList from './BrandList';

export default function BrandAll() {

    document.title = "แบรนด์หนังสือ";

    return (
        <Layout>
            <BrandList/>
        </Layout>
    )
}
