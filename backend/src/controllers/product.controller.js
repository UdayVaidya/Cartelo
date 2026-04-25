import productModel from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadFile } from "../services/storage.service.js";

export const createProduct = async (req, res, next) => {
  try {
    const { title, description, priceAmount, priceCurrency } = req.body;
    const seller = req.user;

    const images = await Promise.all(req.files.map(async (file) => {
        return await uploadFile(file.buffer, file.originalname);
    }));

    const product = await productModel.create({
        title,
        description,
        price: {
            amount: priceAmount,
            currency: priceCurrency || "INR"
        },
        images,
        seller: seller._id
    })

    return res
      .status(201)
      .json(new ApiResponse(201, product, "Product created successfully"));
  } catch (error) {
    return next(new ApiError(500, error.message || "Error creating product"));
  }
};


export const getSellerProducts = async (req, res, next) => {
  try {
    const id = req.user?._id;

    if (id) {
      const products = await productModel.find({ seller: id });

      return res
        .status(200)
        .json(new ApiResponse(200, products, "Seller products fetched successfully"));
    }

    const products = await productModel.find();
    return res
      .status(200)
      .json(new ApiResponse(200, products, "All products fetched successfully"));
  } catch (error) {
    return next(new ApiError(500, error.message || "Error fetching products"));
  }
};

export const getAllProducts = async(req,res,next) => {
  try {
    
    const products = await productModel.find();

    return res
      .status(200)
      .json(new ApiResponse(200, products, "All products fetched successfully"));
  } catch (error) {
    return next(new ApiError(500, error.message || "Error fetching products"));
  }
}