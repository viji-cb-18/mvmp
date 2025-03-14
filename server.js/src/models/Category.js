const mongoose = require("mongoose");
const masterSchema =require("./masterModel");


const categorySchema = new mongoose.Schema({
    ...masterSchema.obj,
    name: { type: String, required: true },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    categoryImage: { type: String }
    
});

module.exports = mongoose.model("Category", categorySchema);
