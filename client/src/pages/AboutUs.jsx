import React from "react";

const AboutUs = () => {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
       
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
          About NeziCart
        </h1>
        <p className="text-md sm:text-lg text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          NeziCart is a next-generation multi-vendor marketplace designed to empower businesses and connect customers to a diverse range of quality products — all in one place.
        </p>

     
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-20">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-emerald-600 mb-4">🌟 Our Mission</h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              At NeziCart, we aim to revolutionize online shopping by providing a seamless and secure platform where vendors grow and customers shop with confidence.
              We are committed to offering a wide variety of curated products, outstanding support, and fast delivery.
            </p>
          </div>
          <div className="flex justify-center">
          <img
  src="https://img.freepik.com/premium-vector/shopping-bag-handbag-sale-discount-promotion-shopping-concept_165488-4527.jpg"
  alt="Marketplace"
  className="rounded-lg shadow-md w-full max-w-[250px] h-auto object-contain"
/>
          </div>
        </div>

      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-20">
          <div className="md:order-2">
            <h2 className="text-2xl sm:text-3xl font-semibold text-emerald-600 mb-4">🚀 Our Vision</h2>
            <p className="text-gray-700 leading-relaxed text-justify">
              We envision NeziCart as a trusted name in e-commerce, where technology, innovation, and service combine to create a customer-first shopping experience.
              Our goal is to scale globally while supporting local vendors and ensuring ethical, secure transactions.
            </p>
          </div>
          <div className="md:order-1 flex justify-center">
       
<img
  src="https://ecommercegermany.com/wp-content/uploads/2024/05/Basic-e-Commerce-Security-Practices-1170x780.jpg"
  alt="Secure shopping"
  className="rounded-lg shadow-md w-full max-w-[250px] h-auto object-contain"
/>

          </div>
        </div>

      
        <div className="text-center mt-12">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">📍 Based in UAE, Serving Globally</h3>
          <p className="text-gray-600 max-w-xl mx-auto">
            NeziCart is proudly built and managed by a passionate team dedicated to quality, security, and customer success.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
