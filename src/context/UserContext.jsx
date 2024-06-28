import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');


  useEffect(() => {
    fetchUser();
  }, [token]);

  const fetchUser = async () => {
    axios.get('/api/user').then(response => {
      if (response.data.status === 200) {
        setUser(response.data);
        setToken(response.data.token)
        console.log(response.data.user)
      } else if (response.data.status === 400) {
        Swal.fire({
          icon: "error",
          text: response.data.message,
          confirmButtonText: "ตกลง",
          confirmButtonColor: "black",
          focusConfirm: false,
        }).then(() => {
          navigate('/');
        });
      } else if (response.data.status === 401) {
        Swal.fire({
          icon: "warning",
          text: response.data.message,
          confirmButtonText: "ตกลง",
          confirmButtonColor: "black",
          focusConfirm: false,
        }).then(() => {
          navigate('/');
        });
      }
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };
