/*import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllProducts } from "../../services/productServices";
import ProductCard from "../../components/productCard";
import { getCategory } from "../../services/categoryServices";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const selectedSubcategory = searchParams.get("subcategory");
  const searchQuery = searchParams.get("search")?.trim().toLowerCase() || "";

/*
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();
       
        let allProducts = Array.isArray(res.data.data) ? res.data.data : [];

        // Debug log
        console.log("🔍 Search Query:", searchQuery);
        console.log("📦 All Products:", allProducts);

        let filtered = allProducts;

        if (selectedCategory) {
          filtered = filtered.filter(
            (p) => p.category?._id === selectedCategory
          );
        }

        if (selectedSubcategory) {
          filtered = filtered.filter((p) => {
            const subcategoryId = p.subcategory?._id || p.subcategory;
            return subcategoryId === selectedSubcategory;
          });
        }
        

        if (searchQuery) {
          filtered = filtered.filter((p) => {
            const name = p.name || "";
            const category = p.category?.name || "";
            const subcategory = p.subcategory?.name || "";
            return `${name} ${category} ${subcategory}`
              .toLowerCase()
              .includes(searchQuery);
          });
        }

        setProducts(filtered);
      } catch (err) {
        console.error("❌ Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedSubcategory, searchQuery]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategory();
        setCategories(res.data);
      } catch (error) {
        console.error("❌ Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);  */

  /*useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();
        let allProducts = Array.isArray(res.data.data) ? res.data.data : [];

        let filtered = allProducts;

        if (selectedCategory) {
          filtered = filtered.filter((p) => p.category?._id === selectedCategory);
        }

        if (selectedSubcategory) {
          filtered = filtered.filter((p) => {
            const subcategoryId = p.subcategory?._id || p.subcategory;
            return subcategoryId === selectedSubcategory;
          });
        }

        if (searchQuery) {
          filtered = filtered.filter((p) => {
            const name = p.name?.toLowerCase() || "";
            const category = p.category?.name?.toLowerCase() || "";
            const subcategory = p.subcategory?.name?.toLowerCase() || "";
            return `${name} ${category} ${subcategory}`.includes(searchQuery);
          });
        }

        setProducts(filtered);
      } catch (err) {
        console.error("❌ Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedSubcategory, searchQuery]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategory();
        setCategories(res.data);
      } catch (error) {
        console.error("❌ Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6 text-blue-800 text-center">
        Explore Our Products
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No products found.</p>
          {searchQuery && (
            <p className="text-sm">Try a different keyword or check spelling.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPage; 

*/

import React, { useEffect, useState } from "react";
import { useSearchParams, useLocation  } from "react-router-dom";
import { getAllProducts } from "../../services/productServices";
import ProductCard from "../../components/productCard";
import { getCategory } from "../../services/categoryServices";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const selectedSubcategory = searchParams.get("subcategory");
  const searchQuery = searchParams.get("search")?.trim().toLowerCase() || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();
        let allProducts = Array.isArray(res.data.data) ? res.data.data : [];

        // Debug log
        console.log("🔍 Search Query:", searchQuery);
        console.log("📦 All Products:", allProducts);

        let filtered = allProducts;

        // Filter by category
        if (selectedCategory) {
          filtered = filtered.filter(
            (p) => p.category?._id === selectedCategory
          );
        }

        // Filter by subcategory
        if (selectedSubcategory) {
          filtered = filtered.filter((p) => {
            const subcategoryId = p.subcategory?._id || p.subcategory;
            return subcategoryId === selectedSubcategory;
          });
        }

        // Case-insensitive search
        if (searchQuery) {
          filtered = filtered.filter((p) => {
            const name = (p.name || "").toLowerCase();
            const category = (p.category?.name || "").toLowerCase();
            const subcategory = (p.subcategory?.name || "").toLowerCase();

            // Debugging the comparison
            console.log(`Checking: ${name} ${category} ${subcategory} against ${searchQuery}`);
            return `${name} ${category} ${subcategory}`.includes(searchQuery);
          });
        }

        setProducts(filtered);
      } catch (err) {
        console.error("❌ Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedSubcategory, searchQuery]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategory();
        setCategories(res.data);
      } catch (error) {
        console.error("❌ Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6 text-blue-800 text-center">
        Explore Our Products
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No products found.</p>
          {searchQuery && (
            <p className="text-sm">Try a different keyword or check spelling.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopPage;  

