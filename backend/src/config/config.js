import dotenv from "dotenv";
dotenv.config();

if(!process.env.MONGODB_URI){
    throw new Error("MONGODB_URI is not defined");
}

if(!process.env.PORT){
    throw new Error("PORT is not defined");
}

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not defined");
}

if(!process.env.JWT_EXPIRES_IN){
    throw new Error("JWT_EXPIRES_IN is not defined");
}

if(!process.env.CORS_ORIGIN){
    throw new Error("CORS_ORIGIN is not defined");
}

if(!process.env.GOOGLE_CLIENT_ID){
    throw new Error("GOOGLE_CLIENT_ID is not defined");
}

if(!process.env.GOOGLE_CLIENT_SECRET){
    throw new Error("GOOGLE_CLIENT_SECRET is not defined");
}

if(!process.env.NODE_ENV){
    throw new Error("NODE_ENV is not defined");
}

if(!process.env.IMAGEKIT_PRIVATE_KEY){
    throw new Error("IMAGEKIT_PRIVATE_KEY is not defined");
}

if(!process.env.IMAGEKIT_PUBLIC_KEY){
    throw new Error("IMAGEKIT_PUBLIC_KEY is not defined");
}

if(!process.env.IMAGEKIT_URL_ENDPOINT){
    throw new Error("IMAGEKIT_URL_ENDPOINT is not defined");
}

export const config = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT,
};