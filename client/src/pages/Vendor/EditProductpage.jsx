import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateProduct } from "../../services/productServices";
import { toast } from "react-toastify";

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    category: "",
  });
  const [existingImages, setExistingImages] = useState([]); 
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(productId);
        const { name, description, price, stockQuantity, category, images } = res.data;
        setForm({
          name,
          description,
          price,
          stockQuantity,
          category: category?._id || category,  
        });
        setExistingImages(images || []);
      } catch (err) {
        toast.error("Failed to load product");
      }
    };
    if (productId) fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.warning("You can only upload up to 5 images.");
      return;
    }
    setNewImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseInt(form.stockQuantity) < 0) {
      toast.error("Stock quantity cannot be negative");
      return;
    }
  

    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
     formData.append("description", form.description.trim());
       formData.append("price", parseFloat(form.price));
     formData.append("stockQuantity", parseInt(form.stockQuantity));
      formData.append("category", form.category);


      newImages.forEach((img) => {
        formData.append("images", img);
      });

      await updateProduct(productId, formData); 
      toast.success("Product updated successfully");
      navigate("/vendor/products");
    } catch (err) {
      console.error("Edit Product Error:", err);
      toast.error("Failed to update product");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Product Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Stock Quantity</label>
            <input
              type="number"
              name="stockQuantity"
              value={form.stockQuantity}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Category</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">Update Product Images (max 5)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
       
          {existingImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Current Images:</p>
              <div className="flex gap-3 flex-wrap">
                {existingImages.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Image ${index}`}
                    className="w-24 h-24 object-cover rounded border"
                  />
                ))}
              </div>
            </div>
          )}

         
          {imagePreviews.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Selected New Images:</p>
              <div className="flex gap-3 flex-wrap">
                {imagePreviews.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Preview ${index}`}
                    className="w-24 h-24 object-cover rounded border"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
