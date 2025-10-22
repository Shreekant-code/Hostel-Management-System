import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true, 
  });

 
  useEffect(() => {
    const storedAccess = localStorage.getItem("accessToken");
    if (storedAccess) setAccessToken(storedAccess);
    setLoading(false);
  }, []);

  const setToken = (token) => {
    setAccessToken(token);
    localStorage.setItem("accessToken", token);
  };

  const removeTokens = () => {
    setAccessToken(null);
    localStorage.removeItem("accessToken");
  };

 
  axiosInstance.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Handle expired tokens automatically
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          // refresh token request (cookie will be sent automatically)
          const res = await axiosInstance.post("/admin/refresh");
          const newAccessToken = res.data.accessToken;
          setToken(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest); 
        } catch (err) {
          console.error("Token refresh failed", err);
          removeTokens();
        }
      }

      return Promise.reject(error);
    }
  );

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setToken,
        removeTokens,
        axiosInstance,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
