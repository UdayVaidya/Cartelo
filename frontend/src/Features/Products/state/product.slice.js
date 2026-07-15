import {createSlice} from "@reduxjs/toolkit";


const initialState = {
    products: [],
    isLoading: false,
    error: null,
}

const productSlice = createSlice({
    name:"products",
    initialState,
    reducers:{
        setProducts: (state, action) => {
            state.products = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    }
});

export const {setProducts,setLoading,setError} = productSlice.actions;

export default productSlice.reducer;