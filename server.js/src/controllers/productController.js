const Product = require("../models/Product");


exports.addProduct = async (req, res) => {
    try {
        const { vendorId, name, description, price, stockQuantity, category, images } = req.body;

        // Validation Check
        if (!vendorId || !name || !price || !stockQuantity) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newProduct = new Product({
            vendorId,
            name,
            description,
            price,
            stockQuantity,
            category,
            images
        });

        await newProduct.save();
        res.status(201).json({ msg: "Product added successfully", product: newProduct });

    } catch (error) {
        res.status(500).json({ msg: "Internal server error", error: error.message });
    }
};
/*exports.addProduct = async (req, res) => {
    try {
        const { name, price, description, category } = req.body;

        const newProduct = new Product({
            name,
            price,
            description,
            category
        });

        await newProduct.save();
        res.status(201).json({ msg: "Product added successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ msg: "Internal server error", error: error.message });
    }
};*/

//Get All Products
exports.getAllProducts = async (req, res) => {
    try {
        const products =await Product.find();
        if (products.length === 0) {
            return res.status(404).json({ error: "No products found "});
        }
        res.status(200).json(products);
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


exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        
        await Product.findByIdAndDelete(req.params.productId); // Corrected `productId`
        res.status(200).json({ msg: "Product deleted successfully" });

    } catch (error) {
        console.error("Error in deleteProduct:", error.message);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

