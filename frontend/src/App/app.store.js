import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Features/Auth/state/auth.slice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
    }
});