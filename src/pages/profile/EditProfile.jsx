import React, { useContext, useEffect, useState } from 'react';

import Layout from '../../components/Layouts/Layout';
import Button from '../../components/Button';
import { UpdateProfileInformation } from './partials/UpdateProfileInformation';
import { UpdatePassword } from './partials/UpdatePassword';
import { PiPasswordThin, PiUserThin } from 'react-icons/pi';
export default function EditProfile() {

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
      <div className="w-[90%] md:w-[60%] mx-auto flex flex-col gap-4 border p-4 rounded-lg">

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
