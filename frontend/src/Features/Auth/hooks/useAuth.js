import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setToken, setLoading, setError, setInitialized, logout } from "../state/auth.slice";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser, getMe, googleAuth, logoutUser as logoutUserAPI } from "../services/auth.service";

export const useAuth = () => {
    const dispatch  = useDispatch();
    const { loading, error, user, isAuthenticated, isInitialized } = useSelector((state) => state.auth);

    async function handleRegister({email,contact,password,fullName,isSeller = false}){
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
        
            const data = await registerUser({ email, contact, password, fullName, isSeller })
            if(data.success){
                return data;
            }
        }catch(error){
            dispatch(setError(error.message))
        }finally{
            dispatch(setLoading(false))
        }
        return null;
    }

    async function handleLogin({email,password}){
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
        
            const data = await loginUser({ email, password })
            if(data.success){
                dispatch(setUser(data.user))
                dispatch(setToken(data.token))
                return data;
            }
        }catch(error){
            dispatch(setError(error.message))
        }finally{
            dispatch(setLoading(false))
        }
        return null;
    }

    function handleGoogleAuth() {
        googleAuth();
    }

    async function handleLogout() {
        try {
            dispatch(setLoading(true));
            await logoutUserAPI();
            dispatch(logout());
        } catch(error) {
            console.error("Logout failed:", error);
        } finally {
            dispatch(setLoading(false));
        }
    }

    return {
        handleRegister,
        handleLogin,
        handleLogout,
        handleGoogleAuth,
        loading,
        error,
        user,
        isAuthenticated,
    }

}

