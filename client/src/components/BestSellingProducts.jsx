/*import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBestSellingProducts } from '../services/productServices';
import { getReviewById } from '../services/reviewServices';
import { addToCart, getCartItems } from '../services/cartServices';
import { useDispatch } from 'react-redux';
import { setCart } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import { FaShoppingCart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const BestSellingProducts = ({ isPreview = false }) => {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const displayedProducts = isPreview ? bestSellers.slice(0, 5) : bestSellers;

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await getBestSellingProducts();
        const products = Array.isArray(res.data) ? res.data : [];
        setBestSellers(products);

        const ratingsMap = {};
        const reviewsMap = {};

        await Promise.all(
          products.map(async (product) => {
            try {
              const res = await getReviewById(product._id);
              const reviewList = res.data?.data || [];
              const total = reviewList.reduce((sum, r) => sum + r.rating, 0);
              ratingsMap[product._id] = reviewList.length ? total / reviewList.length : 0;
              reviewsMap[product._id] = reviewList.length;
            } catch {
              ratingsMap[product._id] = 0;
              reviewsMap[product._id] = 0;
            }
          })
        );

        setRatings(ratingsMap);
        setReviews(reviewsMap);
      } catch (error) {
        console.error('Failed to fetch best-selling products:', error);
        toast.error('Error loading best sellers.');
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);


  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      const res = await getCartItems();
      dispatch(setCart(res.data));
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
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
    <section className={`${isPreview ? "py-0" : "py-12"} bg-white`}>

      <div className="container mx-auto px-4">
      {!isPreview && (
  <h3 className="text-2xl font-bold text-[#3ED6B5] mb-6 text-center">Best Selling Products</h3>
)}


        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : bestSellers.length === 0 ? (
          <p className="text-center text-gray-500">No best-selling products available.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
            {displayedProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="bg-white shadow rounded p-4 relative flex flex-col justify-between hover:shadow-lg transition cursor-pointer"
              >
                
                <img
                  src={product.images?.[0] || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="h-40 w-full object-contain mb-2"
                />

               
                <h3 className="text-md font-semibold text-gray-800 mb-1">{product.name}</h3>

                
                <div className="flex items-center gap-1 text-sm mb-1">
                  {renderStars(ratings[product._id] || 0)}
                  <span className="text-gray-500 text-xs">({reviews[product._id] || 0})</span>
                </div>

               
                <p className="text-emerald-500 font-bold text-base">₹{product.price}</p>

               
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product._id);
                  }}
                  className="absolute bottom-3 right-3 bg-[#3ED6B5] hover:bg-[#32bfa1] text-white p-2 rounded-full shadow"
                  title="Add to Cart"
                >
                  <FaShoppingCart size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSellingProducts;
*/
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBestSellingProducts } from '../services/productServices';
import { getReviewById } from '../services/reviewServices';
import { addToCart, getCartItems } from '../services/cartServices';
import { useDispatch } from 'react-redux';
import { setCart } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import { FaShoppingCart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const BestSellingProducts = ({ isPreview = false }) => {
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const displayedProducts = isPreview ? bestSellers.slice(0, 5) : bestSellers;

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await getBestSellingProducts({ page: 1, limit: isPreview ? 5 : 20 });
        const products = Array.isArray(res.data) ? res.data : [];
        setBestSellers(products);

        const ratingsMap = {};
        const reviewsMap = {};

        await Promise.all(
          products.map(async (product) => {
            try {
              const res = await getReviewById(product._id);
              const reviewList = res.data?.data || [];
              const total = reviewList.reduce((sum, r) => sum + r.rating, 0);
              ratingsMap[product._id] = reviewList.length ? total / reviewList.length : 0;
              reviewsMap[product._id] = reviewList.length;
            } catch {
              ratingsMap[product._id] = 0;
              reviewsMap[product._id] = 0;
            }
          })
        );

        setRatings(ratingsMap);
        setReviews(reviewsMap);
      } catch (error) {
        console.error('Failed to fetch best-selling products:', error);
        toast.error('Error loading best sellers.');
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      const res = await getCartItems();
      dispatch(setCart(res.data));
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
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
    <section className={`${isPreview ? "py-0" : "py-12"} bg-white`}>
      <div className="container mx-auto px-4">
        {!isPreview && (
          <h3 className="text-2xl font-bold text-[#3ED6B5] mb-6 text-center">Best Selling Products</h3>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : bestSellers.length === 0 ? (
          <p className="text-center text-gray-500">No best-selling products available.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10">
            {displayedProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="bg-white shadow rounded p-4 relative flex flex-col justify-between hover:shadow-lg transition cursor-pointer"
              >
                <img
                  src={product.images?.[0] || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="h-40 w-full object-contain mb-2"
                />

                <h3 className="text-md font-semibold text-gray-800 mb-1">{product.name}</h3>

                <div className="flex items-center gap-1 text-sm mb-1">
                  {renderStars(ratings[product._id] || 0)}
                  <span className="text-gray-500 text-xs">({reviews[product._id] || 0})</span>
                </div>

                <p className="text-emerald-500 font-bold text-base">₹{product.price}</p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product._id);
                  }}
                  className="absolute bottom-3 right-3 bg-[#3ED6B5] hover:bg-[#32bfa1] text-white p-2 rounded-full shadow"
                  title="Add to Cart"
                >
                  <FaShoppingCart size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSellingProducts;