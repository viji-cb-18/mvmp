const Category = require("../models/Category");
const mongoose = require("mongoose");
const { uploadToCloudinary } = require("../config/cloudinaryconfig");

exports.addParentCategory = async (req, res) => {
  try {
    console.log("[addParentCategory] Called");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    let categoryImage = null;

    if (!req.body.name) {
      return res.status(400).json({ msg: "Category name is required" });
    }

    if (req.file) {
  
      categoryImage = await uploadToCloudinary(req.file.buffer, "categories" );
      console.log("Cloudinary upload successful:", categoryImage);
    } else {
      console.log(" No image file received");
    }

    const parentCategory = new Category({
      name: req.body.name,
      parentCategory: null,
      categoryImage,
    });

    await parentCategory.save();

    res.status(201).json({ msg: "Category added successfully", category: parentCategory });
  } catch (error) {
    console.error("Error in addParentCategory:", error);
    res.status(500).json({
      msg: "Failed to create category",
      error: error.message,
      stack: error.stack,
    });
  }
};


exports.addSubCategory = async (req, res) => {
    try {
      console.log("[addSubCategory] Called");
      console.log("req.body:", req.body);
      console.log("req.file:", req.file);
  
      let categoryImage = null;
      const { name, parentCategory } = req.body;
  
      if (!name || !parentCategory) {
        return res.status(400).json({ msg: "Subcategory name and parent category are required" });
      }
  
      const parentCat = await Category.findById(parentCategory);
      if (!parentCat) {
        return res.status(400).json({ msg: "Invalid parent category ID" });
      }
  
      if (req.file) {
        console.log("Uploading subcategory image...");
        categoryImage = await uploadToCloudinary(req.file.buffer); 
        console.log("Image uploaded:", categoryImage);
      }
  
      const newCategory = new Category({ name, parentCategory, categoryImage });
      await newCategory.save();
  
      parentCat.subcategories.push(newCategory._id);
      await parentCat.save();
  
      res.status(201).json({ msg: "Subcategory added successfully", category: newCategory });
    } catch (error) {
      console.error("Error in addSubCategory:", error);
      res.status(500).json({ msg: "Failed to create subcategory", error: error.message });
    }
  };

  exports.getAllFlatCategories = async (req, res) => {
    try {
      const categories = await Category.find().select("name _id parentCategory categoryImage");
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ msg: "Failed to fetch all categories", error: error.message });
    }
  };
  

  exports.getCategory = async (req, res) => {
    try {
      const categories = await Category.find({ parentCategory: null })
        .populate("subcategories", "name categoryImage");
  
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
      const imageUrl = await uploadToCloudinary(req.file.buffer); 
      updateData.categoryImage = imageUrl;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.categoryId,
      updateData, 
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ msg: 'Category not found' });
    }

    res.status(200).json({
      msg: 'Category updated successfully',
      updatedCategory,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ msg: 'Failed to update category', details: error.message });
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

        res.staus(200).json({ msg: "Category image uploaded successfully", category });
    } catch (error) {
        res.status(500).json({ error: "Image uploaded failed", details: error.message });
    }
}