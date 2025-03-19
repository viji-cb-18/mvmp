import {  MagnifyingGlassIcon, ShoppingCartIcon, UserIcon, ChatBubbleOvalLeftEllipsisIcon,EnvelopeIcon, PhoneIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
//import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaLinkedinIn, FaPinterestP, FaMapMarkerAlt } from "react-icons/fa";


const Footer = () => {

    return (
    <footer className="bg-white py-10 border-t">
      <div className="container mx-auto px-4">
       
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
          <div>
            <div className="text-2xl font-bold text-indigo-600 flex items-center">
              <ShoppingCartIcon className="h-6 w-6 text-indigo-600 mr-2" />
              MultiVendor
            </div>
            <p className="text-gray-500 text-sm mt-2">
              Your trusted multi-vendor marketplace for top-selling products.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">Marketplace</h3>
            <ul className="mt-2 space-y-1 text-gray-500 text-sm">
              <li><a href="#">Browse Categories</a></li>
              <li><a href="#">Best Selling Products</a></li>
              <li><a href="#">Top Vendors</a></li>
              <li><a href="#">Deals & Discounts</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">Customer Support</h3>
            <ul className="mt-2 space-y-1 text-gray-500 text-sm">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Track Order</a></li>
              <li><a href="#">Returns & Refunds</a></li>
              <li><a href="#">Shipping Info</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">For Vendors</h3>
            <ul className="mt-2 space-y-1 text-gray-500 text-sm">
              <li><a href="#">Become a Seller</a></li>
              <li><a href="#">Vendor Dashboard</a></li>
              <li><a href="#">How to Sell?</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">Legal</h3>
            <ul className="mt-2 space-y-1 text-gray-500 text-sm">
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Return Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t my-6"></div>
     
        <div className="flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm">
          <p>© 2024 MultiVendor Marketplace. All rights reserved.</p>

         
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-indigo-600">
              <MagnifyingGlassIcon className="h-6 w-6" />
            </a>
            <a href="#" className="hover:text-indigo-600">
              <UserIcon className="h-6 w-6" />
            </a>
            <a href="#" className="hover:text-indigo-600">
              <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>

    )
};

export default Footer;
  