import React, { useEffect, useState } from 'react';
import {
  getCategory,
  addParentCategory,
  addSubCategory,
  deleteCategory,
  updateCategory
} from '../../services/categoryServices';
import { toast } from 'react-toastify';

const categoryTypeColors = {
  Main: 'bg-green-100 text-green-800',
  Promo: 'bg-blue-100 text-blue-800',
  Hidden: 'bg-gray-300 text-gray-700'
};

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '', parentCategory: '', image: null });
  const [isSub, setIsSub] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      const res = await getCategory();
      setCategories(res.data);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      toast.warning('Category name is required');
      return;
    }

    const payload = new FormData();
    payload.append('name', formData.name);
    if (formData.image) payload.append('image', formData.image);
    if (isSub) payload.append('parentCategory', formData.parentCategory);

    try {
      if (editMode) {
        await updateCategory(editCategoryId, payload);
        toast.success('Category updated');
      } else {
        if (isSub) {
          await addSubCategory(payload);
          toast.success('Subcategory added');
        } else {
          await addParentCategory(payload);
          toast.success('Parent category added');
        }
      }

      setFormData({ name: '', parentCategory: '', image: null });
      setEditMode(false);
      setEditCategoryId(null);
      setModalVisible(false);
      fetchData();
    } catch (err) {
      toast.error('Failed to save category');
    }
  };

  const handleEditCategory = (category) => {
    setFormData({
      name: category.name,
      parentCategory: category.parentCategory || '',
      image: null
    });
    setIsSub(!!category.parentCategory);
    setEditCategoryId(category._id);
    setEditMode(true);
    setModalVisible(true);
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await deleteCategory(id);
      toast.success('Category deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold">Category Management</h2>
        <input
          type="text"
          placeholder="Search categories..."
          className="border px-3 py-1 rounded w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => setModalVisible(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Category
        </button>
      </div>

      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg relative">
            <h3 className="text-xl font-semibold mb-4">
              {editMode ? 'Edit Category' : 'Add Category'}
            </h3>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input type="radio" checked={!isSub} onChange={() => setIsSub(false)} />
                  Parent
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" checked={isSub} onChange={() => setIsSub(true)} />
                  Subcategory
                </label>
              </div>

              <input
                type="text"
                placeholder="Category Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border px-3 py-2 rounded"
                required
              />

              {isSub && (
                <select
                  className="border px-3 py-2 rounded"
                  value={formData.parentCategory}
                  onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
                  required
                >
                  <option value="">Select Parent Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                className="border p-1 rounded"
              />

              <div className="flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  {editMode ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalVisible(false);
                    setEditMode(false);
                    setFormData({ name: '', parentCategory: '', image: null });
                  }}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => (
          <div key={cat._id} className="bg-white p-4 rounded shadow-sm">
            {cat.categoryImage ? (
              <img
                src={cat.categoryImage}
                alt={cat.name}
                className="w-full h-36 object-cover rounded mb-2"
              />
            ) : (
              <div className="w-full h-36 bg-gray-200 flex items-center justify-center text-gray-500 rounded mb-2">
                No Image
              </div>
            )}

            <div className="flex justify-between items-center mb-1">
              <h4 className="text-lg font-semibold text-gray-800">{cat.name}</h4>
              <span className={`text-xs px-2 py-1 rounded-full ${categoryTypeColors[cat.type || 'Main'] || 'bg-gray-100 text-gray-800'}`}>
                {cat.type || 'Main'}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-2">
              {cat.subcategories?.length || 0} subcategories
            </p>

            {cat.subcategories?.length > 0 && (
              <ul className="space-y-2 text-sm text-gray-700">
                {cat.subcategories.map((sub) => (
                  <li key={sub._id} className="flex items-center gap-2">
                    {sub.categoryImage ? (
                      <img src={sub.categoryImage} alt={sub.name} className="w-8 h-8 object-cover rounded" />
                    ) : (
                      <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center text-xs">No</div>
                    )}
                    {sub.name}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEditCategory(cat)}
                className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteCategory(cat._id)}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
