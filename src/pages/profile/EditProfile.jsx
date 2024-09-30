import React, { useContext, useEffect, useState } from 'react';

import Layout from '../../components/Layouts/Layout';
import Button from '../../components/Button';
import { UpdateProfileInformation } from './partials/UpdateProfileInformation';
import { UpdatePassword } from './partials/UpdatePassword';
import { PiPasswordThin, PiUserThin } from 'react-icons/pi';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function EditProfile() {

  const navigate = useNavigate('');

  const { token } = useContext(UserContext);

  document.title = "โปรไฟล์";

  const [tab, setTab] = useState(true);

  const toggleTabInformation = () => {
    setTab(true);
  };

  const toggleTabInPassword = () => {
    setTab(false);
  };

  

  return (
    <Layout>
      <div className="w-full md:w-1/2 mx-auto flex flex-col gap-4 border p-4 rounded-lg">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button icon={<PiUserThin size={25} />} name={'ข้อมูลผู้ใช้'} condition={tab === true} onClick={toggleTabInformation} />

          <Button icon={<PiPasswordThin size={25} />} name={'รหัสผ่าน'} condition={tab === false} onClick={toggleTabInPassword} />
        </div>

        <div>
          {tab === true ? (
            <UpdateProfileInformation />
          ) : tab === false && (
            <UpdatePassword />
          )}
        </div>

      </div>

    </Layout>
  )
}
