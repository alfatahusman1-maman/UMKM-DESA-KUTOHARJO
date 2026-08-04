const express = require("express");
const router = express.Router();
const { exportUmkm, exportProducts, exportFeedback } = require("../controllers/exportController");
const authMiddleware = require("../../middleware/auth");

router.get("/umkm", exportUmkm);
router.get("/produk", exportProducts);
router.get("/feedback", exportFeedback);

module.exports = router;
