import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaBars, FaStore, FaTimes } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { getCategory } from "../services/categoryServices";


const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const cartItems = useSelector((state) => state.cart.items);


  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [categories, setCategories] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const dropdownRef = useRef();
  const accountRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategory();
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/categories?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  
  };


  const handleCategoryClick = (categoryId, subcategoryId = null) => {
    const params = new URLSearchParams();
    params.set("category", categoryId);
    if (subcategoryId) params.set("subcategory", subcategoryId);
    navigate(`/categories?${params.toString()}`);
    setShowDropdown(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm relative z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold">
          <span className="text-[#3ED6B5]">Nezi</span>
          <span className="text-gray-800">Cart</span>
        </Link>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-800 text-2xl">
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-6 items-center">
          <input
            type="text"
            placeholder="Search products, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3ED6B5]"
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-[#3ED6B5] text-white rounded hover:bg-[#31b9a1]"
          >
            Search
          </button>
        </form>

        <div className="hidden md:flex items-center gap-6">
       
        <Link to="/cart" className="relative">
      <FaShoppingCart size={20} />
      {cartItems.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {cartItems.length}
        </span>
      )}
    </Link>
          <div className="relative" ref={accountRef}>
            <button
              onClick={() => setShowAccountMenu(!showAccountMenu)}
              className="flex items-center gap-2 text-gray-700 hover:text-[#3ED6B5]"
            >
              <FaUser size={20} />
              <span className="font-bold text-sm">{user ? user.name?.split(" ")[0] || user.email : "Sign In"}</span>
            </button>

            {showAccountMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded p-2 z-50 border text-sm">
                {user ? (
                  <>
                    <p className="px-2 py-1 text-gray-600 font-medium border-b">
                      Hello, {user.name || user.email}
                    </p>
                    <Link to={`/${user.role}/dashboard`} onClick={() => setShowAccountMenu(false)} className="block px-2 py-1 hover:bg-gray-100">My Profile</Link>
                    <Link to={`/${user.role}/dashboard?tab=orders`}  onClick={() => setShowAccountMenu(false)} className="block px-2 py-1 hover:bg-gray-100">Orders</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-2 py-1 hover:bg-gray-100">Logout</button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setShowAccountMenu(false)} className="block w-full bg-[#3ED6B5] hover:bg-[#31b9a1] text-center text-sm font-semibold text-white py-2 rounded">
                    Sign In
                  </Link>
                )}
              </div>
            )}
          </div>

          
        </div>
      </div>

      <nav className="bg-[#3ED6B5] border-t border-gray-200 text-white hidden md:block">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-8" ref={dropdownRef}>
            <div onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2 font-medium hover:text-white cursor-pointer">
              <FaBars />
              <span>Categories</span>
            </div>

            {showDropdown && (
              <div className="absolute top-16 left-4 mt-2 bg-white text-gray-800 shadow-lg rounded w-64 z-50">
                {categories.map((cat) => (
                  <div key={cat._id} className="border-b border-gray-100">
                    <span onClick={() => handleCategoryClick(cat._id)} className="block px-4 py-2 font-semibold hover:bg-gray-100 cursor-pointer">
                      {cat.name}
                    </span>
                    {cat.subcategories?.length > 0 && (
                      <div className="pl-4 text-sm">
                        {cat.subcategories.map((sub) => (
                          <span key={sub._id} onClick={() => handleCategoryClick(cat._id, sub._id)} className="block px-4 py-1 text-gray-600 hover:bg-gray-100 cursor-pointer">
                            {sub.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            

            <Link to="/" className="hover:text-white font-medium">Home</Link>
            <Link to="/best-sellers" className="hover:text-white font-medium">Best Sellers</Link>
            <Link to="/new-arrivals" className="hover:text-white font-medium">New Arrivals</Link>
          </div>

          <Link to="/vendor/register" className="flex items-center gap-2 bg-white text-[#3ED6B5] px-3 py-1 rounded hover:bg-gray-100 transition text-sm font-semibold border border-[#3ED6B5]">
            <FaStore /> Become a Seller
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
