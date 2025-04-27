import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import BestSellingProducts from "../../components/BestSellingProducts";
import NewArrivalsPage from "../Customer/NewArrivalsPage"; 
import { getBestSellingProducts } from "../../services/productServices";

const Home = () => {
 
  const [banners, setBanners] = useState([]);

  useEffect(() => {

    const fetchBanners = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/banners");
        const data = res.data;
        if (Array.isArray(data)) {
          setBanners(data);
        } else if (Array.isArray(data.data)) {
          setBanners(data.data);
        } else {
          setBanners([]);
        }
      } catch (err) {
        console.error("Failed to fetch banners", err);
        setBanners([]);
      }
    };

    fetchBanners();
  }, []);

  return (
    <>
     
      <section className="bg-gray-100">
        <div className="w-full">
          <Carousel
            showThumbs={false}
            autoPlay
            infiniteLoop
            showStatus={false}
            showIndicators={true}
            interval={5000}
          >
            {Array.isArray(banners) &&
              banners.map((banner) => (
                <div
                  key={banner._id}
                  className="w-full h-[400px] md:h-[550px] lg:h-[600px] bg-no-repeat bg-center bg-cover flex items-center"
                  style={{ backgroundImage: `url(${banner.image})` }}
                >
                  <div className="container mx-auto px-4 md:px-6 lg:px-10 text-white">
                    <div className="max-w-xl space-y-4 text-left md:text-left">
                      {banner.subtitle && (
                        <h4 className="text-sm uppercase font-medium tracking-wide text-blue-200">
                          {banner.subtitle}
                        </h4>
                      )}
                      {banner.title && (
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight drop-shadow">
                          {banner.title}
                        </h1>
                      )}
                      {banner.link && (
                        <Link
                          to="/categories"
                          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded shadow transition"
                        >
                          Shop Now
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </Carousel>
        </div>
      </section>

   
    
<section className="py-12 bg-white">
  <div className="container mx-auto px-4 md:px-6 lg:px-10">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-gray-800">New Arrivals</h2>
      <Link to="/new-arrivals" className="text-blue-600 hover:underline text-sm font-medium">
        View all
      </Link>
    </div>
    <NewArrivalsPage isPreview />
  </div>
</section>


    
      <section className="bg-gradient-to-b from-white via-blue-50 to-purple-50 border-t py-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            {
              icon: "/icons/fast-delivery-truck-svgrepo-com.svg",
              title: "Free Delivery",
              desc: "For all orders over $99",
            },
            {
              icon: "/icons/package-return-logistic-svgrepo-com.svg",
              title: "90 Days Return",
              desc: "If goods have problems",
            },
            {
              icon: "/icons/secure-payment-svgrepo-com.svg",
              title: "Secure Payment",
              desc: "100% secure payment",
            },
            {
              icon: "/icons/headphone-svgrepo-com.svg",
              title: "24/7 Support",
              desc: "Dedicated support",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300"
            >
              <img src={item.icon} alt={item.title} className="h-10 mb-4" />
              <h4 className="text-lg font-bold text-blue-900 mb-1">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>


      <section className="py-12 bg-white">
  <div className="container mx-auto px-4 md:px-6 lg:px-10">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-gray-800">Top Selling</h2>
      <Link to="/best-sellers" className="text-blue-600 hover:underline text-sm font-medium">
        View all
      </Link>
    </div>
    <BestSellingProducts isPreview />
  </div>
</section>
    </>
  );
};

export default Home;
