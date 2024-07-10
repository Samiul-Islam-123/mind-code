import { createContext, useContext, useState } from "react";

const UserDataContext = createContext();

export const UserDataProvider = ({children}) => {
    const [userData, setUserData] = useState({
        user : null,
        project : null
    });

    return (
        <UserDataContext.Provider value={{userData, setUserData}}>
            {children}
        </UserDataContext.Provider>
    )
}

export const useUserData = () => useContext(UserDataContext);