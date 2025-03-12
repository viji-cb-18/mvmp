const Category = require(",,/models/Category");

exports.addCategory = async (req, res) => {
    try {
        const { name, parentCategory } = req.body;

        if (!name) {
            return res.status(400).json({ msg: "Category name is required" });
        }

        const newCategory = new Category({ name, parentCategory });
        await newCategory.save();

        res.status(201).json({ msg: "Category added successfully", category: newCategory });
    } catch (error) {
        res.status(500).json({ msg: "Failed to create category", details: error.message });
    }
};

exports.getCategory = async (req, res) => {
    try {
        const categories = await Category.find().populate("parentCategory", "name");

        if (categories.length === 0) {
            return res.status(404).json({ msg: "No categories found" });
        }

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ msg: "Failed to fetch categories", details: error.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.categoryId).populate("parentCategory", "name");

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
        const deletedCategory = await Category.findByIdAndDelete(req.params.categoryId);

        if (!deletedCategory) {
            return res.status(404).json({ msg: "Category not found" });
        }

        res.status(200).json({ msg: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Failed to delete category", details: error.message });
    }
};