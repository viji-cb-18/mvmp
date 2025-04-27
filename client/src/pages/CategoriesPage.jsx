/*import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCategory } from "../services/categoryServices";
import { getAllProducts } from "../services/productServices";
import { addToCart, getCartItems } from "../services/cartServices";
import { useDispatch } from "react-redux";
import { setCart } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import { FaShoppingCart, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { getReviewById } from "../services/reviewServices";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [productRatings, setProductRatings] = useState({});
  const [reviewCounts, setReviewCounts] = useState({});
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedCategory = searchParams.get("category") || null;
  const selectedSubcategory = searchParams.get("subcategory") || null;
  const searchQuery = searchParams.get("search")?.toLowerCase() || null;
  const shouldFetchAll = !selectedCategory && !searchQuery;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          getCategory(),
          getAllProducts({
            category: selectedCategory,
            subcategory: selectedSubcategory,
            search: searchQuery,
          }),
        ]);
      
        setCategories(catRes.data);

        let productList = Array.isArray(prodRes?.data) ? prodRes.data : prodRes;
        
        if (searchQuery) {
          productList = productList.filter((product) =>
            product.name?.toLowerCase().includes(searchQuery) ||
            product.category?.name?.toLowerCase().includes(searchQuery) ||
            product.subcategory?.name?.toLowerCase().includes(searchQuery)
          );
        } 

        const uniqueVendors = [
          ...new Map(productList.map((p) => [p.vendor._id, p.vendor])).values(),
        ];
        setVendors(uniqueVendors);

        if (selectedVendor) {
          productList = productList.filter((p) => p.vendor._id === selectedVendor);
        }

        productList = productList.filter(
          (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
        );

        if (sortBy === "priceLowToHigh") {
          productList.sort((a, b) => a.price - b.price);
        } else if (sortBy === "priceHighToLow") {
          productList.sort((a, b) => b.price - a.price);
        } else if (sortBy === "topRated") {
          productList.sort((a, b) => b.averageRating - a.averageRating);
        }

        setProducts(productList);

        if (prodRes?.totalPages) setTotalPages(prodRes.totalPages);


        const ratingsMap = {};
        const countMap = {};

        await Promise.all(
          productList.map(async (product) => {
            try {
              const res = await getReviewById(product._id);
              const reviews = res.data?.data || [];
              const total = reviews.reduce((sum, r) => sum + r.rating, 0);
              ratingsMap[product._id] = reviews.length ? total / reviews.length : 0;
              countMap[product._id] = reviews.length;
            } catch {
              ratingsMap[product._id] = 0;
              countMap[product._id] = 0;
            }
          })
        );

        setProductRatings(ratingsMap);
        setReviewCounts(countMap);
      } catch (err) {
        console.error("Error loading data:", err);
        setProducts([]);
      }
    };

    fetchData();
  }, [selectedCategory, selectedSubcategory, searchQuery, sortBy, priceRange, selectedVendor]);

  const handleCategoryClick = (categoryId) => {
    navigate(`/categories?category=${categoryId}`);
  };

  const handleSubcategoryClick = (catId, subId) => {
    navigate(`/categories?category=${catId}&subcategory=${subId}`);
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      const res = await getCartItems();
      console.log("Cart items from server:", res.data);
      dispatch(setCart(res.data));
      toast.success("Added to cart!");
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  const renderStars = (rating = 0) => {
    const stars = [];
    const full = Math.floor(rating);
    const hasHalf = rating - full >= 0.5;

    for (let i = 0; i < full; i++) stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    if (hasHalf) stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    for (let i = stars.length; i < 5; i++) stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    return stars;
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {!selectedCategory && !searchQuery && (
        <>
          <h2 className="text-2xl font-bold mb-6 text-center">All Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categories.map((cat) => (
              <div
                key={cat._id}
                onClick={() => handleCategoryClick(cat._id)}
                className="bg-white dark:bg-gray-800 shadow rounded p-4 flex flex-col items-center hover:shadow-lg transition cursor-pointer"
              >
                {cat.image && (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-24 w-24 object-contain mb-3"
                  />
                )}
                <p className="text-center font-medium text-sm text-gray-800 dark:text-white">
                  {cat.name}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {(selectedCategory || shouldFetchAll) && (
        <>
          <div className="flex justify-between items-center mt-6 mb-4">
            <h2 className="text-xl font-bold capitalize">Products</h2>
            {selectedCategory && (
              <button
                onClick={() => navigate("/categories")}
                className="text-[#3ED6B5] hover:underline"
              >
                Back to All Categories
              </button>
            )}
          </div>

          {selectedCategory &&
            categories.find((c) => c._id === selectedCategory)?.subcategories?.length > 0 && (
              <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                {categories
                  .find((c) => c._id === selectedCategory)
                  .subcategories.map((sub) => (
                    <button
                      key={sub._id}
                      onClick={() => handleSubcategoryClick(selectedCategory, sub._id)}
                      className={`px-4 py-1 rounded border ${
                        selectedSubcategory === sub._id.toString()
                          ? "bg-[#3ED6B5] text-white border-transparent"
                          : "border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
              </div>
            )}

          <div className="flex flex-wrap gap-4 items-center mb-6">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border px-3 py-1 rounded"
            >
              <option value="default">Sort by</option>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="priceHighToLow">Price: High to Low</option>
              <option value="topRated">Top Rated</option>
            </select>

            <select
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value)}
              className="border px-3 py-1 rounded"
            >
              <option value="">All Vendors</option>
              {vendors.map((v) => (
                <option key={v._id} value={v._id}>{v.storeName}</option>
              ))}
            </select>

            <div className="flex gap-2 items-center">
              <label className="text-sm">Price:</label>
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                className="border px-2 py-1 w-20 rounded"
              />
              <span className="mx-1">-</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                className="border px-2 py-1 w-20 rounded"
              />
            </div>
          </div>

          {!Array.isArray(products) ? (
            <p className="text-red-600">⚠️ Product list is invalid.</p>
          ) : products.length === 0 ? (
            <p>No products found for this category.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white shadow rounded p-4 relative hover:shadow-lg transition cursor-pointer"
                >
                  <div
                    key={product._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                    role="button"
                    tabIndex={0}
                    className="bg-white shadow rounded p-4 relative hover:shadow-lg transition cursor-pointer"
                  >
                    <img
                      src={product.images?.[0] || "https://via.placeholder.com/150"}
                      alt={product.name || "Product"}
                      className="h-32 w-full object-contain mb-2"
                    />
                    <h3 className="font-semibold text-sm mb-1">
                      {product.name || "Unnamed Product"}
                    </h3>
                    <div className="flex items-center gap-1 text-xs mb-1">
                      {renderStars(productRatings[product._id] || 0)}
                      <span className="text-gray-500">({reviewCounts[product._id] || 0})</span>
                    </div>
                    <p className="text-[#3ED6B5] font-bold text-sm">
                      ${product.price}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    className="absolute top-2 right-2 bg-[#3ED6B5] text-white p-1 rounded-full hover:bg-[#32bfa1]"
                    title="Add to Cart"
                  >
                    <FaShoppingCart size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

        </>
      )}
    </div>
  );
};

export default CategoriesPage;
*/

import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCategory } from "../services/categoryServices";
import { getAllProducts } from "../services/productServices";
import { addToCart, getCartItems } from "../services/cartServices";
import { useDispatch } from "react-redux";
import { setCart } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import { FaShoppingCart, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { getReviewById } from "../services/reviewServices";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [productRatings, setProductRatings] = useState({});
  const [reviewCounts, setReviewCounts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || null;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedCategory = searchParams.get("category") || null;
  const selectedSubcategory = searchParams.get("subcategory") || null;
  //const searchQuery = searchParams.get("search")?.toLowerCase() || null;
  const shouldFetchAll = !selectedCategory && !searchQuery;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          getCategory(),
          getAllProducts({
            category: selectedCategory,
            subcategory: selectedSubcategory,
            search: searchQuery,
            page: currentPage,
            limit,
          }),
        ]);

        console.log("Product Fetch Response:", prodRes);

        setCategories(catRes.data);

        //let productList = Array.isArray(prodRes?.data) ? prodRes.data : prodRes?.data?.data || [];
        let productList = prodRes?.data || [];

        const uniqueVendors = [
          ...new Map(productList.map((p) => [p.vendor._id, p.vendor])).values(),
        ];
        setVendors(uniqueVendors);

        if (selectedVendor) {
          productList = productList.filter((p) => p.vendor._id === selectedVendor);
        }

        productList = productList.filter(
          (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
        );

        if (sortBy === "priceLowToHigh") {
          productList.sort((a, b) => a.price - b.price);
        } else if (sortBy === "priceHighToLow") {
          productList.sort((a, b) => b.price - a.price);
        } else if (sortBy === "topRated") {
          productList.sort((a, b) => b.averageRating - a.averageRating);
        }

        setProducts(productList);

        if (prodRes?.totalPages) setTotalPages(prodRes.totalPages);

        const ratingsMap = {};
        const countMap = {};

        await Promise.all(
          productList.map(async (product) => {
            try {
              const res = await getReviewById(product._id);
              const reviews = res.data?.data || [];
              const total = reviews.reduce((sum, r) => sum + r.rating, 0);
              ratingsMap[product._id] = reviews.length ? total / reviews.length : 0;
              countMap[product._id] = reviews.length;
            } catch {
              ratingsMap[product._id] = 0;
              countMap[product._id] = 0;
            }
          })
        );

        setProductRatings(ratingsMap);
        setReviewCounts(countMap);
      } catch (err) {
        console.error("Error loading data:", err);
        setProducts([]);
      }
    };

    fetchData();
  }, [selectedCategory, selectedSubcategory, searchQuery, sortBy, priceRange, selectedVendor, currentPage]);

  const handleCategoryClick = (categoryId) => {
    navigate(`/categories?category=${categoryId}`);
  };

  const handleSubcategoryClick = (catId, subId) => {
    navigate(`/categories?category=${catId}&subcategory=${subId}`);
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      const res = await getCartItems();
      dispatch(setCart(res.data));
      toast.success("Added to cart!");
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  const renderStars = (rating = 0) => {
    const stars = [];
    const full = Math.floor(rating);
    const hasHalf = rating - full >= 0.5;

    for (let i = 0; i < full; i++) stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    if (hasHalf) stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    for (let i = stars.length; i < 5; i++) stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    return stars;
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {!selectedCategory && !searchQuery && (
        <>
          <h2 className="text-2xl font-bold mb-6 text-center">All Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categories.map((cat) => (
              <div
                key={cat._id}
                onClick={() => handleCategoryClick(cat._id)}
                className="bg-white shadow rounded p-4 flex flex-col items-center hover:shadow-lg transition cursor-pointer"
              >
                {cat.image && (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-24 w-24 object-contain mb-3"
                  />
                )}
                <p className="text-center font-medium text-sm text-gray-800">
                  {cat.name}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {(selectedCategory || shouldFetchAll) && (
        <>
          <div className="flex justify-between items-center mt-6 mb-4">
            <h2 className="text-xl font-bold capitalize">Products</h2>
            {selectedCategory && (
              <button
                onClick={() => navigate("/categories")}
                className="text-[#3ED6B5] hover:underline"
              >
                Back to All Categories
              </button>
            )}
          </div>

          {selectedCategory &&
            categories.find((c) => c._id === selectedCategory)?.subcategories?.length > 0 && (
              <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                {categories
                  .find((c) => c._id === selectedCategory)
                  .subcategories.map((sub) => (
                    <button
                      key={sub._id}
                      onClick={() => handleSubcategoryClick(selectedCategory, sub._id)}
                      className={`px-4 py-1 rounded border ${
                        selectedSubcategory === sub._id.toString()
                          ? "bg-[#3ED6B5] text-white border-transparent"
                          : "border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
              </div>
            )}

          <div className="flex flex-wrap gap-4 items-center mb-6">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border px-3 py-1 rounded"
            >
              <option value="default">Sort by</option>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="priceHighToLow">Price: High to Low</option>
              <option value="topRated">Top Rated</option>
            </select>

            <select
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value)}
              className="border px-3 py-1 rounded"
            >
              <option value="">All Vendors</option>
              {vendors.map((v) => (
                <option key={v._id} value={v._id}>{v.storeName}</option>
              ))}
            </select>

            <div className="flex gap-2 items-center">
              <label className="text-sm">Price:</label>
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                className="border px-2 py-1 w-20 rounded"
              />
              <span className="mx-1">-</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                className="border px-2 py-1 w-20 rounded"
              />
            </div>
          </div>

          {products.length === 0 ? (
            <p>No products found for this category.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white shadow rounded p-4 relative hover:shadow-lg transition cursor-pointer"
                  >
                    <div
                      onClick={() => navigate(`/product/${product._id}`)}
                      role="button"
                      tabIndex={0}
                      className="bg-white shadow rounded p-4 relative hover:shadow-lg transition cursor-pointer"
                    >
                      <img
                        src={product.images?.[0] || "https://via.placeholder.com/150"}
                        alt={product.name || "Product"}
                        className="h-32 w-full object-contain mb-2"
                      />
                      <h3 className="font-semibold text-sm mb-1">
                        {product.name || "Unnamed Product"}
                      </h3>
                      <div className="flex items-center gap-1 text-xs mb-1">
                        {renderStars(productRatings[product._id] || 0)}
                        <span className="text-gray-500">({reviewCounts[product._id] || 0})</span>
                      </div>
                      <p className="text-[#3ED6B5] font-bold text-sm">
                      ₹{product.price}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      className="absolute top-2 right-2 bg-[#3ED6B5] text-white p-1 rounded-full hover:bg-[#32bfa1]"
                      title="Add to Cart"
                    >
                      <FaShoppingCart size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Prev
                  </button>

                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-3 py-1 border rounded ${
                        currentPage === index + 1 ? "bg-[#3ED6B5] text-white" : ""
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CategoriesPage;