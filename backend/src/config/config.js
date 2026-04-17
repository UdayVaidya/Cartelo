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

export const config = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
};