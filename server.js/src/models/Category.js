const mongoose = require("mongoose");
const masterSchema =require("./masterModel");


const categorySchema = new mongoose.Schema({
    ...masterSchema.obj,
    name: { type: String, required: true },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    categoryImage: { type: String }   
    
  }, { timestamps: true }
);

categorySchema.pre("save", function (next) {
    if (this.parentCategory && this.parentCategory.toString() === this._id.toString()) {
        return next(new Error("A category cannot be its own parent"));
    }
    next();
});    

module.exports = mongoose.model("Category", categorySchema);
