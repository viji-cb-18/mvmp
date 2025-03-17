const cloudinary = require("cloudinary").v2;
const multer = require("multer");


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../../uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploadMiddleware = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedFormats.includes(file.mimetype)) {
            return cb(new Error("Only JPG, PNG, and JPEG files are allowed!"), false);
        }
        cb(null, true);
    }
});

module.exports ={ cloudinary, uploadMiddleware} ;