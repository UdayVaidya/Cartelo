import Router from "express";
import { createProduct, getSellerProducts,getAllProducts } from "../controllers/product.controller.js";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import { productValidator } from "../validators/product.validator.js";
import { upload } from "../middlewares/multer.middleware.js";

const productRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API for managing seller products
 */

/**
 * @swagger
 * /api/products/create-product:
 *   post:
 *     summary: Creates a new product
 *     description: Seller can create a product. Max 7 images allowed.
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - priceAmount
 *               - priceCurrency
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priceAmount:
 *                 type: number
 *               priceCurrency:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
productRouter.post("/create-product", authenticateSeller, upload.array("images", 7), productValidator, createProduct);

/**
 * @swagger
 * /api/products/seller:
 *   get:
 *     summary: Get all products for the logged-in seller
 *     description: Returns a list of products associated with the currently authenticated seller.
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Seller products fetched successfully
 *       401:
 *         description: Unauthorized
 */
productRouter.get("/seller", authenticateSeller, getSellerProducts);


/**
 * @swagger
 * /api/products/all:
 *   get:
 *     summary: Get all products from all sellers
 *     description: Retrieves all products available across all sellers.
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: All products fetched successfully
 *       401:
 *         description: Unauthorized
 */

productRouter.get("/",getAllProducts);

export default productRouter;
