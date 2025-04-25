import React, { useEffect, useState } from "react";
import { uploadBanner, getBanners, deleteBanner } from "../../services/bannerServices";
import { toast } from "react-toastify";

const BannerPage = () => {
  const [form, setForm] = useState({ title: "", subtitle: "", link: "", image: null });
  const [banners, setBanners] = useState([]);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const fetchBanners = async () => {
    try {
      const res = await getBanners();
      setBanners(res.data || []);
    } catch {
      toast.error("Failed to load banners");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.image) return toast.warning("Title and image are required");

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) payload.append(key, value);
    });

    try {
      await uploadBanner(payload);
      toast.success("Banner uploaded successfully");
      setForm({ title: "", subtitle: "", link: "", image: null });
      setPreview(null);
      fetchBanners();
    } catch {
      toast.error("Banner upload failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this banner?")) {
      try {
        await deleteBanner(id);
        toast.success("Banner deleted");
        fetchBanners();
      } catch {
        toast.error("Failed to delete banner");
      }
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-xl rounded-xl">
      <h2 className="text-2xl font-bold text-[#2D70E4] mb-6">Upload New Banner</h2>

      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="space-y-4">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Banner Title *"
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#7AC3F1] outline-none"
          />
          <input
            type="text"
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
            placeholder="Subtitle"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#7AC3F1] outline-none"
          />
          <input
            type="text"
            name="link"
            value={form.link}
            onChange={handleChange}
            placeholder="Optional: Link (https://)"
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#7AC3F1] outline-none"
          />
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            name="image"
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg file:cursor-pointer file:text-sm file:mr-4"
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-[#2D70E4] to-[#7AC3F1] text-white font-semibold px-6 py-2 rounded-lg shadow hover:opacity-90 transition"
          >
            Upload Banner
          </button>
        </div>

        {preview && (
          <div className="flex justify-center items-center">
            <img
              src={preview}
              alt="Preview"
              className="rounded-lg shadow-lg max-h-60 object-contain border"
            />
          </div>
        )}
      </form>

     
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Existing Banners</h3>
      {banners.length === 0 ? (
        <p className="text-gray-500">No banners uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className="relative bg-white rounded-lg border border-gray-200 overflow-hidden shadow transition hover:shadow-md"
            >
              <div
                className="w-full h-44 bg-cover bg-center"
                style={{ backgroundImage: `url(${banner.image})` }}
              ></div>
              <div className="p-4">
                <h4 className="text-lg font-semibold text-[#2D70E4]">{banner.title}</h4>
                <p className="text-sm text-gray-600">{banner.subtitle}</p>
                {banner.link && (
                  <a
                    href={banner.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 mt-2 inline-block hover:underline"
                  >
                    🔗 Visit Link
                  </a>
                )}
              </div>
              <button
                onClick={() => handleDelete(banner._id)}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600 shadow"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerPage;
