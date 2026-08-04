const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "demo",
  api_key: process.env.CLOUDINARY_API_KEY || "1234567890",
  api_secret: process.env.CLOUDINARY_API_SECRET || "secret",
});

/**
 * Upload buffer to Cloudinary
 * @param {Buffer} fileBuffer 
 * @param {string} folder 
 * @returns {Promise<string>} Image URL
 */
const uploadToCloudinary = (fileBuffer, folder = "umkm-korowelang") => {
  return new Promise((resolve, reject) => {
    // If cloudinary credentials aren't set, return mock or base64 data-uri for dev
    if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === "demo") {
      const mimeType = "image/jpeg";
      const base64 = fileBuffer.toString("base64");
      return resolve(`data:${mimeType};base64,${base64}`);
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
};
