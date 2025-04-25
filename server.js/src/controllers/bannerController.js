const Banner = require("../models/Banner");
const { uploadToCloudinary } = require("../config/cloudinaryconfig");

exports.uploadBanner = async (req, res) => {
  try {
    const { title, subtitle, link } = req.body;

    if (!req.file) {
      return res.status(400).json({ msg: "No image file uploaded" });
    }

    const imageUrl = await uploadToCloudinary(req.file.buffer, "banners");

    const banner = new Banner({
      title,
      subtitle,
      link,
      image: imageUrl,
    });

    await banner.save();
    res.status(201).json({ msg: "Banner uploaded successfully", banner });
  } catch (error) {
    console.error("Error uploading banner:", error);
    res.status(500).json({ msg: "Banner upload failed", error: error.message });
  }
};

exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.status(200).json(banners);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch banners" });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params; 
    await Banner.findByIdAndDelete(id);
    res.status(200).json({ msg: "Banner deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Failed to delete banner", error: error.message });
  }
};
