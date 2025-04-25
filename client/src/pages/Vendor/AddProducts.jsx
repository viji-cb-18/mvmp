import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addProduct } from "../../services/productServices";
import { getCategory } from "../../services/categoryServices";

const AddProduct = () => {
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    category: "",
    subcategory: "",
    images: [],
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]); 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategory();
        setCategories(res.data);
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const selectedCategory = categories.find(
      (cat) => cat._id === form.category
    );
    setSubcategories(selectedCategory?.subcategories || []);
  }, [form.category, categories]);

  const handleInputChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
  
    if (files.length > 5) {
      toast.warning("You can only upload up to 5 images.");
      return;
    }
  
    setForm((prev) => ({ ...prev, images: files }));
  
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previewUrls);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.category || !form.subcategory) {
      return toast.warning("Please select both category and subcategory.");
    }

    const payload = new FormData();
    payload.append("name", form.name);
    payload.append("description", form.description);
    payload.append("price", form.price);
    payload.append("stockQuantity", form.stockQuantity);
    payload.append("category", form.category);
    payload.append("subcategory", form.subcategory);
    form.images.forEach((img) => payload.append("images", img));

    try {
      await addProduct(payload);
      toast.success("Product added successfully");
      setForm({
        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        category: "",
        subcategory: "",
        images: [],
      });
    } catch (err) {
      console.error("Add Product Error:", err);
      toast.error("Failed to add product");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Product Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Stock Quantity</label>
            <input
              type="number"
              name="stockQuantity"
              value={form.stockQuantity}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {subcategories.length > 0 && (
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Subcategory</label>
            <select
              name="subcategory"
              value={form.subcategory}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub._id} value={sub._id}>{sub.name}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block mb-1 font-semibold text-gray-700">Product Images (max 5)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
          {imagePreviews.length > 0 && (
  <div className="flex gap-4 mt-4 flex-wrap">
    {imagePreviews.map((src, index) => (
      <img
        key={index}
        src={src}
        alt={`Preview ${index}`}
        className="w-24 h-24 object-cover rounded border"
      />
    ))}
  </div>
)}

        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
