import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setToken, setLoading, setError } from "../state/auth.slice";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser, googleAuth } from "../services/auth.service";

export const useAuth = () => {
    const dispatch  = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);
    
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

    return {
        handleRegister,
        handleLogin,
        handleGoogleAuth,
        loading,
        error
    }

}
