const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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
  },
});

const uploadToCloudinary = (buffer, folder) => {
  if (!folder) throw new Error("Folder name is required");

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject("Cloudinary upload failed");
        }
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

/*const uploadToCloudinary = (buffer, folder = "categories") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject("Cloudinary upload failed");
        }
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};
*/

module.exports = { cloudinary, uploadMiddleware, uploadToCloudinary };
