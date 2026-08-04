const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadToCloudinary } = require("../config/cloudinary");
const authMiddleware = require("../../middleware/auth");

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Tidak ada file gambar yang diupload" });
    }

    const imageUrl = await uploadToCloudinary(req.file.buffer, "umkm-korowelang");
    res.json({
      success: true,
      message: "Gambar berhasil diupload",
      url: imageUrl,
      imageUrl,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Gagal mengupload gambar",
    });
  }
});

module.exports = router;
