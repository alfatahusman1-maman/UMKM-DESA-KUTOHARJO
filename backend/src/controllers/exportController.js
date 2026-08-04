const ExcelJS = require("exceljs");

// Dummy / store fallback getter if DB is offline
const getLocalData = () => {
  try {
    const localDb = require("../../db/local_db");
    return localDb;
  } catch (e) {
    return null;
  }
};

/**
 * Export UMKM list to Excel
 */
const exportUmkm = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Daftar UMKM");

    worksheet.columns = [
      { header: "ID", key: "id", width: 8 },
      { header: "Nama UMKM", key: "name", width: 28 },
      { header: "Pemilik", key: "ownerName", width: 20 },
      { header: "Kategori", key: "categoryName", width: 22 },
      { header: "Dusun", key: "dusun", width: 15 },
      { header: "WhatsApp", key: "whatsappNumber", width: 18 },
      { header: "Sertifikasi", key: "certifications", width: 25 },
      { header: "Rating", key: "rating", width: 10 },
      { header: "Ulasan", key: "reviewCount", width: 10 },
      { header: "Alamat", key: "address", width: 35 },
    ];

    // Style Header Row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "0F766E" }, // Emerald 700
    };

    const localDb = getLocalData();
    const umkms = localDb ? (localDb.getUmkmList ? localDb.getUmkmList() : localDb.umkms || []) : [];

    umkms.forEach((u) => {
      worksheet.addRow({
        id: u.id,
        name: u.name,
        ownerName: u.ownerName || u.owner_name || "-",
        categoryName: u.category?.name || u.category_name || "Lainnya",
        dusun: u.dusun || "-",
        whatsappNumber: u.whatsappNumber || u.whatsapp_number || "-",
        certifications: Array.isArray(u.certifications) ? u.certifications.join(", ") : "-",
        rating: u.rating || "0.00",
        reviewCount: u.reviewCount || u.review_count || 0,
        address: u.address || "-",
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=Rekap_UMKM_Korowelang_${Date.now()}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: "Gagal mengekspor data UMKM: " + err.message });
  }
};

/**
 * Export Products to Excel
 */
const exportProducts = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Katalog Produk");

    worksheet.columns = [
      { header: "ID Produk", key: "id", width: 10 },
      { header: "Nama Produk", key: "title", width: 30 },
      { header: "Harga (Rp)", key: "price", width: 18 },
      { header: "UMKM Pemilik", key: "umkmName", width: 28 },
      { header: "Deskripsi", key: "description", width: 40 },
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "0369A1" }, // Sky 700
    };

    const localDb = getLocalData();
    const products = localDb ? (localDb.getProducts ? localDb.getProducts() : localDb.products || []) : [];

    products.forEach((p) => {
      worksheet.addRow({
        id: p.id,
        title: p.title || p.name,
        price: Number(p.price || 0),
        umkmName: p.umkmName || p.umkm?.name || "-",
        description: p.description || "-",
      });
    });

    // Format currency column
    worksheet.getColumn("price").numFmt = '"Rp"#,##0.00';

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=Rekap_Produk_Korowelang_${Date.now()}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: "Gagal mengekspor produk: " + err.message });
  }
};

/**
 * Export Feedback to Excel
 */
const exportFeedback = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Masukan & Saran");

    worksheet.columns = [
      { header: "ID", key: "id", width: 8 },
      { header: "Pengirim", key: "name", width: 22 },
      { header: "Email", key: "email", width: 28 },
      { header: "Status", key: "status", width: 15 },
      { header: "Pesan", key: "message", width: 50 },
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "475569" }, // Slate 600
    };

    const localDb = getLocalData();
    const feedbacks = localDb ? (localDb.getFeedbacks ? localDb.getFeedbacks() : localDb.feedbacks || []) : [];

    feedbacks.forEach((f) => {
      worksheet.addRow({
        id: f.id,
        name: f.name,
        email: f.email,
        status: f.status || "pending",
        message: f.message,
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=Rekap_Masukan_${Date.now()}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: "Gagal mengekspor masukan: " + err.message });
  }
};

module.exports = {
  exportUmkm,
  exportProducts,
  exportFeedback,
};
