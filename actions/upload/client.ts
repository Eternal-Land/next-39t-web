import { generateUploadSignature } from "./actions";
import { UploadFolder } from "./types";

export async function uploadImage(file: File, uploadFolder: UploadFolder) {
    const { timestamp, folder, signature } = await generateUploadSignature(uploadFolder);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("folder", folder);

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData },
    );

    if (!res.ok) {
        throw new Error("Failed to upload image");
    }

    const data: { secure_url: string } = await res.json();
    return data.secure_url;
}
