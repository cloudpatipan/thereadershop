import React, { useContext, useEffect, useState } from 'react';

import UpdateProfileInformation from './partials/UpdateProfileInformation'
import UpdatePassword from './partials/UpdatePassword'

import Layout from '../../components/Layouts/Layout';
export default function EditProfile() {
  
  document.title = "โปรไฟล์";
  return (
    <Layout>
        <div className="w-[30rem] mx-auto border rounded-lg p-4">
        <div>
        <UpdateProfileInformation/>
        </div>
    
        <div className="mt-2">
        <UpdatePassword/>
        </div>
        </div>

    </Layout>
  )
}
