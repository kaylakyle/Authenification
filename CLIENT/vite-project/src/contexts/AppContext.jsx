import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // Axios default config
  
  axios.defaults.withCredentials = true;

  //  Get Auth State (on app load)
  const getAuthState = async () => {
  try {
    const { data } = await axios.get(`${backendUrl}/api/user/data`);
    if (data.success) {
      setIsLoggedIn(true);
      setUserData(data.userData);
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
  } catch (error) {
    // Ignore 401 since it means user is logged out
    if (error.response?.status === 401) {
      setIsLoggedIn(false);
      setUserData(null);
    } else {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  }
};

  // Get fresh user data

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true,
      });

      if (data.success) {
        setUserData(data.userData);
        setIsLoggedIn(true);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setIsLoggedIn(false);
        setUserData(null);
      } else {
        toast.error(error.response?.data?.message || "Failed to fetch user data");
      }
    }
  };

  //  Logout user
  const logout = async () => {
    try {
      await axios.post(
        `${backendUrl}/api/auth/logout`,
        {}, // empty POST body
        { withCredentials: true } // send cookies
      );

      setIsLoggedIn(false);
      setUserData(null);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };
  //  Check auth on app load
  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    getAuthState,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};