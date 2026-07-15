import axios from 'axios';

const productsApiInstance = axios.create({
    baseURL: "/api/products",
    withCredentials: true,
});

const createProduct = async (productData) => {
    try {
        const response = await productsApiInstance.post(`/create`, productData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getSellerProducts = async () => {
    try {
        const response = await productsApiInstance.get(`/seller`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getAllProducts = async () => {
    try {
        const response = await productsApiInstance.get(`/all`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { createProduct, getSellerProducts, getAllProducts };