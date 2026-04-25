import ImageKit from "imagekit";
import { config } from "../config/config.js";

const client = new ImageKit({
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
    publicKey: config.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
});

/**
 * Uploads a file buffer to ImageKit storage.
 * @param {Buffer} buffer - File buffer from multer memoryStorage
 * @param {string} fileName - Original file name
 * @param {string} [folder="Cartelo"] - Target folder in ImageKit
 * @returns {Promise<{ url: string }>} Object with the public URL
 */
export const uploadFile = async (buffer, fileName, folder = "Cartelo") => {
    const result = await client.upload({
        file: buffer,
        fileName: fileName,
        folder: folder,
    });

    return { url: result.url };
};
