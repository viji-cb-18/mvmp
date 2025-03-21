const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const path = require("path");
const fs = require("fs");


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();

const uploadMiddleware = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedFormats.includes(file.mimetype)) {
            return cb(new Error("Only JPG, PNG, and JPEG files are allowed!"), false);
        }
        cb(null, true);
    }
});

const uploadedToCloudinary = async (butter, folder = "profile_images") => {
    try {
        const result = await cloudinary.uploader.upload_stream(
            { folder, resource_type: "image" },
            (error, result) => {
                if (error) throw new Error("cloudinary upload failed");
                return result.secure_url;
            }
            
        ).end(buffer);
        return result;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("Cloudinary upload failed");
    }
};

module.exports ={ cloudinary, uploadMiddleware, uploadedToCloudinary} ;