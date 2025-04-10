const { default: mongoose } = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");
const multer = require("multer");
const { cloudinary, uploadToCloudinary } = require("../config/cloudinaryconfig");
const Order = require("../models/Order");

/*exports.addProduct = async (req, res) => {
    try {
        const { vendorId, name, description, price, stockQuantity, category, images } = req.body;

        if (!vendorId || !name || !price || !stockQuantity) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const imageUrls = [];
        if (req.files && req.files.length > 0) {
            const uploadedImages = await Promise.all(
                req.files.map(async (file) => {
                    const url = await uploadToCloudinary(file.path);
                    return url;
                })
            );
            imageUrls = uploadedImages;
        }

        const newProduct = new Product({
            vendorId: req.user._id,
            name,
            description,
            price,
            stockQuantity,
            category,
            images: imageUrls,
        });

        await newProduct.save();
        res.status(201).json({ msg: "Product added successfully", product: newProduct });

    } catch (error) {
        res.status(500).json({ msg: "Internal server error", error: error.message });
    }
};*/

exports.addProduct = async (req, res) => {
    try {
      const { name, description, price, stockQuantity, category } = req.body;
  
      if (!name || !price || !category) {
        return res.status(400).json({ msg: "Missing required fields" });
      }
  
      const imageUploads = await Promise.all(
        req.files.map(file => uploadToCloudinary(file.buffer, "products"))
      );
  
      const newProduct = new Product({
        name,
        description,
        price,
        stockQuantity,
        category,
        images: imageUploads, // array of URLs
        vendorId: req.user._id,
      });
  
      await newProduct.save();
  
      res.status(201).json({ msg: "Product added successfully", product: newProduct });
    } catch (err) {
      res.status(500).json({ msg: "Failed to add product", error: err.message });
    }
  };
  

exports.getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || "createdAt";
        const order = req.query.order === "asc" ? 1 : 1;

        const category = req.query.category;
        const minPrice = parseFloat(req.query.minPrice);
        const maxprice = parseFloat(req.query.maxPrice);

        const filter ={ };
        if (category) filter.category = category;
        if(!isNaN(minPrice) && !isNaN(maxprice)) {
            filter.price = { $gte: minPrice, $lte: maxprice };
        }

        const total = await Product.countDocuments(filter);

        const products = await Product.find(filter).sort({ [sortBy]: order }).limit(limit).skip(skip);

        res.status(200).json({ 
            success: true, 
            page, 
            limit,
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            data: products
        });
        
    }catch (error) {
        console.error("Error in getAll Products:", error.message);
        res.status(500).json({ error: "Failed to fetch products"});

    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error(" Error in getProductById:", error.message);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ msg: "Invalid product ID format" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true });
    
        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        

        res.status(200).json({ message: "Product updated successfully", updatedProduct });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(req.params.productId);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        if (req.user.role !== "admin" && req.user._id.toString() !== product.vendorId.toString()) {
            return res.status(403).json({ error: "Access denied! You can only delete your own products" });
        }
        
        await Product.findByIdAndDelete(req.params.productId);
        res.status(200).json({ msg: "Product deleted successfully" });

    } catch (error) {
        console.error("Error in deleteProduct:", error.message);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

exports.uploadProductImage = async (req, res) => {
    try {
        if (!req.file || req.files.length === 0) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const imageUrls = await uploadToCloudinary(req.files.path);
        const { productId } = req.params;
        
         const product = await Product.findByIdAndUpdate(productId, { $push: {images: imageUrls }}, { new: true });
        
        res.staus(200).json({ msg: "Product image uploaded successfully", images: imageUrls });
    } catch (error) {
        res.status(500).json({ error: "Image uploaded failed", details: error.message });
    }
}

exports.getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ msg: "Invalid category ID format" });
        }

        const products = await Product.find({ category: categoryId })
            .populate("category", "name") 
            .populate("vendorId", "name"); 

        if (!products.length) {
            return res.status(404).json({ msg: "No products found for this category" });
        }

        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products by category:", error);
        res.status(500).json({ msg: "Internal Server Error", details: error.message });
    }
};

exports.getProductsByVendor = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const products = await Product.find({ vendorId });

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products", details: error.message });
    }
};

exports.getBestSellingProducts = async (req, res) => {
    try {
     
        const orders = await Order.find().populate("products.productId");

        const productSales = {};
        orders.forEach(order => {
            order.products.forEach(({ productId, quantity }) => {
                if (!productSales[productId]) {
                    productSales[productId] = 0;
                }
                productSales[productId] += quantity;
            });
        });
 
        const sortedProducts = Object.entries(productSales)
            .sort(([, salesA], [, salesB]) => salesB - salesA)
            .slice(0, 10); 

        const bestSellers = await Promise.all(
            sortedProducts.map(async ([productId, totalSold]) => {
                const product = await Product.findById(productId);
                return {
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.images?.[0], 
                    totalSold
                };
            })
        );

        res.status(200).json(bestSellers);
    } catch (error) {
        console.error("Error fetching best-sellers:", error);
        res.status(500).json({ error: "Failed to fetch best-selling products", details: error.message });
    }
};


