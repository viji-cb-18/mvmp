import { Outlet, useNavigate } from "react-router-dom";
import { FaUser, FaListAlt, FaHistory } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { Link } from "react-router-dom"; 

const CustomerLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      dispatch(logout());
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      
      <header className="bg-[#00C896] text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-3xl font-bold">
    <span className="text-white">Nezi</span>
    <span className="text-gray-800  px-1 rounded">Cart</span>
  </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white text-[#00C896] px-4 py-2 rounded hover:bg-gray-100 transition text-sm font-medium"
        >
          <FiLogOut size={16} /> Logout
        </button>
      </header>

      <div className="flex flex-1">
       
        <aside className="bg-[#1f1f1f] w-64 min-h-full px-6 py-8 text-white">
          <h2 className="text-2xl font-bold text-white mb-10 tracking-wide">My Account</h2>
          <nav className="space-y-3">
            <a href="#welcome" className="block px-3 py-2 rounded hover:bg-[#2e2e2e] transition">
              👋 Welcome
            </a>
            <a href="#profile" className="block px-3 py-2 rounded hover:bg-[#2e2e2e] transition">
              ⚙️ Profile Settings
            </a>
            <a href="#orders" className="block px-3 py-2 rounded hover:bg-[#2e2e2e] transition">
              🛍️ Recent Orders
            </a>
            <a href="#history" className="block px-3 py-2 rounded hover:bg-[#2e2e2e] transition">
              📜 Order History
            </a>
          </nav>
        </aside>

       
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;
