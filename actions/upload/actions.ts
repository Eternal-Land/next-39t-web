"use server"

import { UploadFolder } from "./types";
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function generateUploadSignature(uploadFolder: UploadFolder) {
    const secret = process.env.CLOUDINARY_API_SECRET;

    if (!secret) {
        throw new Error("CLOUDINARY_API_SECRET is not set");
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "39t-landing-page/" + uploadFolder;
    const signature = cloudinary.utils.api_sign_request({
        timestamp,
        folder
    }, secret);

    return { timestamp, folder, signature };
}