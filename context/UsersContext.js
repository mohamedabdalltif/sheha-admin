import React, {createContext, useState} from 'react';

export const UsersContext = createContext();

const UsersContextPrivider = ({children}) => {
  const [studentData, setStudentsData] = useState([]);
  const [adminData, setAdminData] = useState({});

  return (
    <UsersContext.Provider
      value={{studentData, setStudentsData, adminData, setAdminData}}>
      {children}
    </UsersContext.Provider>
  );
};

export default UsersContextPrivider;
