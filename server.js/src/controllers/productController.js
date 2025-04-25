const { default: mongoose } = require("mongoose");
const multer = require("multer");
const { cloudinary, uploadToCloudinary } = require("../config/cloudinaryconfig");
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");

  exports.addProduct = async (req, res) => {
    try {
      const { name, description, price, stockQuantity, category, subcategory } = req.body;
  
      console.log("REQ BODY:", req.body);
      console.log("REQ FILES LENGTH:", req.files?.length);
  
      if (!name || !price || !category || !subcategory || !stockQuantity) {
        return res.status(400).json({ msg: "Missing required fields" });
      }
  
      const parentCategory = await Category.findById(category);
      if (!parentCategory) {
        return res.status(404).json({ msg: "Parent category not found" });
      }
  
      if (
        !Array.isArray(parentCategory.subcategories) ||
        !parentCategory.subcategories.includes(subcategory)
      ) {
        return res.status(400).json({ msg: "Subcategory does not belong to selected category" });
      }
  
      let imageUploads = [];
      if (req.files && req.files.length > 0) {
        const uploads = await Promise.all(
          req.files.map((file) => uploadToCloudinary(file.buffer, "products"))
        );
        imageUploads = uploads.map((upload) => upload.secure_url || upload.url || upload);
      } else {
        return res.status(400).json({ msg: "At least one product image is required." });
      }
  
      console.log("🖼️ Uploaded Images:", imageUploads);
  
      const newProduct = new Product({
        name,
        description,
        price,
        stockQuantity,
        category,
        subcategory,
        images: imageUploads,
        vendor: req.user._id, 
      });
  
      await newProduct.save();
  
      res.status(201).json({ msg: "Product added successfully", product: newProduct });
    } catch (err) {
      console.error("Add Product Error:", err);
      res.status(500).json({ msg: "Failed to add product", error: err.message || err });
    }
  };
 
/*
  exports.getAllProducts = async (req, res) => {
    try {
      const filter = {};

      if (req.query.vendorId) {
        filter.vendorId = req.query.vendorId;
      }
  
      if (req.query.subcategory) {
        filter.subcategory = req.query.subcategory;
      } 

      else if (req.query.category) {
        const parent = await Category.findById(req.query.category).populate("subcategories", "_id");
      
        if (parent) {
          const subIds = parent.subcategories.map((s) => s._id);
          filter.category = { $in: [req.query.category, ...subIds] };
        } else {
          return res.status(404).json({ error: "Parent category not found" });
        }
      }
      
      if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, "i");
        filter.name = searchRegex;
      }

      if (req.query.recent === "true") {
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
        filter.createdAt = { $gte: tenDaysAgo };
      }
      

      const products = await Product.find(filter)
        .populate("vendor", "storeName storeLogo")
        .populate("category", "name")
        .populate("subcategory", "name")
        .sort({ createdAt: -1 })
      
  
      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (err) {
      console.error("Error in getAllProducts:", err);
      res.status(500).json({ error: "Server Error", details: err.message });

    }
  };
  
*/
exports.getAllProducts = async (req, res) => {
  try {
    const filter = {};

    if (req.query.vendorId) {
      filter.vendorId = req.query.vendorId;
    }

    if (req.query.subcategory) {
      filter.subcategory = req.query.subcategory;
    } 
    else if (req.query.category) {
      const parent = await Category.findById(req.query.category).populate("subcategories", "_id");

      if (parent) {
        const subIds = parent.subcategories.map((s) => s._id);
        filter.category = { $in: [req.query.category, ...subIds] };
      } else {
        return res.status(404).json({ error: "Parent category not found" });
      }
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      filter.name = searchRegex;
    }

    if (req.query.recent === "true") {
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
      filter.createdAt = { $gte: tenDaysAgo };
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate("vendor", "storeName storeLogo")
      .populate("category", "name")
      .populate("subcategory", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      data: products,
    });
  } catch (err) {
    console.error("Error in getAllProducts:", err);
    res.status(500).json({ error: "Server Error", details: err.message });
  }
};




  exports.getAllReviews = async (req, res) => {
    try {
      const { productId } = req.query;
  
      const filter = productId ? { productId } : {};
  
      const reviews = await Review.find(filter).sort({ createdAt: -1 });
  
      res.status(200).json({ data: reviews });
    } catch (err) {
      console.error("Failed to get reviews:", err);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  };
  

  exports.updateProduct = async (req, res) => {
    try {
      const { productId } = req.params;
  
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ msg: "Invalid product ID format" });
      }
  
      let product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ msg: "Product not found" });
      }

      const stockQuantity = req.body.stockQuantity !== undefined
      ? Number(req.body.stockQuantity)
      : product.stockQuantity;
  
      let newImages = [];
      if (req.files && req.files.length > 0) {
        const uploads = await Promise.all(
          req.files.map((file) => uploadToCloudinary(file.buffer, "products"))
        );
        newImages = uploads.map((upload) => upload.secure_url || upload.url || upload);
      }
  
      const updateData = {
        ...req.body,
        stockQuantity,
        images: newImages.length > 0 ? newImages : product.images, 
      };
  
      const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });
  
      res.status(200).json({ message: "Product updated successfully", updatedProduct });
    } catch (error) {
      console.error("Update Product Error:", error);
      res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  };

  exports.deleteProduct = async (req, res) => {
    try {
      const { productId } = req.params;
  
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      if (
        req.user.role !== "admin" &&
        req.user._id.toString() !== product.vendor.toString()
      ) {
        return res
          .status(403)
          .json({ error: "Access denied! You can only delete your own products." });
      }
  
      await Product.findByIdAndDelete(productId);
  
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

    const parentCategory = await Category.findById(categoryId).populate("subcategories", "_id");
    const subcategoryIds = parentCategory?.subcategories?.map((sub) => sub._id) || [];

    const products = await Product.find({
      $or: [
        { category: categoryId },
        { subcategory: { $in: subcategoryIds } }
      ]
    })
      .populate("category", "name")
      .populate("subcategory", "name")
      .populate("vendorId", "storeName");

    if (!products.length) {
      return res.status(404).json({ msg: "No products found for this category" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ msg: "Internal Server Error", details: error.message });
  }
};


/*exports.getProductsByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).json({ msg: "Invalid vendor ID format" });
    }

    const products = await Product.find({ vendor: vendorId })
      .populate("category", "name")
      .populate("subcategory", "name");

      res.status(200).json({ data: products });
  } catch (error) {
    console.error("Error fetching vendor products:", error);
    res.status(500).json({
      error: "Failed to fetch products",
      details: error.message,
    });
  }
};*/

exports.getProductsByVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).json({ msg: "Invalid vendor ID format" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { vendor: vendorId };

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate("category", "name")
      .populate("subcategory", "name")
      .sort({ createdAt: -1 }) // Optional: newest first
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching vendor products:", error);
    res.status(500).json({
      error: "Failed to fetch products",
      details: error.message,
    });
  }
};


  
  exports.getBestSellingProducts = async (req, res) => {
    try {
      const orders = await Order.find().populate("products.productId");
      const productSales = {};
  
      orders.forEach(order => {
        order.products.forEach(({ productId, quantity }) => {
          if (productId && productId._id) {
            const id = productId._id.toString();
            if (!productSales[id]) {
              productSales[id] = { totalSold: 0, product: productId };
            }
            productSales[id].totalSold += quantity;
          }
        });
      });
  
      const sorted = Object.entries(productSales)
        .sort((a, b) => b[1].totalSold - a[1].totalSold)
        .slice(0, 10);
  
      const bestSellers = sorted.map(([id, { product, totalSold }]) => ({
        ...product.toObject(), 
        totalSold
      }));
  
      res.status(200).json(bestSellers);
    } catch (error) {
      console.error("Error fetching best-selling products:", error);
      res.status(500).json({
        error: "Failed to fetch best-selling products",
        details: error.message
      });
    }
  };
  

exports.getProductById = async (req, res) => {
  try {
   const productId = req.params.id;
   if (!mongoose.Types.ObjectId.isValid(productId)) {
     return res.status(400).json({ msg: "Invalid product ID format" });
   }   

    const product = await Product.findById(productId)
      .populate("category", "name")
      .populate("subcategory", "name")
      .populate("vendor");

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch product", error: error.message });
  }
};
