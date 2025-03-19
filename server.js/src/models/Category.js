const mongoose = require("mongoose");
const masterSchema =require("./masterModel");


const categorySchema = new mongoose.Schema({
    ...masterSchema.obj,
    name: { type: String, required: true },
    categoryImage: { type: String },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }]  
    
  }, { timestamps: true }
);

categorySchema.pre("save", function (next) {
    if (this.parentCategory && this.parentCategory.toString() === this._id.toString()) {
        return next(new Error("A category cannot be its own parent"));
    }
    next();
});    

module.exports = mongoose.model("Category", categorySchema);
