const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { authMiddleware } = require("../middleware/auth");

module.exports = function () {
  // POST /api/upload (Base64 image upload)
  router.post("/", authMiddleware, async (req, res) => {
    try {
      const { image, folder = "general" } = req.body;
      if (!image || !image.startsWith("data:image")) {
        return res.status(400).json({ error: "Format gambar tidak valid." });
      }

      const matches = image.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
      if (!matches) {
        return res.status(400).json({ error: "Format base64 tidak valid." });
      }

      const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
      const buffer = Buffer.from(matches[2], "base64");

      const targetDir = path.join(__dirname, "..", "public", "uploads", folder);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;
      const filePath = path.join(targetDir, fileName);

      fs.writeFileSync(filePath, buffer);

      const url = `/uploads/${folder}/${fileName}`;
      return res.json({ url });
    } catch (error) {
      console.error("[POST /api/upload]", error);
      return res.status(500).json({ error: "Gagal mengunggah gambar." });
    }
  });

  return router;
};
