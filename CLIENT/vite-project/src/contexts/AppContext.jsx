import axios from "axios";
import React, { createContext, useState } from "react";
import { useEffect } from "react";
import { toast } from 'react-toastify'


export const AppContext = createContext()

export const AppContextProvider = (props) => {

    axios.defaults.withCedentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState(null)

const getAuthState = async () => {
    try {
        const { data } = await axios.get(
            `${backendUrl}/api/user/data`,
            { withCredentials: true }
        );

        if (data.success) {
            setIsLoggedIn(true);
            setUserData(data.userData);
        } else {
            setIsLoggedIn(false);
            setUserData(null);
        }

    } catch (error) {
        // If no token or unauthorized → user is simply logged out (normal case)
        if (error.response?.status === 401) {
            setIsLoggedIn(false);
            setUserData(null);
        } else {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    }
};


   const getUserData = async () => {   
    try {
        const { data } = await axios.get(
            `${backendUrl}/api/user/data`,
            {
                withCredentials: true   //sends cookies
            }
        );

        data.success 
            ? setUserData(data.userData)
            : toast.error(data.message)

    } catch(error) {
        toast.error(error.response?.data?.message || 'An error occurred')
    }
}

    useEffect(()=>{
          getAuthState();
          
    },[])

    const value = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}