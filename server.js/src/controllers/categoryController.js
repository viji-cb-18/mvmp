const Category = require("../models/Category");
const mongoose = require("mongoose");
const { uploadToCloudinary } = require("../config/cloudinaryconfig");

exports.addParentCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const categoryImage = "";

        if (!name) {
            return res.status(400).json({ msg: "Category name is required" });
        }

        if (req.file) {
            categoryImage = await uploadToCloudinary(req.file.path);
        }

        const parentCategory = new Category({ name, parentCategory: null, categoryImage });
        await parentCategory.save();

        res.status(201).json({ msg: "Category added successfully", category: parentCategory });
    } catch (error) {
        res.status(500).json({ msg: "Failed to create category", details: error.message });
    }
};

exports.addSubCategory = async (req, res) => {
    try {
        const { name, parentCategory} = req.body;
        const categoryImage = "";

        if (!name || ! parentCategory) {
            return res.status(400).json({ msg: "Subcategory name  and parent are required" });
        }

        const parentCat = await Category.findById(parentCategory);
        if (!parentCat) {
            return res.status(400).json({ msg: "Invalid parentcategory ID"});
        }

        if (req.file) {
            categoryImage = await uploadToCloudinary(req.file.path);
        }

        const newCategory = new Category({ name, parentCategory, categoryImage });
        await newCategory.save();

        const categoryWithParent = await Category.findById(newCategory._id).populate("parentCategory", "name");

        res.status(201).json({ msg: "Category added successfully", category: parentCategory });
    } catch (error) {
        res.status(500).json({ msg: "Failed to create category", details: error.message });
    }
};

exports.getCategory = async (req, res) => {
    try {
        const categories = await Category.find({ parentCategory: null }).populate("subcategories", "name categoryImage");

        if (!categories.length) {
            return res.status(404).json({ msg: "No categories found" });
        }

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ msg: "Failed to fetch categories", details: error.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.categoryId)
        .populate("parentCategory", "name")
        .populate("subcategories", "name categoryImage");

        if (!category) {
            return res.status(404).json({ msg: "Category not found" });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ msg: "Internal Server Error", details: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {

        const updateData = { ...req.body };
       
        if (req.file) {
            updateData.categoryImage = await uploadToCloudinary(req.file.path);
        }

        const updatedCategory = await Category.findByIdAndUpdate(req.params.categoryId, req.body, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ msg: "Category not found" });
        }

        res.status(200).json({ msg: "Category updated successfully", updatedCategory });
    } catch (error) {
        res.status(500).json({ msg: "Failed to update category", details: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ msg: "Invalid category ID format" });
        }

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ msg: "Category not found" });
        }

        const subCategories = await Category.find({ parentCategory: categoryId });
    

        if (subCategories.length > 0) {
            await Category.deleteMany({ parentCategory: category });
        }

        await Category.findByIdAndDelete(categoryId);

        res.status(200).json({ msg: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Failed to delete category", details: error.message });
    }
};

exports.uploadCategoryImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const category = await Category.findByIdAndUpdate(req.params.categoryId, { categoryImage: req.file.path}, { new: true });

        res.staus(200).json({ msg: "Category image uploaded successfully", categoryr });
    } catch (error) {
        res.status(500).json({ error: "Image uploaded failed", details: error.message });
    }
}