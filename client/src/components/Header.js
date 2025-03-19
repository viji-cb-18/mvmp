import React, { useState } from 'react';
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, HeartIcon, UserIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";


const Header = () => {
    const [searchTerm,setSearchTerm] = useState("");
    const [searchData, setSearchData] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const productData = [];

    const handleSearchChange = (e) => {
        const term = e.target.value;
        searchTerm(term);

        const filteredProducts = productData && productData.filter((product) => {
            product.name.toLowercase().includes(term.toLowercase())
        });
        setSearchData(filteredProducts);
    }

    return (
        <header className="bg-white shadow-md">
           <div className="flex items-center justify-between p-4">
      
               <div className="text-2xl font-bold text-yellow-500">
                   <span className="text-black">Shop</span>
               </div>

               <div className="flex flex-grow mx-4">
                   <input
                      type="text"
                      placeholder="Search Product..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none"
                   />
                   <button className="px-4 bg-gray-200 rounded-r-md">
                      <Search className="text-gray-500" />
                   </button>
               </div>

               <MagnifyingGlassIcon className="absolute left-3 top-2 h-5 w-5 text-gray-500" />
        </div>

        <div className="flex items-center space-x-4">
          <button className="hidden md:flex items-center px-3 py-1 bg-black text-white rounded-md text-sm">
            Become Seller
          </button>
          <HeartIcon className="h-6 w-6 text-gray-600 cursor-pointer" />
          <div className="relative">
            <ShoppingCartIcon className="h-6 w-6 text-gray-600 cursor-pointer" />
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full px-1">1</span>
          </div>
          <UserIcon className="h-6 w-6 text-gray-600 cursor-pointer" />
        
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
  
        </div>

        <nav className="bg-blue-700">
        <div className="container mx-auto px-4 flex justify-between items-center py-2 text-white">
  
          <div className="relative">
            <button className="flex items-center space-x-2">
              <Bars3Icon className="h-6 w-6" />
              <span>All Categories</span>
            </button>
          </div>

          <div className="hidden md:flex space-x-6 text-sm font-medium">
            <a href="#" className="text-green-300">Home</a>
            <a href="#">Best Selling</a>
            <a href="#">Products</a>
            <a href="#">Events</a>
            <a href="#">FAQ</a>
          </div>
        </div>
      </nav>
    </header>
    )         
      
};

export default Header;